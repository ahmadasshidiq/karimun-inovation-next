"use client";

import { SquarePen } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  DeleteAction,
  FilterPanel,
  FilterSearch,
  TableActions,
  TableToolbar,
} from "@/components/table-elements";
import { Badge } from "@/components/ui/badge";
import { formatDateId } from "@/lib/helper/date";

export type CompetitionPeriodStatus = "UPCOMING" | "OPEN" | "CLOSED";

export type CompetitionPeriodDto = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string | null;
  status: CompetitionPeriodStatus;
  submissionCount: number;
};

export type CompetitionPeriodFormValues = {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type CompetitionPeriodFilters = {
  search: string;
};

export type CompetitionPeriodListResponse = {
  data?: CompetitionPeriodDto[];
  total?: number;
  message?: string;
};

export const ITEMS_PER_PAGE = 10;

export const initialFilters: CompetitionPeriodFilters = {
  search: "",
};

const statusBadges: Record<
  CompetitionPeriodStatus,
  { label: string; className: string }
> = {
  OPEN: { label: "Dibuka", className: "bg-emerald-100 text-emerald-700" },
  UPCOMING: { label: "Akan Datang", className: "bg-amber-100 text-amber-700" },
  CLOSED: { label: "Ditutup", className: "bg-slate-200 text-slate-600" },
};

export const columnFormats: DefaultColumnFormat<CompetitionPeriodDto>[] = [
  {
    key: "name",
    title: "Nama Periode",
    textClassName: "min-w-56 font-semibold text-slate-900!",
  },
  {
    key: "startDate",
    title: "Tanggal Buka",
    formatter: (value) => formatDateId(value),
  },
  {
    key: "endDate",
    title: "Tanggal Tutup",
    formatter: (value) => formatDateId(value),
  },
  {
    key: "status",
    title: "Status",
    formatter: (value) => {
      const badge = statusBadges[value as CompetitionPeriodStatus];
      return badge ? (
        <Badge className={badge.className}>{badge.label}</Badge>
      ) : (
        "-"
      );
    },
  },
  {
    key: "submissionCount",
    title: "Jumlah Pengajuan",
    formatter: (value) => String(value || 0),
  },
];

type HeaderToolbarProps = {
  onAdd: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar addLabel="Tambah Periode" {...props} />
);

type FilterPanelProps = {
  filters: CompetitionPeriodFilters;
  setFilter: (key: keyof CompetitionPeriodFilters, value: string) => void;
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
    title="Filter Periode Lomba"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama periode..."
    />
  </FilterPanel>
);

type RenderActionsProps = {
  row: CompetitionPeriodDto;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onEdit: (period: CompetitionPeriodDto) => void;
  onDelete: (id: string) => void | Promise<void>;
};

export const renderActions = ({
  row,
  deleteId,
  setDeleteId,
  onEdit,
  onDelete,
}: RenderActionsProps) => (
  <TableActions>
    <ActionButton
      label="Edit"
      icon={SquarePen}
      tone="yellow"
      onClick={() => onEdit(row)}
    />
    <DeleteAction
      open={deleteId === row.id}
      onOpenChange={(open) => setDeleteId(open ? row.id : null)}
      onConfirm={() => onDelete(row.id)}
      description="Periode yang sudah memiliki pengajuan tidak dapat dihapus."
    />
  </TableActions>
);
