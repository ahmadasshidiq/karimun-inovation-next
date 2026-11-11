"use client";

import { Eye } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  FilterField,
  FilterPanel,
  FilterSearch,
  FilterSelect,
  TableActions,
  TableToolbar,
} from "@/components/table-elements";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDateId } from "@/lib/helper/date";

export type ActivityLogOptionDto = { id: string; name: string };

export type ActivityLogDto = {
  id: string;
  number?: number;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: { id: string; fullname: string; username: string } | null;
};

export type ActivityLogFilters = {
  search: string;
  action: string;
  entity: string;
  userId: string;
  startDate: string;
  endDate: string;
};

export type ActivityLogListResponse = {
  data?: ActivityLogDto[];
  total?: number;
  message?: string;
  canExport?: boolean;
  options?: {
    actions?: string[];
    entities?: string[];
    users?: ActivityLogOptionDto[];
  };
};

export const ITEMS_PER_PAGE = 10;

export const initialFilters: ActivityLogFilters = {
  search: "",
  action: "all",
  entity: "all",
  userId: "all",
  startDate: "",
  endDate: "",
};

const actionLabels: Record<string, string> = {
  GET: "Lihat",
  POST: "Tambah",
  PUT: "Ubah",
  PATCH: "Ubah",
  DELETE: "Hapus",
  LOGIN: "Login",
  LOGIN_FAILED: "Login Gagal",
  LOGIN_BLOCKED: "Login Diblokir",
  LOGIN_MFA_CHALLENGE: "Verifikasi 2FA",
  LOGIN_MFA_FAILED: "Kode 2FA Salah",
  LOGIN_MFA_BLOCKED: "2FA Diblokir",
  LOGIN_RECOVERY_CODE: "Login Kode Pemulihan",
  MFA_ENABLED: "2FA Diaktifkan",
  MFA_DISABLED: "2FA Dinonaktifkan",
  MFA_RESET: "2FA Direset Admin",
  MFA_SETUP_DENIED: "Aktivasi 2FA Ditolak",
  MFA_DISABLE_DENIED: "Nonaktif 2FA Ditolak",
};

export const formatActionLabel = (action: string) => {
  if (actionLabels[action]) return actionLabels[action];
  if (action.endsWith("_DENIED")) {
    const method = action.replace(/_DENIED$/, "");
    return `${actionLabels[method] || method} Ditolak`;
  }
  return action;
};

const dangerActions = /FAILED|BLOCKED|DENIED|DISABLED|RESET|^DELETE$/;
const successActions = /^LOGIN$|ENABLED|^POST$/;

const actionBadgeClass = (action: string) => {
  if (dangerActions.test(action)) return "bg-red-100 text-red-700";
  if (successActions.test(action)) return "bg-emerald-100 text-emerald-700";
  return "bg-slate-200 text-slate-600";
};

export const formatDateTimeId = (value: unknown) =>
  formatDateId(value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta",
  });

export const columnFormats: DefaultColumnFormat<ActivityLogDto>[] = [
  { key: "number", title: "#", formatter: (value) => String(value || "-") },
  {
    key: "createdAt",
    title: "Waktu",
    textClassName: "min-w-44",
    formatter: (value) => formatDateTimeId(value),
  },
  {
    key: "user",
    title: "Pengguna",
    textClassName: "min-w-48 font-semibold text-slate-900!",
    formatter: (_value, row) =>
      row.user ? `${row.user.fullname} (${row.user.username})` : "-",
  },
  {
    key: "action",
    title: "Aktivitas",
    formatter: (value) => (
      <Badge className={actionBadgeClass(String(value))}>
        {formatActionLabel(String(value))}
      </Badge>
    ),
  },
  {
    key: "entity",
    title: "Modul",
    textClassName: "min-w-48",
    formatter: (value) => String(value || "-"),
  },
  {
    key: "ipAddress",
    title: "Alamat IP",
    formatter: (value) => String(value || "-"),
  },
];

type HeaderToolbarProps = {
  onExport?: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar {...props} />
);

type FilterPanelProps = {
  filters: ActivityLogFilters;
  setFilter: (key: keyof ActivityLogFilters, value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  actions: string[];
  entities: string[];
  users: ActivityLogOptionDto[];
};

const dateInputClassName = "h-11! border-neutral-300 bg-white text-xs";

export const filterPanel = ({
  filters,
  setFilter,
  applyFilters,
  clearFilters,
  actions,
  entities,
  users,
}: FilterPanelProps) => (
  <FilterPanel
    title="Filter Log Aktivitas"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama, username, IP, atau ID data..."
    />
    <FilterSelect
      label="Pengguna"
      allLabel="Semua Pengguna"
      value={filters.userId}
      options={users.map((user) => ({ value: user.id, label: user.name }))}
      onChange={(value) => setFilter("userId", value)}
    />
    <FilterSelect
      label="Aktivitas"
      allLabel="Semua Aktivitas"
      value={filters.action}
      options={actions.map((action) => ({
        value: action,
        label: formatActionLabel(action),
      }))}
      onChange={(value) => setFilter("action", value)}
    />
    <FilterSelect
      label="Modul"
      allLabel="Semua Modul"
      value={filters.entity}
      options={entities.map((entity) => ({ value: entity, label: entity }))}
      onChange={(value) => setFilter("entity", value)}
    />
    <FilterField label="Dari Tanggal">
      <Input
        type="date"
        value={filters.startDate}
        max={filters.endDate || undefined}
        onChange={(event) => setFilter("startDate", event.target.value)}
        className={dateInputClassName}
      />
    </FilterField>
    <FilterField label="Sampai Tanggal">
      <Input
        type="date"
        value={filters.endDate}
        min={filters.startDate || undefined}
        onChange={(event) => setFilter("endDate", event.target.value)}
        className={dateInputClassName}
      />
    </FilterField>
  </FilterPanel>
);

type RenderActionsProps = {
  row: ActivityLogDto;
  onView: (log: ActivityLogDto) => void;
};

export const renderActions = ({ row, onView }: RenderActionsProps) => (
  <TableActions>
    <ActionButton
      label="Lihat"
      icon={Eye}
      tone="blue"
      onClick={() => onView(row)}
    />
  </TableActions>
);
