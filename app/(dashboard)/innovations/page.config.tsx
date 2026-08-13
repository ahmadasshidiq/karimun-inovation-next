"use client";

import type React from "react";
import {
  Download,
  Eye,
  ExternalLink,
  Filter,
  Flame,
  Plus,
  Ribbon,
  Rocket,
  Sparkles,
  TriangleAlert,
  Trophy,
  Trash2,
  type LucideIcon,
  SquarePen,
  FolderInput,
} from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type InnovationStage = "Inisiatif" | "Uji Coba" | "Penerapan";

export type InnovationDto = {
  id: string;
  name: string;
  latitude: string | null;
  longitude: string | null;
  status: "ACTIVE" | "INACTIVE";
  initiatorType: string | null;
  initiatorName: string | null;
  type: string | null;
  classification: string | null;
  innovationForm: string | null;
  thematic: string | null;
  pkpnCluster: string | null;
  pkpnSubCluster: string | null;
  governmentAffairs: string | null;
  trialPeriod: string | null;
  implementationPeriod: string | null;
  isDevelopment: boolean;
  description: string | null;
  purpose: string | null;
  files: unknown[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy?: {
    id: string;
    username: string;
    fullname: string;
    email: string | null;
  };
};

export type InnovationFileValue =
  | File
  | { name: string; size: number; url?: string; category?: string }
  | null;

export type InnovationEditorValues = {
  id?: string;
  name: string;
  latitude: string;
  longitude: string;
  status: "ACTIVE" | "INACTIVE";
  initiatorType: string;
  initiatorName: string;
  type: string;
  classification: string;
  innovationForm: string;
  thematic: string;
  pkpnCluster: string;
  pkpnSubCluster: string;
  governmentAffairs: string;
  trialPeriod: string;
  implementationPeriod: string;
  isDevelopment: boolean;
  description: string;
  purpose: string;
  files: InnovationFileValue[];
};

export const initialInnovationEditorValues: InnovationEditorValues = {
  name: "",
  latitude: "",
  longitude: "",
  status: "ACTIVE",
  initiatorType: "OPD",
  initiatorName: "",
  type: "Digital",
  classification: "Inovasi Perangkat Daerah",
  innovationForm: "Digital",
  thematic: "",
  pkpnCluster: "",
  pkpnSubCluster: "",
  governmentAffairs: "",
  trialPeriod: "",
  implementationPeriod: "",
  isDevelopment: false,
  description: "",
  purpose: "",
  files: [null, null, null, null],
};

export const innovationInputClass =
  "h-11 border-neutral-200 bg-neutral-50 text-[12px] text-neutral-900 placeholder:text-[12px] focus-visible:border-blue-500 focus-visible:ring-blue-100";

export const initiatorOptions = [
  "Kepala Daerah",
  "Anggota DPRD",
  "OPD",
  "ASN",
  "Masyarakat",
];

export const innovationTypeOptions = ["Digital", "Non Digital"];

export const innovationClassificationOptions = [
  "Inovasi Perangkat Daerah",
  "Inovasi Desa dan Kelurahan",
  "Inovasi Masyarakat",
];

export const innovationThematicOptions = [
  "Memperkokoh ideologi Pancasila, demokrasi, dan hak asasi manusia",
  "Memantapkan sistem pertahanan keamanan dan mendorong kemandirian bangsa",
  "Memperkuat kehidupan yang harmonis dengan lingkungan, alam, dan budaya",
];

export const MAX_SUPPORTING_FILE_SIZE = 2 * 1024 * 1024;

export type InnovationTableDto = {
  id: string;
  number: number;
  organization: string;
  innovationName: string;
  innovationForm: string;
  governmentAffair: string;
  initiator: string;
  stage: InnovationStage;
  trialDate: string;
  ImplementationDate: string;
  DevelopmentDate: string;
  latitude: string;
  longitude: string;
  awardFileUrl: string;
  awarded: boolean;
  skor: number;
};

export type InnovationFormValues = Omit<
  InnovationTableDto,
  "id" | "number" | "awarded"
>;
export type InnovationFilters = Pick<
  InnovationTableDto,
  "organization" | "innovationForm" | "governmentAffair" | "initiator"
> & { stage: string };
export type SummaryKey =
  | "total"
  | "initiative"
  | "trial"
  | "implementation"
  | "award";
export type SummaryCard = {
  key: SummaryKey;
  title: string;
  color: string;
  icon: LucideIcon;
};

export const ITEMS_PER_PAGE = 10;
export const initialFilters: InnovationFilters = {
  organization: "all",
  innovationForm: "all",
  governmentAffair: "all",
  initiator: "all",
  stage: "all",
};
export const initialFormValues: InnovationFormValues = {
  organization: "Badan Pendapatan Daerah",
  innovationName: "",
  innovationForm: "Digital",
  governmentAffair: "Keuangan",
  initiator: "",
  stage: "Inisiatif",
  trialDate: "2026-08-10",
  ImplementationDate: "2026-08-10",
  DevelopmentDate: "2026-08-10",
  latitude: "",
  longitude: "",
  awardFileUrl: "",
  skor: 0,
};

export const initialInnovations: InnovationTableDto[] = [
  {
    id: "innovation-1",
    number: 1,
    organization: "Badan Pendapatan Daerah",
    innovationName: "SIASAT TOP",
    innovationForm: "Digital",
    governmentAffair: "Keuangan",
    initiator: "Ahmad Ashidiq",
    stage: "Penerapan",
    trialDate: "2025-08-10",
    ImplementationDate: "2026-08-10",
    DevelopmentDate: "2024-08-10",
    latitude: "0.9867",
    longitude: "103.4381",
    awardFileUrl: "",
    awarded: true,
    skor: 85,
  },
];

export const summaryCards: SummaryCard[] = [
  {
    key: "total",
    title: "Total Inovasi",
    color: "bg-[#2362ee]",
    icon: Sparkles,
  },
  {
    key: "initiative",
    title: "Inisiatif",
    color: "bg-[#ff9d09]",
    icon: Ribbon,
  },
  { key: "trial", title: "Uji Coba", color: "bg-[#ff2455]", icon: Flame },
  {
    key: "implementation",
    title: "Penerapan",
    color: "bg-[#08bb7d]",
    icon: Rocket,
  },
  { key: "award", title: "Penghargaan", color: "bg-[#a97800]", icon: Trophy },
];

const formatTableDate = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) return "-";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const columnFormats: DefaultColumnFormat<InnovationTableDto>[] = [
  { key: "number", title: "#", formatter: (value) => String(value) },
  { key: "organization", title: "Nama Akun" },
  { key: "innovationName", title: "Nama Inovasi" },
  {
    key: "stage",
    title: "Tahapan Inovasi",
    formatter: (value) => (
      <span className="inline-flex min-w-32 justify-center rounded-full bg-emerald-200 px-4 py-1 text-xs font-medium text-emerald-700">
        {String(value)}
      </span>
    ),
  },
  { key: "initiator", title: "Nama Inisiator" },
  { key: "governmentAffair", title: "Urusan Pemerintahan Utama" },
  {
    key: "trialDate",
    title: "Waktu Uji Coba Inovasi",
    formatter: formatTableDate,
  },
  {
    key: "ImplementationDate",
    title: "Waktu Penerapan Inovasi",
    formatter: formatTableDate,
  },
  {
    key: "DevelopmentDate",
    title: "Waktu Pengembangan Inovasi",
    formatter: formatTableDate,
  },
  { key: "skor", title: "Estimasi Skor Kematangan" },
  {
    key: "awardFileUrl",
    title: "File Penghargaan",
    formatter: (value) =>
      typeof value === "string" && value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Lihat Dokumen
          <ExternalLink className="size-3.5" />
        </a>
      ) : (
        <span className="text-slate-400">-</span>
      ),
  },
  {
    key: "latitude",
    title: "Koordinat",
    formatter: (_value, row) =>
      row.latitude && row.longitude ? (
        <a
          href={`https://www.google.com/maps?q=${encodeURIComponent(`${row.latitude},${row.longitude}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Lihat Koordinat
          <ExternalLink className="size-3.5" />
        </a>
      ) : (
        <span className="text-slate-400">-</span>
      ),
  },
];

