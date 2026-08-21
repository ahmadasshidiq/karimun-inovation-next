import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { canAccessCompetition } from "@/lib/competition-permission";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  if (!canAccessCompetition(user, "assess"))
    return NextResponse.json({ message: "Anda tidak memiliki akses penilaian." }, { status: 403 });
  const { id } = await context.params;
  const participant = await prisma.competitionParticipant.findUnique({ where: { id }, include: { innovation: true, institution: true, period: { include: { indicators: { where: { isActive: true }, orderBy: { position: "asc" } } } } } });
  if (!participant) return NextResponse.json({ message: "Peserta tidak ditemukan." }, { status: 404 });
  const assessment = await prisma.competitionAssessment.findUnique({ where: { participantId_judgeId: { participantId: id, judgeId: user.id } }, include: { scores: true } });
  return NextResponse.json({ data: { participant, indicators: participant.period.indicators, assessment } });
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  if (!canAccessCompetition(user, "assess"))
    return NextResponse.json({ message: "Anda tidak memiliki akses penilaian." }, { status: 403 });
  const { id } = await context.params;
  const assignment = await prisma.competitionJudgeAssignment.findUnique({ where: { participantId_judgeId: { participantId: id, judgeId: user.id } } });
  if (!assignment) return NextResponse.json({ message: "Anda belum ditugaskan sebagai juri untuk inovasi ini." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const participant = await prisma.competitionParticipant.findUnique({ where: { id }, include: { period: { include: { indicators: { where: { isActive: true } } } } } });
  if (!participant) return NextResponse.json({ message: "Peserta tidak ditemukan." }, { status: 404 });
  const scores = Array.isArray(body.scores) ? body.scores : [];
  const normalized = participant.period.indicators.map((indicator) => {
    const input = scores.find((score: { indicatorId?: string }) => score.indicatorId === indicator.id);
    const value = Math.min(indicator.maxScore, Math.max(indicator.minScore, Number(input?.score) || 0));
    return { indicatorId: indicator.id, score: value, weightedScore: value * Number(indicator.weight) / 100, notes: String(input?.notes || "") || null };
  });
  const totalScore = normalized.reduce((sum, item) => sum + item.weightedScore, 0);
  const submitted = body.submit === true;
  await prisma.$transaction(async (tx) => {
    const assessment = await tx.competitionAssessment.upsert({ where: { participantId_judgeId: { participantId: id, judgeId: user.id } }, create: { participantId: id, judgeId: user.id, status: submitted ? "SUBMITTED" : "DRAFT", totalScore, submittedAt: submitted ? new Date() : null }, update: { status: submitted ? "SUBMITTED" : "DRAFT", totalScore, submittedAt: submitted ? new Date() : null } });
    for (const score of normalized) await tx.competitionAssessmentScore.upsert({ where: { assessmentId_indicatorId: { assessmentId: assessment.id, indicatorId: score.indicatorId } }, create: { assessmentId: assessment.id, ...score }, update: score });
    const assessments = await tx.competitionAssessment.findMany({ where: { participantId: id } });
    const assignments = await tx.competitionJudgeAssignment.count({ where: { participantId: id } });
    const completed = assignments > 0 && assessments.filter((item) => item.status === "SUBMITTED").length === assignments;
    const submittedScores = assessments.filter((item) => item.status === "SUBMITTED").map((item) => Number(item.totalScore));
    await tx.competitionParticipant.update({ where: { id }, data: { status: completed ? "ASSESSED" : "UNDER_ASSESSMENT", finalScore: completed ? submittedScores.reduce((sum, value) => sum + value, 0) / submittedScores.length : null } });
    await tx.competitionActivityLog.create({ data: { participantId: id, userId: user.id, activity: submitted ? "Penilaian juri disubmit" : "Draft penilaian disimpan", description: `Nilai ${totalScore.toFixed(2)}` } });
  });
  return NextResponse.json({ message: submitted ? "Penilaian berhasil disubmit." : "Draft penilaian disimpan.", totalScore });
}
