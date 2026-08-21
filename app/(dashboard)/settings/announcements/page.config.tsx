"use client";

import type React from "react";
import { Filter, Plus, Search, SquarePen, Trash2 } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateId } from "@/lib/helper/date";

export type AnnouncementStatus = "ACTIVE" | "INACTIVE";
export type AnnouncementDto = {
  id: string;
  number?: number;
  title: string;
  content: string;
  announcementDate: string;
  status: AnnouncementStatus;
};
export type AnnouncementFormValues = Omit<AnnouncementDto, "id" | "number">;
export type AnnouncementListResponse = { data?: AnnouncementDto[]; total?: number };
export const ITEMS_PER_PAGE = 10;

export const columnFormats: DefaultColumnFormat<AnnouncementDto>[] = [
  { key: "number", title: "#", formatter: (value) => String(value || "-") },
  { key: "title", title: "Judul Pengumuman", textClassName: "min-w-72 font-semibold" },
  { key: "announcementDate", title: "Tanggal", formatter: (value) => formatDateId(typeof value === "string" ? value : null) },
  { key: "status", title: "Status", formatter: (value) => value === "ACTIVE" ? <Badge className="bg-emerald-100 text-emerald-700">Aktif</Badge> : <Badge className="bg-slate-200 text-slate-600">Tidak Aktif</Badge> },
];

export const headerToolbar = ({ onAdd, setShowFilter, activeFilterCount }: { onAdd: () => void; setShowFilter: React.Dispatch<React.SetStateAction<boolean>>; activeFilterCount: number }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <Button onClick={onAdd} className="h-9 bg-[#2362ee] px-4 text-xs font-semibold text-white hover:bg-blue-700"><Plus className="size-4" />Tambah Pengumuman</Button>
    <Button variant="outline" onClick={() => setShowFilter((value) => !value)} className="h-9 border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900"><Filter className="size-4" />Filter{activeFilterCount > 0 && <span className="rounded-full bg-blue-600 px-1.5 text-[10px] text-white">{activeFilterCount}</span>}</Button>
  </div>
);

export const filterPanel = ({ searchTerm, setSearchTerm, status, setStatus, clearFilters }: { searchTerm: string; setSearchTerm: React.Dispatch<React.SetStateAction<string>>; status: string; setStatus: React.Dispatch<React.SetStateAction<string>>; clearFilters: () => void }) => (
  <div className="rounded-xl border border-neutral-200 bg-[#fafbfc] p-5">
    <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-bold">Filter Pengumuman</h2><Button variant="link" onClick={clearFilters} className="text-xs text-blue-600">Reset Filter</Button></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2"><span className="text-xs font-semibold text-slate-600">Pencarian</span><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Cari judul pengumuman..." className="h-11 border-neutral-300 bg-white pl-9 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-100 dark:bg-white dark:text-slate-900"/></div></div>
      <div className="space-y-2"><span className="text-xs font-semibold text-slate-600">Status</span><Select value={status} onValueChange={(value) => value && setStatus(value)}><SelectTrigger className="h-11! w-full border-neutral-300 bg-white text-slate-900 focus-visible:border-blue-500 focus-visible:ring-blue-100 dark:bg-white dark:text-slate-900 dark:hover:bg-white"><SelectValue>{status === "all" ? "Semua Status" : status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}</SelectValue></SelectTrigger><SelectContent className="border-neutral-200 bg-white text-slate-900"><SelectItem value="all">Semua Status</SelectItem><SelectItem value="ACTIVE">Aktif</SelectItem><SelectItem value="INACTIVE">Tidak Aktif</SelectItem></SelectContent></Select></div>
    </div>
  </div>
);

export const renderActions = ({ row, onEdit, onDelete, deleteId, setDeleteId }: { row: AnnouncementDto; onEdit: (row: AnnouncementDto) => void; onDelete: (id: string) => void; deleteId: string | null; setDeleteId: React.Dispatch<React.SetStateAction<string | null>> }) => (
  <div className="flex justify-end gap-1">
    <Button variant="ghost" size="icon" onClick={() => onEdit(row)} className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"><SquarePen/><span className="sr-only">Edit</span></Button>
    <Popover open={deleteId === row.id} onOpenChange={(open) => setDeleteId(open ? row.id : null)}><PopoverTrigger render={<Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600"/>}><Trash2/><span className="sr-only">Hapus</span></PopoverTrigger><PopoverContent align="end" className="w-72 rounded-xl bg-white p-4"><p className="text-sm font-semibold">Hapus pengumuman ini?</p><p className="mt-1 text-xs text-slate-500">Data yang dihapus tidak akan tampil kembali.</p><div className="mt-4 flex justify-end gap-2"><Button variant="ghost" onClick={() => setDeleteId(null)} className="hover:bg-slate-100 hover:text-slate-900">Batal</Button><Button onClick={() => onDelete(row.id)} className="bg-red-600 text-white hover:bg-red-700">Hapus</Button></div></PopoverContent></Popover>
  </div>
);
