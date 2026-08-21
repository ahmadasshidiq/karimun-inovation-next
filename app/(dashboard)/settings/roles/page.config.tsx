"use client";

import type React from "react";
import { Plus, Search, SquarePen, Trash2, TriangleAlert } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

export const ITEMS_PER_PAGE = 10;

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

export const headerToolbar = ({
  searchTerm,
  setSearchTerm,
  onAdd,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onAdd: () => void;
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <Button
      type="button"
      onClick={onAdd}
      className="inline-flex h-9 items-center gap-2 rounded-md bg-[#2362ee] px-4 text-xs font-semibold text-white hover:bg-blue-700"
    >
      <Plus />
      Tambah Role
    </Button>
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <Input
        className="h-9 border-slate-200 bg-white pl-9 text-slate-900 placeholder:text-slate-400"
        placeholder="Cari nama role..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
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
  row: RoleDto;
  deleteId: string | null;
  setDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  onEdit: (role: RoleDto) => void;
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
      <span className="sr-only">Edit role</span>
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
        <span className="sr-only">Hapus role</span>
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
              Role yang masih digunakan oleh pengguna tidak dapat dihapus.
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