type RenderActionsProps = {
  row: InnovationTableDto;
  deleteId: string | null;
  setDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onIndicators: (id: string) => void;
  onDelete: (id: string) => void | Promise<void>;
};

export const renderActions = ({
  row,
  deleteId,
  setDeleteId,
  onView,
  onEdit,
  onIndicators,
  onDelete,
}: RenderActionsProps) => (
  <TooltipProvider delay={250}>
    <div className="flex justify-end gap-2">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Lihat inovasi"
              onClick={() => onView(row.id)}
              className="rounded-lg text-blue-600 hover:bg-blue-50 hover:text-white"
            >
              <Eye className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Lihat</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Edit inovasi"
              onClick={() => onEdit(row.id)}
              className="rounded-lg text-yellow-600 hover:bg-yellow-50 hover:text-white"
            >
              <SquarePen className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Indikator inovasi"
              onClick={() => onIndicators(row.id)}
              className="rounded-lg text-green-600 hover:bg-green-50 hover:text-white"
            >
              <FolderInput className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Indikator</TooltipContent>
      </Tooltip>

      <Popover
        open={deleteId === row.id}
        onOpenChange={(open) => setDeleteId(open ? row.id : null)}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Hapus inovasi"
                    className="rounded-lg text-red-500 hover:bg-red-50 hover:text-white"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                }
              />
            }
          />
          <TooltipContent>Hapus</TooltipContent>
        </Tooltip>
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
                Data yang dihapus tidak dapat dikembalikan.
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteId(null)}
              className="h-10 rounded-lg px-5 text-[13px] font-semibold"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onDelete(row.id)}
              className="h-10 rounded-lg bg-red-600 px-5 text-[13px] font-semibold text-white hover:bg-red-700"
            >
              Hapus
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </TooltipProvider>
);

