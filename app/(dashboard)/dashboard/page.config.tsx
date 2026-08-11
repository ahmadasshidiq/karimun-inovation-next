"use client";

import type { LucideIcon } from "lucide-react";
import { Clock3, Flame, Rocket, Sparkles, Target, Waves } from "lucide-react";

export type CountdownValue = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export type StatisticItem = {
  title: string;
  value: string;
  icon: LucideIcon;
};

export type AnnouncementItem = {
  title: string;
  date: string;
};

export const statistics: StatisticItem[] = [
  { title: "Skor Indeks Inovasi", value: "28", icon: Target },
  { title: "Indeks Rata-rata Daerah Perbatasan", value: "37,14", icon: Waves },
  { title: "Total Inovasi", value: "23", icon: Sparkles },
  { title: "Inovasi Baru", value: "3", icon: Clock3 },
  { title: "Inovasi Uji Coba", value: "1", icon: Flame },
  { title: "Inovasi Penerapan", value: "20", icon: Rocket },
];

export const announcements: AnnouncementItem[] = [
  {
    title: "Surat Penilaian Inovasi Daerah Tahun 2026",
    date: "8 Agustus 2026",
  },
  {
    title: "Surat Penilaian Inovasi Daerah Tahun 2025",
    date: "8 Agustus 2025",
  },
];

export const assessmentData = [
  { subject: "Aspek Penguatan", value: 63 },
  { subject: "Aspek Tata Kelola", value: 45 },
  { subject: "Aspek Hasil Inovasi", value: 78 },
  { subject: "Aspek Dampak", value: 38 },
  { subject: "Aspek SDM", value: 72 },
  { subject: "Aspek Anggaran", value: 61 },
  { subject: "Aspek Kematangan", value: 47 },
  { subject: "Aspek Keberlanjutan", value: 52 },
];
