import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/auth-user";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const dateBoundary = (value: string | null, endOfDay: boolean) =>
  value && DATE_PATTERN.test(value)
    ? new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+07:00`)
    : null;

export async function GET(request: NextRequest) {
  const access = await requirePermission("audit-logs", "get-all");
  if (!access.user) return access.response;

  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 10));
  const search = params.get("search")?.trim().slice(0, 100) || "";
  const action = params.get("action");
  const entity = params.get("entity");
  const userId = params.get("userId");
  const startDate = dateBoundary(params.get("startDate"), false);
  const endDate = dateBoundary(params.get("endDate"), true);

  const where: Prisma.AuditLogWhereInput = {
    ...(action && action !== "all" ? { action } : {}),
    ...(entity && entity !== "all" ? { entity } : {}),
    ...(userId && userId !== "all" ? { userId } : {}),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { ipAddress: { contains: search, mode: "insensitive" } },
            { entityId: { contains: search, mode: "insensitive" } },
            {
              user: {
                OR: [
                  { fullname: { contains: search, mode: "insensitive" } },
                  { username: { contains: search, mode: "insensitive" } },
                ],
              },
            },
          ],
        }
      : {}),
  };

  const [data, total, actions, entities, users] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        metadata: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        user: { select: { id: true, fullname: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      distinct: ["action"],
      select: { action: true },
      orderBy: { action: "asc" },
    }),
    prisma.auditLog.findMany({
      distinct: ["entity"],
      select: { entity: true },
      orderBy: { entity: "asc" },
    }),
    prisma.user.findMany({
      where: { auditLogs: { some: {} } },
      select: { id: true, fullname: true },
      orderBy: { fullname: "asc" },
    }),
  ]);

  return NextResponse.json({
    data,
    total,
    canExport: hasPermission(access.user.role.permission, "audit-logs", "export"),
    options: {
      actions: actions.map((item) => item.action),
      entities: entities.map((item) => item.entity),
      users: users.map((user) => ({ id: user.id, name: user.fullname })),
    },
  });
}
