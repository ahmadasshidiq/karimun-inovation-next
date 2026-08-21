"use client";

import type React from "react";
import {
  Download,
  Filter,
  Plus,
  Search,
  SquarePen,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  status: "all" | UserStatus;
  roleId: string;
};

export const ITEMS_PER_PAGE = 10;
export const initialFilters: UserFilters = {
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

export const headerToolbar = ({
  onAdd,
  onExport,
  setShowFilter,
  activeFilterCount,
}: {
  onAdd: () => void;
  onExport: () => void;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilterCount: number;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <Button
      type="button"
      onClick={onAdd}
      className="inline-flex h-9 items-center gap-2 rounded-md bg-[#2362ee] px-4 text-xs font-semibold text-white hover:bg-blue-700"
    >
      <Plus className="size-4" />
      Tambah Akun
    </Button>
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowFilter((current) => !current)}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-300! bg-white! px-4 text-xs font-semibold text-neutral-800! hover:bg-neutral-100! hover:text-neutral-900!"
      >
        <Filter className="size-4" />
        Filter
        {activeFilterCount > 0 && (
          <span className="rounded-full bg-[#ffb437] px-1.5 text-[10px] text-white">
            {activeFilterCount}
          </span>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onExport}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-500! bg-white! px-4 text-xs font-semibold text-emerald-600! hover:bg-emerald-50! hover:text-emerald-700!"
      >
        <Download className="size-4" />
        Export Excel
      </Button>
    </div>
  </div>
);

export const filterPanel = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilter,
  roles,
  clearFilters,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: UserFilters;
  setFilter: (key: keyof UserFilters, value: string) => void;
  roles: UserOptionDto[];
  clearFilters: () => void;
}) => (
  <div className="rounded-xl border border-neutral-200 bg-[#fafbfc] p-5">
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold text-neutral-900">Filter Akun</h2>
      <Button
        type="button"
        variant="link"
        onClick={clearFilters}
        className="text-xs font-semibold text-blue-600 hover:underline"
      >
        Reset Filter
      </Button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-600">
          Pencarian
        </span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Cari nama, username, atau email..."
            className="h-11! border-neutral-300 bg-white pl-9 text-xs text-neutral-900"
          />
        </div>
      </div>
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-600">Status</span>
        <Select
          value={filters.status}
          onValueChange={(value) => value && setFilter("status", value)}
        >
          <SelectTrigger className="h-11! w-full rounded-lg border-neutral-300 bg-white px-3 text-xs text-neutral-900 dark:bg-white">
            <SelectValue>
              {filters.status === "all"
                ? "Semua Status"
                : filters.status === "ACTIVE"
                  ? "Aktif"
                  : "Tidak Aktif"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white text-neutral-900">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-600">Role</span>
        <Select
          value={filters.roleId}
          onValueChange={(value) => value && setFilter("roleId", value)}
        >
          <SelectTrigger className="h-11! w-full rounded-lg border-neutral-300 bg-white px-3 text-xs text-neutral-900 dark:bg-white">
            <SelectValue>
              {filters.roleId === "all"
                ? "Semua Role"
                : roles.find((role) => role.id === filters.roleId)?.name ||
                  "Semua Role"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white text-neutral-900">
            <SelectItem value="all">Semua Role</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

export const renderActions = ({
  row,
  deleteId,
  setDeleteId,
  onEdit,
  onDelete,
}: {
  row: UserDto;
  deleteId: string | null;
  setDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  onEdit: (user: UserDto) => void;
  onDelete: (id: string) => void | Promise<void>;
}) => (
  <div className="flex justify-end gap-1">
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="text-blue-600 hover:bg-blue-50 hover:text-white"
      onClick={() => onEdit(row)}
    >
      <SquarePen />
      <span className="sr-only">Edit akun</span>
    </Button>
    <Popover
      open={deleteId === row.id}
      onOpenChange={(open) => setDeleteId(open ? row.id : null)}
    >
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-50 hover:text-white"
          />
        }
      >
        <Trash2 />
        <span className="sr-only">Hapus akun</span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[24rem] gap-0 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl sm:p-4"
      >
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <TriangleAlert className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-6">
              Yakin ingin menghapus data ini?
            </p>
            <p className="mt-1 text-[13px] text-slate-500">
              Akun akan dinonaktifkan dan tidak dapat digunakan untuk login.
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 rounded-lg px-5 text-[13px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => setDeleteId(null)}
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-10 rounded-lg bg-red-600 px-5 text-[13px] font-semibold text-white hover:bg-red-700"
            onClick={() => void onDelete(row.id)}
          >
            Hapus
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
);
