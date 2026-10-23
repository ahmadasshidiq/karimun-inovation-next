import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { canAccessCompetition, competitionRole } from "@/lib/competition-permission";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  if (!canAccessCompetition(user, "get-by-id"))
    return NextResponse.json({ message: "Anda tidak memiliki akses ke peserta ini." }, { status: 403 });
  const { id } = await context.params;
  const data = await prisma.competitionParticipant.findUnique({ where: { id }, include: { period: true, innovation: true, institution: true, documents: true, verifications: { include: { verifier: true }, orderBy: { createdAt: "desc" } }, judgeAssignments: { include: { judge: true } }, assessments: { include: { judge: true, scores: { include: { indicator: true } } } }, activityLogs: { include: { user: true }, orderBy: { createdAt: "desc" } } } });
  if (data && user.role.name === competitionRole.OPD_ADMIN && data.institutionId !== user.institutionId)
    return NextResponse.json({ message: "Anda tidak memiliki akses ke peserta ini." }, { status: 403 });
  if (data && user.role.name === competitionRole.JUDGE && !data.judgeAssignments.some((item) => item.judgeId === user.id))
    return NextResponse.json({ message: "Anda belum ditugaskan pada peserta ini." }, { status: 403 });
  return data ? NextResponse.json({ data }) : NextResponse.json({ message: "Peserta tidak ditemukan." }, { status: 404 });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const participant = await prisma.competitionParticipant.findUnique({ where: { id } });
  if (!participant) return NextResponse.json({ message: "Peserta tidak ditemukan." }, { status: 404 });
  const nextStatus = body.action === "submit" ? (participant.status === "NEEDS_REVISION" ? "RESUBMITTED" : "WAITING_VERIFICATION") : body.action === "verify" && ["VERIFIED", "NEEDS_REVISION", "REJECTED"].includes(body.decision) ? body.decision : null;
  if (body.action === "submit" && (!canAccessCompetition(user, "submit") || participant.institutionId !== user.institutionId))
    return NextResponse.json({ message: "Anda tidak memiliki akses untuk mengajukan inovasi ini." }, { status: 403 });
  if (body.action === "verify" && !canAccessCompetition(user, "verify"))
    return NextResponse.json({ message: "Anda tidak memiliki akses untuk memverifikasi inovasi." }, { status: 403 });
  if (!nextStatus) return NextResponse.json({ message: "Aksi tidak valid." }, { status: 400 });
  if (nextStatus === "NEEDS_REVISION" && !String(body.notes || "").trim()) return NextResponse.json({ message: "Catatan wajib diisi untuk status Perlu Perbaikan." }, { status: 400 });
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.competitionParticipant.update({ where: { id }, data: { status: nextStatus, submittedAt: body.action === "submit" ? new Date() : undefined } });
    if (body.action === "verify") await tx.competitionVerification.create({ data: { participantId: id, verifierId: user.id, checklist: body.checklist || {}, notes: String(body.notes || "") || null, decision: nextStatus } });
    await tx.competitionActivityLog.create({ data: { participantId: id, userId: user.id, activity: body.action === "submit" ? "Inovasi diajukan" : "Verifikasi dilakukan", description: body.notes || `Status berubah menjadi ${nextStatus}.` } });
    return result;
  });
  return NextResponse.json({ message: "Status lomba berhasil diperbarui.", data: updated });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  if (!canAccessCompetition(user, "delete"))
    return NextResponse.json({ message: "Anda tidak memiliki akses untuk menghapus draft." }, { status: 403 });
  const { id } = await context.params;
  const participant = await prisma.competitionParticipant.findUnique({ where: { id } });
  if (!participant || participant.createdById !== user.id || participant.status !== "DRAFT") return NextResponse.json({ message: "Hanya draft milik Anda yang dapat dihapus." }, { status: 403 });
  await prisma.competitionParticipant.delete({ where: { id } });
  return NextResponse.json({ message: "Draft lomba dihapus." });
}