type HeaderToolbarProps = {
  onAdd: () => void;
  onExport: () => void;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilterCount: number;
};

export const headerToolbar = ({
  onAdd,
  onExport,
  setShowFilter,
  activeFilterCount,
}: HeaderToolbarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <Button
      type="button"
      onClick={onAdd}
      className="inline-flex h-9 items-center gap-2 rounded-md bg-[#2362ee] px-4 text-xs font-semibold text-white hover:bg-blue-700"
    >
      <Plus className="size-4" />
      Tambah Inovasi
    </Button>
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowFilter((current) => !current)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
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
        className="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-500 bg-white px-4 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
      >
        <Download className="size-4" />
        Export Excel
      </Button>
    </div>
  </div>
);

type FilterPanelProps = {
  filters: InnovationFilters;
  setFilter: (key: keyof InnovationFilters, value: string) => void;
  clearFilters: () => void;
};
const filterOptions: Array<{
  key: keyof InnovationFilters;
  label: string;
  allLabel: string;
  options: string[];
}> = [
  {
    key: "organization",
    label: "Organisasi Perangkat Daerah",
    allLabel: "Semua Organisasi Perangkat Daerah",
    options: ["Badan Pendapatan Daerah", "Dinas Komunikasi dan Informatika"],
  },
  {
    key: "innovationForm",
    label: "Bentuk Inovasi",
    allLabel: "Semua Bentuk Inovasi",
    options: ["Digital", "Non Digital"],
  },
  {
    key: "governmentAffair",
    label: "Jenis Urusan",
    allLabel: "Semua Jenis Urusan",
    options: ["Keuangan", "Pendidikan", "Kesehatan"],
  },
  {
    key: "initiator",
    label: "Inisiator",
    allLabel: "Semua Inisiator",
    options: ["Ahmad Ashidiq", "Admin Karimun"],
  },
  {
    key: "stage",
    label: "Tahapan Inovasi",
    allLabel: "Semua Tahapan Inovasi",
    options: ["Inisiatif", "Uji Coba", "Penerapan"],
  },
];

export const filterPanel = ({
  filters,
  setFilter,
  clearFilters,
}: FilterPanelProps) => (
  <div className="rounded-xl border border-neutral-200 bg-[#fafbfc] p-5">
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold text-neutral-900">
        Filter Inovasi Perangkat Daerah
      </h2>
      <Button
        type="button"
        variant="link"
        onClick={clearFilters}
        className="text-xs font-semibold text-blue-600 hover:underline"
      >
        Reset Filter
      </Button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {filterOptions.map((option) => (
        <div key={option.key} className="space-y-2">
          <span className="block text-xs font-semibold text-slate-600">
            {option.label}
          </span>
          <Select
            value={filters[option.key]}
            onValueChange={(value) => value && setFilter(option.key, value)}
          >
            <SelectTrigger className="h-11! w-full rounded-lg border-neutral-300 bg-white px-3 text-xs text-neutral-900 dark:bg-white">
              <SelectValue>
                {filters[option.key] === "all"
                  ? option.allLabel
                  : filters[option.key]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white text-neutral-900">
              <SelectItem value="all">{option.allLabel}</SelectItem>
              {option.options.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  </div>
);
