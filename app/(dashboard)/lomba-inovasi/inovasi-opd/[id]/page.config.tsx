"use client";

export const detailTabs = ["Informasi Inovasi", "Substansi Inovasi", "Dokumen Pendukung", "Verifikasi", "Penilaian", "Riwayat"] as const;
export const verificationItems = ["Data inovasi lengkap", "OPD sesuai", "Inovasi sudah diterapkan", "Deskripsi inovasi lengkap", "Bukti pelaksanaan tersedia", "Dokumen wajib lengkap", "Video tersedia jika diwajibkan", "Data dapat dipertanggungjawabkan"];

export type CompetitionDetail = {
  id: string;
  status: string;
  finalScore: string | null;
  institution: { name: string };
  innovation: { name: string; type: string | null; innovationForm: string | null; governmentAffairs: string | null; trialPeriod: string | null; implementationPeriod: string | null; description: string | null; purpose: string | null; files: unknown };
  documents: Array<{ id: string; name: string; type: string; fileUrl: string; status: string }>;
  verifications: Array<{ id: string; notes: string | null; decision: string; createdAt: string; verifier: { fullname: string } }>;
  assessments: Array<{ id: string; totalScore: string; status: string; judge: { fullname: string } }>;
  judgeAssignments: Array<{ id: string; judge: { fullname: string } }>;
  activityLogs: Array<{ id: string; activity: string; description: string | null; createdAt: string; user: { fullname: string } }>;
};

