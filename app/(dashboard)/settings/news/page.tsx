"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import FormData from "./components/form-data";
import { columnFormats, filterPanel, headerToolbar, initialFilters, ITEMS_PER_PAGE, renderActions, type NewsDto, type NewsFilters, type NewsFormValues, type NewsStatus } from "./page.config";

type Response = { data?: NewsDto[]; total?: number };

export default function NewsPage() {
  const [data, setData] = useState<NewsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState<NewsFilters>(initialFilters);
  const [draftFilters, setDraftFilters] = useState<NewsFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [detailItem, setDetailItem] = useState<NewsDto>();
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)), [total]);
  const activeFilterCount = useMemo(() => Object.values(filters).filter((value) => value && value !== "all").length, [filters]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(currentPage), limit: String(ITEMS_PER_PAGE) });
      Object.entries(filters).forEach(([key, value]) => { if (value && value !== "all") params.set(key, value); });
      const response = await fetch(`/api/news?${params.toString()}`, { cache: "no-store" });
      const payload = await parseApiResponse<Response>(response, "Gagal mengambil berita");
      setData(Array.isArray(payload.data) ? payload.data.map((item, index) => ({ ...item, number: (currentPage - 1) * ITEMS_PER_PAGE + index + 1 })) : []);
      setTotal(Number(payload.total) || 0);
    } catch (error) { toast.add({ type: "error", title: error instanceof Error ? error.message : "Gagal mengambil berita" }); }
    finally { setLoading(false); }
  }, [currentPage, filters]);

  useEffect(() => {
    // Data tabel disinkronkan ketika pagination atau filter berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNews();
  }, [fetchNews]);
  const uploadCover = useCallback(async (file: File) => {
    const body = new window.FormData(); body.set("file", file);
    const response = await fetch("/api/news/upload-cover", { method: "POST", body });
    const payload = await parseApiResponse<{ data?: { url?: string } }>(response, "Gagal mengunggah cover");
    if (!payload.data?.url) throw new Error("URL cover tidak tersedia.");
    return payload.data.url;
  }, []);
  const save = useCallback(async (values: NewsFormValues) => {
    try {
      setSaving(true);
      const response = await fetch(detailItem ? `/api/news/${detailItem.id}` : "/api/news", { method: detailItem ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      await parseApiResponse(response, "Gagal menyimpan berita");
      toast.add({ type: "success", title: "Berita berhasil disimpan." }); setShowModal(false); setDetailItem(undefined); await fetchNews();
    } catch (error) { toast.add({ type: "error", title: error instanceof Error ? error.message : "Gagal menyimpan berita" }); }
    finally { setSaving(false); }
  }, [detailItem, fetchNews]);
  const changeStatus = useCallback(async (id: string, status: NewsStatus) => {
    try { const response = await fetch(`/api/news/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); await parseApiResponse(response, "Gagal mengubah status berita"); toast.add({ type: "success", title: "Status berita diperbarui." }); await fetchNews(); } catch (error) { toast.add({ type: "error", title: error instanceof Error ? error.message : "Gagal mengubah status" }); }
  }, [fetchNews]);
  const archive = useCallback(async (id: string) => { if (!window.confirm("Arsipkan berita ini? Berita tidak akan tampil di situs.")) return; try { const response = await fetch(`/api/news/${id}`, { method: "DELETE" }); await parseApiResponse(response, "Gagal mengarsipkan berita"); toast.add({ type: "success", title: "Berita diarsipkan." }); await fetchNews(); } catch (error) { toast.add({ type: "error", title: error instanceof Error ? error.message : "Gagal mengarsipkan berita" }); } }, [fetchNews]);
  const toolbar = useMemo(() => headerToolbar({ onAdd: () => { setDetailItem(undefined); setShowModal(true); }, onToggleFilter: () => setShowFilterPanel((value) => !value), activeFilterCount }), [activeFilterCount]);
  const filtersUi = useMemo(() => showFilterPanel ? filterPanel({ filters: draftFilters, setFilter: (key, value) => setDraftFilters((current) => ({ ...current, [key]: value })), applyFilters: () => { setFilters(draftFilters); setCurrentPage(1); }, clearFilters: () => { setDraftFilters(initialFilters); setFilters(initialFilters); setCurrentPage(1); } }) : null, [draftFilters, showFilterPanel]);
  return <AppSidebarLayout><main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7"><div className="mx-auto w-full max-w-[1600px]"><AppPageHeader title="Berita" description="Kelola berita dan agenda yang akan ditampilkan di situs publik." /><DynamicPage className="mt-5" toolbar={toolbar} filterPanel={filtersUi} columns={columnFormats} items={data} total={total} currentPage={currentPage} totalPages={totalPages} loading={loading} emptyMessage="Belum ada berita." onPageChange={setCurrentPage} getRowId={(row) => row.id} renderActions={(row) => renderActions({ row, onEdit: (item) => { setDetailItem(item); setShowModal(true); }, onStatus: changeStatus, onArchive: archive, onView: (slug) => window.open(`/berita/${slug}`, "_blank", "noopener,noreferrer") })} /></div></main>{showModal ? <FormData open initialData={detailItem} saving={saving} onClose={() => { setShowModal(false); setDetailItem(undefined); }} onUpload={uploadCover} onSubmit={save} /> : null}</AppSidebarLayout>;
}
