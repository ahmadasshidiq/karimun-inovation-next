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
import { MASTER_PERMISSIONS } from "@/lib/master-permission";

export type RolePermission = { model: string; actions: string[] };
export type RoleDto = {
  id: string;
  name: string;
  permission: RolePermission[] | { all?: boolean };
};
export type RoleFormValues = { name: string; permission: RolePermission[] };
export type RoleListResponse = {
  data?: RoleDto[];
  total?: number;
  message?: string;
};

export type RoleFilters = {
  search: string;
};

export const ITEMS_PER_PAGE = 10;

export const initialFilters: RoleFilters = {
  search: "",
};

export const normalizeRolePermissions = (
  permission: RoleDto["permission"],
): RolePermission[] => {
  if (!Array.isArray(permission)) {
    return permission?.all
      ? MASTER_PERMISSIONS.map((item) => ({
          model: item.model,
          actions: [...item.actions],
        }))
      : [];
  }
  return permission;
};

export const columnFormats: DefaultColumnFormat<RoleDto>[] = [
  {
    key: "name",
    title: "Nama Role",
    textClassName: "w-48 align-top font-semibold text-slate-900!",
  },
  {
    key: "permission",
    title: "Permissions",
    textClassName: "min-w-[600px] whitespace-normal! align-top",
    formatter: (value) => {
      const permissions = normalizeRolePermissions(value as RoleDto["permission"]);
      return permissions.length ? (
        <div className="space-y-2">
          {permissions.map((permission) => (
            <div key={permission.model} className="flex flex-wrap items-center gap-1.5">
              <Badge className="bg-slate-100 text-slate-700">{permission.model}</Badge>
              {permission.actions.map((action) => (
                <Badge key={action} className="bg-blue-50 font-medium text-blue-600">
                  {action}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <span className="text-slate-400">Tidak ada permission</span>
      );
    },
  },
];

type HeaderToolbarProps = {
  onAdd: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar addLabel="Tambah Role" {...props} />
);

type FilterPanelProps = {
  filters: RoleFilters;
  setFilter: (key: keyof RoleFilters, value: string) => void;
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
    title="Filter Role"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama role..."
    />
  </FilterPanel>
);

type RenderActionsProps = {
  row: RoleDto;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onEdit: (role: RoleDto) => void;
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
      description="Role yang masih digunakan oleh pengguna tidak dapat dihapus."
    />
  </TableActions>
);
