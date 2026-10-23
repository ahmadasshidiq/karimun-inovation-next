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

export type NomenclatureDto = {
  id: string;
  name: string;
  description: string | null;
  _count?: { institutions: number };
};

export type NomenclatureFormValues = {
  name: string;
  description: string;
};

export type NomenclatureListResponse = {
  data?: NomenclatureDto[];
  total?: number;
  message?: string;
};

export type NomenclatureFilters = {
  search: string;
};

export const ITEMS_PER_PAGE = 10;

export const initialFilters: NomenclatureFilters = {
  search: "",
};

export const columnFormats: DefaultColumnFormat<NomenclatureDto>[] = [
  {
    key: "name",
    title: "Nama Nomenklatur",
    textClassName: "font-semibold text-slate-900!",
  },
  {
    key: "description",
    title: "Deskripsi",
    formatter: (value) => String(value || "-"),
  },
  {
    key: "_count",
    title: "Jumlah Instansi",
    formatter: (_value, row) => String(row._count?.institutions || 0),
  },
];

type HeaderToolbarProps = {
  onAdd: () => void;
  onExport: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar addLabel="Tambah Nomenklatur" {...props} />
);

type FilterPanelProps = {
  filters: NomenclatureFilters;
  setFilter: (key: keyof NomenclatureFilters, value: string) => void;
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
    title="Filter Nomenklatur"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama nomenklatur..."
    />
  </FilterPanel>
);

type RenderActionsProps = {
  row: NomenclatureDto;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onView: (id: string) => void;
  onEdit: (nomenclature: NomenclatureDto) => void;
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
