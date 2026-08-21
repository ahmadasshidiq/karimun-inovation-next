import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const period = await prisma.competitionPeriod.findFirst({ where: { isActive: true } });
  const registered = period ? await prisma.competitionParticipant.findMany({ where: { periodId: period.id }, select: { innovationId: true } }) : [];
  const data = await prisma.innovation.findMany({
    where: { createdBy: { institutionId: user.institutionId }, deletedAt: null, id: { notIn: registered.map((item) => item.innovationId) } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: data.map((item) => ({ id: item.id, name: item.name, stage: item.implementationPeriod ? "Penerapan" : item.trialPeriod ? "Uji Coba" : "Inisiatif", governmentAffair: item.governmentAffairs || "-", implementationDate: item.implementationPeriod?.toISOString().slice(0, 10) || "-", status: item.status })) });
}

