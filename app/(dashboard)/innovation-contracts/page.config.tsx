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

export type ContractSubmissionDto = {
  id: string;
  number: number;
  innovationId: string;
  innovationName: string;
  institution: string;
  category: string | null;
  stage: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  submittedBy: string;
  reviewNote: string | null;
  canCancel: boolean;
  canVerify: boolean;
};

export type ContractSubmissionFilters = {
  search: string;
  status: string;
  category: string;
};

export type ContractSubmissionListResponse = {
  data?: ContractSubmissionDto[];
  total?: number;
  message?: string;
};

export const ITEMS_PER_PAGE = 10;

export const initialFilters: ContractSubmissionFilters = {
  search: "",
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

export const columnFormats: DefaultColumnFormat<ContractSubmissionDto>[] = [
  { key: "number", title: "#", formatter: (value) => String(value || "-") },
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
  filters: ContractSubmissionFilters;
  setFilter: (key: keyof ContractSubmissionFilters, value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
};

export const filterPanel = ({
  filters,
  setFilter,
  applyFilters,
  clearFilters,
}: FilterPanelProps) => (
  <FilterPanel
    title="Filter Perjanjian Kinerja"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama inovasi..."
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
  row: ContractSubmissionDto;
  cancelId: string | null;
  setCancelId: (id: string | null) => void;
  onView: (innovationId: string) => void;
  onVerify: (submission: ContractSubmissionDto) => void;
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
        description="Inovasi dapat dikirim kembali sebagai Perjanjian Kinerja setelah dibatalkan."
        confirmLabel="Batalkan Pengajuan"
        open={cancelId === row.id}
        onOpenChange={(open) => setCancelId(open ? row.id : null)}
        onConfirm={() => onCancel(row.id)}
      />
    ) : null}
  </TableActions>
);
