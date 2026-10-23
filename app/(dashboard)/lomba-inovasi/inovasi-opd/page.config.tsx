"use client";

import type React from "react";
import { ClipboardCheck, Eye, FileText, History, Plus, Search, SquarePen, Star } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import { Button } from "@/components/ui/button";

export type InnovationStage = "Inisiatif" | "Uji Coba" | "Penerapan";

export type OpdInnovationDto = {
  id: string;
  innovationId: string;
  number: number;
  organization: string;
  innovationName: string;
  governmentAffair: string;
  stage: InnovationStage;
  trialDate: string;
  ImplementationDate: string;
  DevelopmentDate: string;
  latitude: string;
  longitude: string;
  score?: number;
  status: string;
  assessmentProgress?: string;
};

export const ITEMS_PER_PAGE = 10;

const formatDate = (value: unknown) => {
  if (typeof value !== "string" || !value) return "-";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID");
};

export const columnFormats: DefaultColumnFormat<OpdInnovationDto>[] = [
  { key: "number", title: "#" },
  { key: "localGovernment", title: "Nama Pemda", formatter: () => "Kabupaten Karimun" },
  { key: "innovationName", title: "Nama Inovasi" },
  { key: "organization", title: "Nama Akun" },
  { key: "stage", title: "Tahapan Inovasi" },
  {
    key: "latitude",
    title: "Koordinat",
    formatter: (_value, row) => row.latitude && row.longitude ? `${row.latitude}, ${row.longitude}` : "-",
  },
  { key: "governmentAffair", title: "Urusan Pemerintahan Utama" },
  { key: "trialDate", title: "Waktu Uji Coba Inovasi Daerah", formatter: formatDate },
  { key: "ImplementationDate", title: "Waktu Penerapan Inovasi Daerah", formatter: formatDate },
  { key: "DevelopmentDate", title: "Waktu Pengembangan Inovasi Daerah", formatter: formatDate },
  { key: "score", title: "Nilai/Kematangan", formatter: (value) => Number(value || 0).toFixed(2) },
  {
    key: "status",
    title: "Status",
    formatter: (value) => {
      const labels: Record<string, string> = { DRAFT: "Draft", SUBMITTED: "Diajukan", WAITING_VERIFICATION: "Menunggu Verifikasi", NEEDS_REVISION: "Perlu Perbaikan", RESUBMITTED: "Diajukan Kembali", VERIFIED: "Lolos Verifikasi", REJECTED: "Tidak Lolos", UNDER_ASSESSMENT: "Sedang Dinilai", ASSESSED: "Selesai Dinilai", FINALIST: "Finalis" };
      const colors: Record<string, string> = { DRAFT: "bg-slate-100 text-slate-600", WAITING_VERIFICATION: "bg-amber-100 text-amber-700", NEEDS_REVISION: "bg-red-100 text-red-700", VERIFIED: "bg-emerald-100 text-emerald-700", UNDER_ASSESSMENT: "bg-blue-100 text-blue-700", ASSESSED: "bg-violet-100 text-violet-700", FINALIST: "bg-yellow-100 text-yellow-800" };
      return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${colors[String(value)] || "bg-slate-100 text-slate-600"}`}>{labels[String(value)] || String(value)}</span>;
    },
  },
];

type ToolbarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAdd: () => void;
  canAdd: boolean;
};

export const headerToolbar = ({ searchTerm, setSearchTerm, onAdd, canAdd }: ToolbarProps) => (
  <div className="flex flex-wrap items-center justify-end gap-3">
    <label className="relative block w-full sm:w-60">
      <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
      <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="CARI..." className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#124579]" />
    </label>
    {canAdd ? <Button onClick={onAdd} className="h-9 gap-2 rounded-md bg-[#124579] px-4 text-[11px] font-bold uppercase text-white hover:bg-[#0d365f]">
      <Plus className="size-4" /> Tambah Inovasi
    </Button> : null}
  </div>
);

type ActionProps = {
  row: OpdInnovationDto;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onIndicators: (id: string) => void;
  onDocuments: (id: string) => void;
  onVerification: (id: string) => void;
  onHistory: (id: string) => void;
  onDelete: (id: string) => void;
};

export const renderActions = ({ row, onView, onEdit, onIndicators, onDocuments, onVerification, onHistory, onDelete }: ActionProps) => (
  <div className="flex justify-end gap-1 text-slate-400">
    <button type="button" onClick={() => onView(row.id)} title="Lihat detail" aria-label="Lihat detail" className="rounded-md p-1.5 transition hover:bg-blue-50 hover:text-blue-600"><Eye className="size-4" /></button>
    <button type="button" onClick={() => onEdit(row.innovationId)} title="Edit inovasi" aria-label="Edit inovasi" className="rounded-md p-1.5 transition hover:bg-amber-50 hover:text-amber-600"><SquarePen className="size-4" /></button>
    <button type="button" onClick={() => onDocuments(row.id)} title="Lihat dokumen" aria-label="Lihat dokumen" className="rounded-md p-1.5 transition hover:bg-cyan-50 hover:text-cyan-600"><FileText className="size-4" /></button>
    <button type="button" onClick={() => onVerification(row.id)} title="Verifikasi peserta" aria-label="Verifikasi peserta" className="rounded-md p-1.5 transition hover:bg-emerald-50 hover:text-emerald-600"><ClipboardCheck className="size-4" /></button>
    <button type="button" onClick={() => onIndicators(row.id)} title="Beri penilaian" aria-label="Beri penilaian" className="rounded-md p-1.5 transition hover:bg-yellow-50 hover:text-yellow-600"><Star className="size-4" /></button>
    <button type="button" onClick={() => onHistory(row.id)} title="Lihat riwayat" aria-label="Lihat riwayat" className="rounded-md p-1.5 transition hover:bg-violet-50 hover:text-violet-600"><History className="size-4" /></button>
    {row.status === "DRAFT" ? <button onClick={() => onDelete(row.id)} title="Hapus draft" className="text-red-400" aria-label="Hapus draft">×</button> : null}
  </div>
);
