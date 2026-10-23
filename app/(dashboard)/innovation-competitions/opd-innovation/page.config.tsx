"use client";

import { ClipboardCheck, Eye, Undo2 } from "lucide-react";

import { innovationCategoryOptions } from "@/app/(dashboard)/innovations/page.config";
import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  ConfirmAction,
  FilterPanel,
  FilterSearch,
  FilterSelect,
  TableActions,
  TableToolbar,
} from "@/components/table-elements";
import { Badge } from "@/components/ui/badge";
import { formatDateId } from "@/lib/helper/date";

export type SubmissionStatus =
  | "SUBMITTED"
  | "ACCEPTED"
  | "RETURNED"
  | "CANCELLED";

export type CompetitionSubmissionDto = {
  id: string;
  number: number;
  innovationId: string;
  innovationName: string;
  institution: string;
  category: string | null;
  stage: string | null;
  period: { id: string; name: string } | null;
  status: SubmissionStatus;
  submittedAt: string;
  submittedBy: string;
  reviewNote: string | null;
  canCancel: boolean;
  canVerify: boolean;
};

export type CompetitionSubmissionFilters = {
  search: string;
  periodId: string;
  status: string;
  category: string;
};

export type CompetitionPeriodOptionDto = { id: string; name: string };

export type CompetitionSubmissionListResponse = {
  data?: CompetitionSubmissionDto[];
  total?: number;
  message?: string;
  options?: { periods?: CompetitionPeriodOptionDto[] };
};

export const ITEMS_PER_PAGE = 10;

export const initialFilters: CompetitionSubmissionFilters = {
  search: "",
  periodId: "all",
  status: "all",
  category: "all",
};

export const statusOptions = [
  { value: "SUBMITTED", label: "Diajukan" },
  { value: "ACCEPTED", label: "Diterima" },
  { value: "RETURNED", label: "Dikembalikan" },
  { value: "CANCELLED", label: "Dibatalkan" },
];

const statusBadgeClass: Record<SubmissionStatus, string> = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  RETURNED: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-slate-200 text-slate-600",
};

const categoryOptions = innovationCategoryOptions.map((option) => ({
  value: option.value,
  label: option.label,
}));

export const columnFormats: DefaultColumnFormat<CompetitionSubmissionDto>[] = [
  { key: "number", title: "#", formatter: (value) => String(value || "-") },
  {
    key: "innovationName",
    title: "Nama Inovasi",
    textClassName: "min-w-64 font-semibold text-slate-900!",
  },
  { key: "institution", title: "Perangkat Daerah" },
  {
    key: "period",
    title: "Periode Lomba",
    formatter: (_value, row) => row.period?.name || "-",
  },
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
    key: "submittedAt",
    title: "Tanggal Pengajuan",
    formatter: (value) => formatDateId(value),
  },
  { key: "submittedBy", title: "Diajukan Oleh" },
  {
    key: "status",
    title: "Status",
    formatter: (value) => (
      <Badge className={statusBadgeClass[value as SubmissionStatus]}>
        {statusOptions.find((option) => option.value === value)?.label ||
          "-"}
      </Badge>
    ),
  },
  {
    key: "reviewNote",
    title: "Catatan Verifikasi",
    textClassName: "min-w-64 whitespace-normal!",
    formatter: (value) => String(value || "-"),
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
  filters: CompetitionSubmissionFilters;
  periods: CompetitionPeriodOptionDto[];
  setFilter: (key: keyof CompetitionSubmissionFilters, value: string) => void;
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
    title="Filter Lomba Inovasi"
    className="xl:grid-cols-4"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama inovasi..."
    />
    <FilterSelect
      label="Periode Lomba"
      allLabel="Semua Periode"
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
    <FilterSelect
      label="Status"
      allLabel="Semua Status"
      value={filters.status}
      options={statusOptions}
      onChange={(value) => setFilter("status", value)}
    />
  </FilterPanel>
);

type RenderActionsProps = {
  row: CompetitionSubmissionDto;
  cancelId: string | null;
  setCancelId: (id: string | null) => void;
  onView: (innovationId: string) => void;
  onVerify: (submission: CompetitionSubmissionDto) => void;
  onCancel: (id: string) => void | Promise<void>;
};

export const renderActions = ({
  row,
  cancelId,
  setCancelId,
  onView,
  onVerify,
  onCancel,
}: RenderActionsProps) => (
  <TableActions>
    <ActionButton
      label="Lihat Inovasi"
      icon={Eye}
      tone="blue"
      onClick={() => onView(row.innovationId)}
    />
    {row.canVerify ? (
      <ActionButton
        label="Verifikasi"
        icon={ClipboardCheck}
        tone="green"
        onClick={() => onVerify(row)}
      />
    ) : null}
    {row.canCancel ? (
      <ConfirmAction
        label="Batalkan Pengajuan"
        icon={Undo2}
        title="Batalkan pengajuan ini?"
        description="Inovasi dapat dikirim kembali selama periode lomba masih dibuka."
        confirmLabel="Batalkan Pengajuan"
        open={cancelId === row.id}
        onOpenChange={(open) => setCancelId(open ? row.id : null)}
        onConfirm={() => onCancel(row.id)}
      />
    ) : null}
  </TableActions>
);
