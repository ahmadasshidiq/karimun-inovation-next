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

export type UserStatus = "ACTIVE" | "INACTIVE";
export type UserOptionDto = { id: string; name: string };

export type UserDto = {
  id: string;
  number?: number;
  roleId: string;
  institutionId: string;
  username: string;
  email: string | null;
  fullname: string;
  nip: string | null;
  phone: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role: UserOptionDto;
  institution: UserOptionDto;
};

export type UserFormValues = {
  username: string;
  email: string;
  fullname: string;
  nip: string;
  phone: string;
  status: UserStatus;
  roleId: string;
  institutionId: string;
  password: string;
};

export type UserListResponse = {
  data?: UserDto[];
  total?: number;
  message?: string;
  options?: {
    roles?: UserOptionDto[];
    institutions?: UserOptionDto[];
  };
};

export type UserFilters = {
  search: string;
  status: string;
  roleId: string;
};

export const ITEMS_PER_PAGE = 10;

export const statusOptions = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "INACTIVE", label: "Tidak Aktif" },
];

export const initialFilters: UserFilters = {
  search: "",
  status: "all",
  roleId: "all",
};

export const columnFormats: DefaultColumnFormat<UserDto>[] = [
  { key: "number", title: "#", formatter: (value) => String(value || "-") },
  {
    key: "fullname",
    title: "Nama Lengkap",
    textClassName: "min-w-52 font-semibold text-slate-900!",
  },
  { key: "username", title: "Username" },
  {
    key: "email",
    title: "Email",
    formatter: (value) => String(value || "-"),
  },
  {
    key: "role",
    title: "Role",
    formatter: (_value, row) => row.role?.name || "-",
  },
  {
    key: "institution",
    title: "Instansi",
    textClassName: "min-w-48",
    formatter: (_value, row) => row.institution?.name || "-",
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
  onExport: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar addLabel="Tambah Akun" {...props} />
);

type FilterPanelProps = {
  filters: UserFilters;
  setFilter: (key: keyof UserFilters, value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  roles: UserOptionDto[];
};

export const filterPanel = ({
  filters,
  setFilter,
  applyFilters,
  clearFilters,
  roles,
}: FilterPanelProps) => (
  <FilterPanel
    title="Filter Akun"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama, username, atau email..."
    />
    <FilterSelect
      label="Status"
      allLabel="Semua Status"
      value={filters.status}
      options={statusOptions}
      onChange={(value) => setFilter("status", value)}
    />
    <FilterSelect
      label="Role"
      allLabel="Semua Role"
      value={filters.roleId}
      options={roles.map((role) => ({ value: role.id, label: role.name }))}
      onChange={(value) => setFilter("roleId", value)}
    />
  </FilterPanel>
);

type RenderActionsProps = {
  row: UserDto;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onEdit: (user: UserDto) => void;
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
      description="Akun akan dinonaktifkan dan tidak dapat digunakan untuk login."
    />
  </TableActions>
);
