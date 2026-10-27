"use client";
/* eslint-disable @next/next/no-img-element -- URL cover dapat berasal dari MinIO yang dikonfigurasi admin. */

import { Archive, Eye, FilePenLine, Send, SquarePen } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterPanel, FilterSearch, FilterSelect, TableActions, TableToolbar } from "@/components/table-elements";
import { formatDateId } from "@/lib/helper/date";

export type NewsStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type NewsType = "BERITA" | "AGENDA";

export type NewsDto = {
  id: string; number?: number; title: string; slug: string; excerpt: string; content: string;
  coverImage: string | null; category: string; categoryId: string; type: NewsType; eventDate: string;
  isFeatured: boolean; status: NewsStatus; publishedAt: string; authorName: string;
};

export type NewsFormValues = Omit<NewsDto, "id" | "number" | "authorName" | "category">;
export type NewsFilters = { search: string; status: string; category: string };

export const ITEMS_PER_PAGE = 10;
export const initialFilters: NewsFilters = { search: "", status: "all", category: "all" };
export const statusOptions = [
  { value: "DRAFT", label: "Draft" }, { value: "PUBLISHED", label: "Published" }, { value: "ARCHIVED", label: "Archived" },
];

export const columnFormats: DefaultColumnFormat<NewsDto>[] = [
  { key: "coverImage", title: "Cover", formatter: (value, row) => value ? <img src={String(value)} alt={row.title} className="h-10 w-14 rounded-md object-cover" /> : <div className="flex h-10 w-14 items-center justify-center rounded-md bg-slate-100 text-[10px] text-slate-400">Tidak ada</div> },
  { key: "title", title: "Judul", textClassName: "min-w-64 font-semibold text-slate-900!", formatter: (value, row) => <div><p>{String(value)}</p>{row.isFeatured ? <span className="text-[10px] font-semibold text-amber-600">Berita utama</span> : null}</div> },
  { key: "category", title: "Kategori" },
  { key: "status", title: "Status", formatter: (value) => <Badge className={value === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : value === "DRAFT" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"}>{String(value)}</Badge> },
  { key: "publishedAt", title: "Publikasi", formatter: (value) => value ? formatDateId(String(value)) : "-" },
  { key: "authorName", title: "Penulis" },
];

export const headerToolbar = (props: { onAdd: () => void; onToggleFilter: () => void; activeFilterCount: number }) => <TableToolbar addLabel="Tambah Berita" {...props} />;
export const filterPanel = ({ filters, setFilter, applyFilters, clearFilters }: { filters: NewsFilters; setFilter: (key: keyof NewsFilters, value: string) => void; applyFilters: () => void; clearFilters: () => void }) => <FilterPanel title="Filter Berita" onApply={applyFilters} onReset={clearFilters}><FilterSearch value={filters.search} onChange={(value) => setFilter("search", value)} placeholder="Cari judul berita..." /><FilterSelect label="Status" allLabel="Semua Status" value={filters.status} options={statusOptions} onChange={(value) => setFilter("status", value)} /></FilterPanel>;

export const renderActions = ({ row, onEdit, onStatus, onArchive, onView }: { row: NewsDto; onEdit: (value: NewsDto) => void; onStatus: (id: string, status: NewsStatus) => void; onArchive: (id: string) => void; onView: (slug: string) => void }) => <TableActions><Button size="icon" variant="ghost" title="Ubah" onClick={() => onEdit(row)}><SquarePen className="size-4 text-amber-600" /></Button>{row.status === "PUBLISHED" ? <Button size="icon" variant="ghost" title="Jadikan draft" onClick={() => onStatus(row.id, "DRAFT")}><FilePenLine className="size-4 text-blue-600" /></Button> : <Button size="icon" variant="ghost" title="Publikasikan" onClick={() => onStatus(row.id, "PUBLISHED")}><Send className="size-4 text-emerald-600" /></Button>}<Button size="icon" variant="ghost" title="Lihat di situs" onClick={() => onView(row.slug)}><Eye className="size-4 text-indigo-600" /></Button><Button size="icon" variant="ghost" title="Arsipkan" onClick={() => onArchive(row.id)}><Archive className="size-4 text-red-500" /></Button></TableActions>;
