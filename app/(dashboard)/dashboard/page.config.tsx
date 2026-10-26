"use client";

import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  Eye,
  Flame,
  Rocket,
  Sparkles,
  Target,
  Waves,
} from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  TableActions,
} from "@/components/table-elements";
import { Badge } from "@/components/ui/badge";

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

export const formatScore = (value: number) =>
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

export type InnovationIndexPoint = {
  id: string;
  year: number;
  score: number;
  predicate: string | null;
};

export type InnovationYearPoint = {
  year: number;
  total: number;
};

export type DashboardStatisticsResponse = {
  data?: {
    innovationIndex?: InnovationIndexPoint[];
    innovationsPerYear?: InnovationYearPoint[];
  };
  message?: string;
};

export type AssessmentResult = {
  status: "SUBMITTED" | "ACCEPTED" | "RETURNED";
  periodName: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
};

export type AssessedInnovationDto = {
  id: string;
  number: number;
  name: string;
  institution: string;
  stage: string | null;
  innovationForm: string | null;
  governmentAffairs: string | null;
  initiatorName: string | null;
  trialPeriod: string;
  implementationPeriod: string;
  description: string | null;
  purpose: string | null;
  score: number;
  contract: AssessmentResult | null;
  competition: AssessmentResult | null;
};

export type AssessedInnovationListResponse = {
  data?: AssessedInnovationDto[];
  total?: number;
  message?: string;
};

export const ASSESSED_ITEMS_PER_PAGE = 5;

export const assessmentStatusBadges: Record<
  AssessmentResult["status"],
  { label: string; className: string }
> = {
  SUBMITTED: { label: "Menunggu Verifikasi", className: "bg-blue-100 text-blue-700" },
  ACCEPTED: { label: "Diterima", className: "bg-emerald-100 text-emerald-700" },
  RETURNED: { label: "Dikembalikan", className: "bg-amber-100 text-amber-700" },
};

const renderResult = (result: AssessmentResult | null) => {
  if (!result) return <span className="text-slate-400">Belum diajukan</span>;
  const badge = assessmentStatusBadges[result.status];
  return (
    <Badge className={badge.className}>
      {badge.label}
      {result.periodName ? ` · ${result.periodName}` : ""}
    </Badge>
  );
};

export const assessedColumnFormats: DefaultColumnFormat<AssessedInnovationDto>[] =
  [
    { key: "number", title: "#", formatter: (value) => String(value || "-") },
    {
      key: "name",
      title: "Nama Inovasi",
      textClassName: "min-w-64 font-semibold text-slate-900!",
    },
    { key: "institution", title: "Perangkat Daerah" },
    {
      key: "stage",
      title: "Tahapan",
      formatter: (value) => String(value || "-"),
    },
    {
      key: "score",
      title: "Skor Kematangan",
      formatter: (value) => formatScore(Number(value || 0)),
    },
    {
      key: "contract",
      title: "Perjanjian Kinerja",
      formatter: (_value, row) => renderResult(row.contract),
    },
    {
      key: "competition",
      title: "Lomba Inovasi",
      formatter: (_value, row) => renderResult(row.competition),
    },
  ];

export const renderAssessedActions = ({
  row,
  onPreview,
}: {
  row: AssessedInnovationDto;
  onPreview: (innovation: AssessedInnovationDto) => void;
}) => (
  <TableActions>
    <ActionButton
      label="Pratinjau"
      icon={Eye}
      tone="blue"
      onClick={() => onPreview(row)}
    />
  </TableActions>
);
