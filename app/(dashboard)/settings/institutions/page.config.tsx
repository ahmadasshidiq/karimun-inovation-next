"use client";

import { Eye, SquarePen } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  DeleteAction,
  FilterPanel,
  FilterSearch,
  TableActions,
  TableToolbar,
} from "@/components/table-elements";

export type InstitutionOptionDto = { id: string; name: string };

export type InstitutionDto = {
  id: string;
  name: string;
  type: string;
  address: string | null;
  status: "ACTIVE" | "INACTIVE";
  nomenclature: InstitutionOptionDto;
  _count?: { users: number };
};

export type InstitutionFormValues = {
  name: string;
  type: string;
  nomenclatureId: string;
  address: string;
};

export type InstitutionListResponse = {
  data?: InstitutionDto[];
  total?: number;
  message?: string;
  options?: { nomenclatures?: InstitutionOptionDto[] };
};

export type InstitutionFilters = {
  search: string;
};

export const ITEMS_PER_PAGE = 10;

export const initialFilters: InstitutionFilters = {
  search: "",
};

export const columnFormats: DefaultColumnFormat<InstitutionDto>[] = [
  {
    key: "name",
    title: "Nama Instansi",
    textClassName: "font-semibold text-slate-900!",
  },
  {
    key: "type",
    title: "Tipe",
    formatter: (value) => String(value || "-"),
  },
  {
    key: "nomenclature",
    title: "Nomenklatur",
    formatter: (_value, row) => row.nomenclature?.name || "-",
  },
  {
    key: "address",
    title: "Alamat",
    formatter: (value) => String(value || "-"),
  },
  {
    key: "_count",
    title: "Jumlah Akun",
    formatter: (_value, row) => String(row._count?.users || 0),
  },
];

type HeaderToolbarProps = {
  onAdd: () => void;
  onExport: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar addLabel="Tambah Instansi" {...props} />
);

type FilterPanelProps = {
  filters: InstitutionFilters;
  setFilter: (key: keyof InstitutionFilters, value: string) => void;
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
    title="Filter Instansi"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama instansi..."
    />
  </FilterPanel>
);

type RenderActionsProps = {
  row: InstitutionDto;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onView: (id: string) => void;
  onEdit: (institution: InstitutionDto) => void;
  onDelete: (id: string) => void | Promise<void>;
};

export const renderActions = ({
  row,
  deleteId,
  setDeleteId,
  onView,
  onEdit,
  onDelete,
}: RenderActionsProps) => (
  <TableActions>
    <ActionButton
      label="Lihat"
      icon={Eye}
      tone="blue"
      onClick={() => onView(row.id)}
    />
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
    />
  </TableActions>
);
