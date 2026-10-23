"use client";

import { Eye } from "lucide-react";

import { innovationCategoryOptions } from "@/app/(dashboard)/innovations/page.config";
import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  FilterPanel,
  FilterSelect,
  TableActions,
  TableToolbar,
} from "@/components/table-elements";
import { cn } from "@/lib/utils";

export type LeaderboardDto = {
  id: string;
  rank: number;
  innovationId: string;
  innovationName: string;
  institution: string;
  category: string | null;
  stage: string | null;
  score: number;
};

export type LeaderboardFilters = {
  periodId: string;
  category: string;
};

export type LeaderboardPeriodDto = { id: string; name: string };

export type LeaderboardListResponse = {
  data?: LeaderboardDto[];
  total?: number;
  period?: LeaderboardPeriodDto | null;
  message?: string;
  options?: { periods?: LeaderboardPeriodDto[] };
};

export const ITEMS_PER_PAGE = 10;

export const initialFilters: LeaderboardFilters = {
  periodId: "all",
  category: "all",
};

const categoryOptions = innovationCategoryOptions.map((option) => ({
  value: option.value,
  label: option.label,
}));

const rankClass: Record<number, string> = {
  1: "bg-amber-100 text-amber-700",
  2: "bg-slate-200 text-slate-700",
  3: "bg-orange-100 text-orange-700",
};

export const columnFormats: DefaultColumnFormat<LeaderboardDto>[] = [
  {
    key: "rank",
    title: "Peringkat",
    formatter: (value) => (
      <span
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-full text-sm font-bold",
          rankClass[Number(value)] ?? "bg-slate-50 text-slate-600",
        )}
      >
        {String(value)}
      </span>
    ),
  },
  {
    key: "innovationName",
    title: "Nama Inovasi",
    textClassName: "min-w-64 font-semibold text-slate-900!",
  },
  { key: "institution", title: "Perangkat Daerah" },
  {
    key: "category",
    title: "Kategori",
    formatter: (value) =>
      categoryOptions.find((option) => option.value === value)?.label || "-",
  },
  {
    key: "stage",
    title: "Tahapan Inovasi",
    formatter: (value) => String(value || "-"),
  },
  {
    key: "score",
    title: "Skor Kematangan",
    textClassName: "font-semibold text-slate-900!",
    formatter: (value) => Number(value || 0).toFixed(2),
  },
];

type HeaderToolbarProps = {
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar {...props} />
);

type FilterPanelProps = {
  filters: LeaderboardFilters;
  periods: LeaderboardPeriodDto[];
  setFilter: (key: keyof LeaderboardFilters, value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
};

export const filterPanel = ({
  filters,
  periods,
  setFilter,
  applyFilters,
  clearFilters,
}: FilterPanelProps) => (
  <FilterPanel
    title="Filter Papan Peringkat"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSelect
      label="Periode Lomba"
      allLabel="Periode Aktif / Terbaru"
      value={filters.periodId}
      options={periods.map((period) => ({
        value: period.id,
        label: period.name,
      }))}
      onChange={(value) => setFilter("periodId", value)}
    />
    <FilterSelect
      label="Kategori"
      allLabel="Semua Kategori"
      value={filters.category}
      options={categoryOptions}
      onChange={(value) => setFilter("category", value)}
    />
  </FilterPanel>
);

type RenderActionsProps = {
  row: LeaderboardDto;
  onView: (innovationId: string) => void;
};

export const renderActions = ({ row, onView }: RenderActionsProps) => (
  <TableActions>
    <ActionButton
      label="Lihat Inovasi"
      icon={Eye}
      tone="blue"
      onClick={() => onView(row.innovationId)}
    />
  </TableActions>
);
