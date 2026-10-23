"use client";

import { SquarePen } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  DeleteAction,
  FilterPanel,
  FilterSearch,
  FilterSelect,
  TableActions,
  TableToolbar,
} from "@/components/table-elements";
import { Badge } from "@/components/ui/badge";
import { formatDateId } from "@/lib/helper/date";

export type AnnouncementStatus = "ACTIVE" | "INACTIVE";

export type AnnouncementDto = {
  id: string;
  number?: number;
  title: string;
  content: string;
  announcementDate: string;
  status: AnnouncementStatus;
};

export type AnnouncementFormValues = Omit<AnnouncementDto, "id" | "number">;

export type AnnouncementFilters = {
  search: string;
  status: string;
};

export type AnnouncementListResponse = {
  data?: AnnouncementDto[];
  total?: number;
  message?: string;
};

export const ITEMS_PER_PAGE = 10;

export const initialFilters: AnnouncementFilters = {
  search: "",
  status: "all",
};

export const statusOptions = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "INACTIVE", label: "Tidak Aktif" },
];

export const columnFormats: DefaultColumnFormat<AnnouncementDto>[] = [
  { key: "number", title: "#", formatter: (value) => String(value || "-") },
  {
    key: "title",
    title: "Judul Pengumuman",
    textClassName: "min-w-72 font-semibold text-slate-900!",
  },
  {
    key: "announcementDate",
    title: "Tanggal",
    formatter: (value) => formatDateId(value),
  },
  {
    key: "status",
    title: "Status",
    formatter: (value) =>
      value === "ACTIVE" ? (
        <Badge className="bg-emerald-100 text-emerald-700">Aktif</Badge>
      ) : (
        <Badge className="bg-slate-200 text-slate-600">Tidak Aktif</Badge>
      ),
  },
];

type HeaderToolbarProps = {
  onAdd: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar addLabel="Tambah Pengumuman" {...props} />
);

type FilterPanelProps = {
  filters: AnnouncementFilters;
  setFilter: (key: keyof AnnouncementFilters, value: string) => void;
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
    title="Filter Pengumuman"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari judul pengumuman..."
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
  row: AnnouncementDto;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onEdit: (announcement: AnnouncementDto) => void;
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
      description="Pengumuman yang dihapus tidak akan tampil kembali."
    />
  </TableActions>
);
