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

export type NewsCategoryDto = {
  id: string;
  number?: number;
  name: string;
  slug: string;
  isActive: boolean;
  newsCount: number;
};

export type NewsCategoryFormValues = {
  name: string;
  isActive: boolean;
};

export type NewsCategoryFilters = {
  search: string;
  status: string;
};

export type NewsCategoryListResponse = {
  data?: NewsCategoryDto[];
  total?: number;
  message?: string;
};

export const ITEMS_PER_PAGE = 10;

export const statusOptions = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "INACTIVE", label: "Tidak Aktif" },
];

export const initialFilters: NewsCategoryFilters = {
  search: "",
  status: "all",
};

export const columnFormats: DefaultColumnFormat<NewsCategoryDto>[] = [
  { key: "number", title: "#", formatter: (value) => String(value || "-") },
  {
    key: "name",
    title: "Nama Kategori",
    textClassName: "min-w-52 font-semibold text-slate-900!",
  },
  {
    key: "slug",
    title: "Slug",
    formatter: (value) => String(value || "-"),
  },
  {
    key: "newsCount",
    title: "Dipakai Berita",
    formatter: (value) => String(value ?? 0),
  },
  {
    key: "isActive",
    title: "Status",
    formatter: (value) =>
      value ? (
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
  <TableToolbar addLabel="Tambah Kategori" {...props} />
);

type FilterPanelProps = {
  filters: NewsCategoryFilters;
  setFilter: (key: keyof NewsCategoryFilters, value: string) => void;
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
    title="Filter Kategori Berita"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama atau slug kategori..."
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
  row: NewsCategoryDto;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onEdit: (item: NewsCategoryDto) => void;
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
    {row.isActive ? (
      <DeleteAction
        open={deleteId === row.id}
        onOpenChange={(open) => setDeleteId(open ? row.id : null)}
        onConfirm={() => onDelete(row.id)}
        description="Kategori akan dinonaktifkan dan tetap tampil pada berita lama."
      />
    ) : null}
  </TableActions>
);
