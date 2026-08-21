import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const period = await prisma.competitionPeriod.findFirst({ where: { isActive: true } });
  if (!period) return NextResponse.json({ period: null, data: [] });
  const participants = await prisma.competitionParticipant.findMany({ where: { periodId: period.id, finalScore: { not: null } }, include: { innovation: true, institution: true }, orderBy: { finalScore: "desc" } });
  return NextResponse.json({ period, data: participants.map((item, index) => ({ rank: index + 1, id: item.id, innovationName: item.innovation.name, organization: item.institution.name, score: Number(item.finalScore), status: item.status })) });
}
