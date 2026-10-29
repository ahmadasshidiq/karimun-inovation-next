"use client";

import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  Eye,
  Flame,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  FilterPanel,
  FilterSearch,
  FilterSelect,
  TableActions,
  TableToolbar,
} from "@/components/table-elements";

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
  indexScore: number;
  indexYear: number | null;
};

export type DashboardConfigurationData = {
  countdownTarget: string;
  countdownActive: boolean;
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
  {
    title: summary.indexYear
      ? `Skor Indeks Inovasi ${summary.indexYear}`
      : "Skor Indeks Inovasi",
    value: formatScore(summary.indexScore),
    icon: Target,
  },
  { title: "Total Inovasi", value: String(summary.total), icon: Sparkles },
  { title: "Inisiatif", value: String(summary.initiative), icon: Clock3 },
  { title: "Uji Coba", value: String(summary.trial), icon: Flame },
  { title: "Penerapan", value: String(summary.implementation), icon: Rocket },
];

export const initialDashboardSummary: DashboardSummary = {
  total: 0,
  initiative: 0,
  trial: 0,
  implementation: 0,
  indexScore: 0,
  indexYear: null,
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
    summary?: DashboardSummary;
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

export type DashboardInnovationDto = {
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
  video: { url: string | null; posterUrl: string | null } | null;
};

export type DashboardInnovationOptionDto = {
  id: string;
  name: string;
};

export type DashboardInnovationOptions = {
  institutions: DashboardInnovationOptionDto[];
  governmentAffairs: string[];
  innovationForms: string[];
  types: string[];
  stages: string[];
  thematics: string[];
  pkpnClusters: string[];
  psns: string[];
};

export type DashboardInnovationListResponse = {
  data?: DashboardInnovationDto[];
  total?: number;
  message?: string;
  canOpenDetail?: boolean;
  options?: Partial<DashboardInnovationOptions>;
};

export type DashboardInnovationFilters = {
  search: string;
  institutionId: string;
  governmentAffairs: string;
  innovationForm: string;
  type: string;
  stage: string;
  thematic: string;
  pkpnCluster: string;
  psn: string;
};

export const INNOVATION_ITEMS_PER_PAGE = 10;

export const initialInnovationFilters: DashboardInnovationFilters = {
  search: "",
  institutionId: "all",
  governmentAffairs: "all",
  innovationForm: "all",
  type: "all",
  stage: "all",
  thematic: "all",
  pkpnCluster: "all",
  psn: "all",
};

export const initialInnovationOptions: DashboardInnovationOptions = {
  institutions: [],
  governmentAffairs: [],
  innovationForms: [],
  types: [],
  stages: [],
  thematics: [],
  pkpnClusters: [],
  psns: [],
};

export const assessmentStatusBadges: Record<
  AssessmentResult["status"],
  { label: string; className: string }
> = {
  SUBMITTED: { label: "Menunggu Verifikasi", className: "bg-blue-100 text-blue-700" },
  ACCEPTED: { label: "Diterima", className: "bg-emerald-100 text-emerald-700" },
  RETURNED: { label: "Dikembalikan", className: "bg-amber-100 text-amber-700" },
};

const toOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

export const innovationColumnFormats: DefaultColumnFormat<DashboardInnovationDto>[] =
  [
    { key: "number", title: "#", formatter: (value) => String(value || "-") },
    {
      key: "name",
      title: "Nama Inovasi",
      textClassName: "min-w-64 font-semibold text-slate-900!",
    },
    {
      key: "institution",
      title: "Unit Inovasi",
      formatter: (value) => String(value || "-"),
    },
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
  ];

type InnovationToolbarProps = {
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const innovationToolbar = (props: InnovationToolbarProps) => (
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h2 className="text-sm font-semibold text-neutral-950">
        Database Inovasi
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Seluruh inovasi se-Kabupaten Karimun yang diinput ke dalam aplikasi.
      </p>
    </div>
    <TableToolbar {...props} />
  </div>
);

type InnovationFilterPanelProps = {
  filters: DashboardInnovationFilters;
  setFilter: (key: keyof DashboardInnovationFilters, value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  options: DashboardInnovationOptions;
};

export const innovationFilterPanel = ({
  filters,
  setFilter,
  applyFilters,
  clearFilters,
  options,
}: InnovationFilterPanelProps) => (
  <FilterPanel
    title="Filter Inovasi Daerah"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama inovasi..."
    />
    <FilterSelect
      label="Unit Inovasi"
      allLabel="Semua Unit Inovasi"
      value={filters.institutionId}
      options={options.institutions.map((institution) => ({
        value: institution.id,
        label: institution.name,
      }))}
      onChange={(value) => setFilter("institutionId", value)}
    />
    <FilterSelect
      label="Urusan"
      allLabel="Semua Urusan"
      value={filters.governmentAffairs}
      options={toOptions(options.governmentAffairs)}
      onChange={(value) => setFilter("governmentAffairs", value)}
    />
    <FilterSelect
      label="Bentuk Inovasi"
      allLabel="Semua Bentuk Inovasi"
      value={filters.innovationForm}
      options={toOptions(options.innovationForms)}
      onChange={(value) => setFilter("innovationForm", value)}
    />
    <FilterSelect
      label="Jenis Inovasi"
      allLabel="Semua Jenis Inovasi"
      value={filters.type}
      options={toOptions(options.types)}
      onChange={(value) => setFilter("type", value)}
    />
    <FilterSelect
      label="Tahapan Inovasi"
      allLabel="Semua Tahapan"
      value={filters.stage}
      options={toOptions(options.stages)}
      onChange={(value) => setFilter("stage", value)}
    />
    <FilterSelect
      label="Sinergi Asta Cita"
      allLabel="Semua Asta Cita"
      value={filters.thematic}
      options={toOptions(options.thematics)}
      onChange={(value) => setFilter("thematic", value)}
    />
    <FilterSelect
      label="Sinergi PKPN"
      allLabel="Semua Klaster PKPN"
      value={filters.pkpnCluster}
      options={toOptions(options.pkpnClusters)}
      onChange={(value) => setFilter("pkpnCluster", value)}
    />
    <FilterSelect
      label="Sinergi Pro-SN"
      allLabel="Semua Pro-SN"
      value={filters.psn}
      options={toOptions(options.psns)}
      onChange={(value) => setFilter("psn", value)}
    />
  </FilterPanel>
);

export const renderInnovationActions = ({
  row,
  onPreview,
}: {
  row: DashboardInnovationDto;
  onPreview: (innovation: DashboardInnovationDto) => void;
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
