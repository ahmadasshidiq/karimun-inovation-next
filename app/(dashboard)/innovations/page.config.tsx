"use client";

import type React from "react";
import {
  Download,
  Filter,
  Flame,
  Plus,
  Ribbon,
  Rocket,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import { Button } from "@/components/ui/button";
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
  awarded: boolean;
  skor: number;
};

export type InnovationFormValues = Omit<
  InnovationDto,
  "id" | "number" | "awarded"
>;
export type InnovationFilters = Pick<
  InnovationDto,
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
  skor: 0,
};

export const initialInnovations: InnovationDto[] = [
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

export const columnFormats: DefaultColumnFormat<InnovationDto>[] = [
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
    formatter: (value) =>
      typeof value === "string"
        ? new Intl.DateTimeFormat("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(`${value}T00:00:00`))
        : "-",
  },
  {
    key: "ImplementationDate",
    title: "Waktu Penerapan Inovasi",
    formatter: (value) =>
      typeof value === "string"
        ? new Intl.DateTimeFormat("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(`${value}T00:00:00`))
        : "-",
  },
  {
    key: "DevelopmentDate",
    title: "Waktu Pengembangan Inovasi",
    formatter: (value) =>
      typeof value === "string"
        ? new Intl.DateTimeFormat("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(`${value}T00:00:00`))
        : "-",
  },
  { key: "skor", title: "Estimasi Skor Kematangan" },

];

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
      className="inline-flex h-9 items-center gap-2 rounded-md bg-[#2362ee] px-5 text-xs font-semibold text-white hover:bg-blue-700"
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
