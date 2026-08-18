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

export type DashboardSummary = {
  total: number;
  initiative: number;
  trial: number;
  implementation: number;
  award: number;
  totalScore: number;
  averageScore: number;
};

export type DashboardMapPoint = {
  id: string;
  name: string;
  institution: string;
  latitude: number;
  longitude: number;
};

export type DashboardApiData = {
  summary: DashboardSummary;
  mapData: DashboardMapPoint[];
  assessmentData: DashboardAssessmentItem[];
};

export type DashboardConfigurationData = {
  countdownTarget: string;
  countdownActive: boolean;
};

export type DashboardAssessmentItem = {
  subject: string;
  value: number;
  score: number;
  maximumScore: number;
};

export type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  announcementDate: string;
};

const formatScore = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const getStatistics = (summary: DashboardSummary): StatisticItem[] => [
  { title: "Skor Indeks Inovasi", value: formatScore(summary.totalScore), icon: Target },
  {
    title: "Indeks Rata-rata Daerah Perbatasan",
    value: formatScore(summary.averageScore),
    icon: Waves,
  },
  { title: "Total Inovasi", value: String(summary.total), icon: Sparkles },
  { title: "Inovasi Baru", value: String(summary.initiative), icon: Clock3 },
  { title: "Inovasi Uji Coba", value: String(summary.trial), icon: Flame },
  { title: "Inovasi Penerapan", value: String(summary.implementation), icon: Rocket },
];

export const initialDashboardSummary: DashboardSummary = {
  total: 0,
  initiative: 0,
  trial: 0,
  implementation: 0,
  award: 0,
  totalScore: 0,
  averageScore: 0,
};
