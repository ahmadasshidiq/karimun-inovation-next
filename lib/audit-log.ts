import { Prisma } from "@prisma/client";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { getClientIp } from "@/lib/login-rate-limit";
import { prisma } from "@/lib/prisma";

type AuditLogInput = {
  request: Request;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export async function recordAuditLog({
  request,
  userId,
  action,
  entity,
  entityId,
  metadata,
}: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        entity,
        entityId: entityId ?? null,
        metadata,
        ipAddress: getClientIp(request).slice(0, 64),
        userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      },
    });
  } catch (error) {
    console.error("Gagal mencatat audit log", error);
  }
}

type RouteContext = { params?: Promise<Record<string, string | string[]>> };

export function withAudit<R extends Request, C extends RouteContext | undefined>(
  entity: string,
  handler: (request: R, context: C) => Promise<Response>,
) {
  return async (request: R, context: C) => {
    const actor = await getAuthenticatedUser();
    const response = await handler(request, context);

    if (response.status < 400 || [401, 403].includes(response.status)) {
      const params = context?.params ? await context.params : undefined;
      const entityId = params?.id ?? Object.values(params ?? {}).at(-1);

      await recordAuditLog({
        request,
        userId: actor?.id,
        action:
          response.status < 400 ? request.method : `${request.method}_DENIED`,
        entity,
        entityId: Array.isArray(entityId) ? entityId.join("/") : entityId,
        metadata: {
          path: new URL(request.url).pathname,
          status: response.status,
          ...(params ? { params } : {}),
        },
      });
    }

    return response;
  };
}
