"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import SummaryCards from "./components/summary-cards";
import {
  columnFormats,
  filterPanel,
  headerToolbar,
  initialFilters,
  ITEMS_PER_PAGE,
  renderActions,
  type InnovationTableDto,
  type InnovationFilters,
} from "./page.config";

export default function InnovationPage() {
  const router = useRouter();
  const [data, setData] = useState<InnovationTableDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [summaryValues, setSummaryValues] = useState({
    total: 0,
    initiative: 0,
    trial: 0,
    implementation: 0,
    award: 0,
  });
  const [filters, setFilters] = useState<InnovationFilters>(initialFilters);
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total],
  );
  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((value) => value !== "all").length,
    [filters],
  );
  const fetchInnovations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      Object.entries(filters).forEach(([key, value]) => params.set(key, value));
      const response = await fetch(`/api/innovations?${params.toString()}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Gagal mengambil data inovasi.");
      setData(result.data || []);
      setTotal(result.total || 0);
      setSummaryValues(result.summary || { total: 0, initiative: 0, trial: 0, implementation: 0, award: 0 });
    } catch (error) {
      toast.add({
        title: "Gagal memuat inovasi",
        description: error instanceof Error ? error.message : "Silakan coba kembali.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    // Fetch berjalan setelah dependency pagination/filter berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInnovations();
  }, [fetchInnovations]);

  const deleteInnovation = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/innovations/${id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Gagal menghapus inovasi.");
      toast.add({ title: "Inovasi dihapus", description: "Data inovasi berhasil dihapus.", type: "success" });
      setDeleteId(null);
      await fetchInnovations();
    } catch (error) {
      toast.add({
        title: "Gagal menghapus inovasi",
        description: error instanceof Error ? error.message : "Silakan coba kembali.",
        type: "error",
      });
    }
  }, [fetchInnovations]);

  const setFilter = useCallback(
    (key: keyof InnovationFilters, value: string) => {
      setFilters((current) => ({ ...current, [key]: value }));
      setCurrentPage(1);
    },
    [],
  );
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, []);
  const toolbar = useMemo(
    () =>
      headerToolbar({
        onAdd: () => router.push("/innovations/create"),
        onExport: () =>
          toast.add({
            title: "Export Excel",
            description: "Data inovasi siap diekspor",
            type: "success",
          }),
        setShowFilter: setShowFilterPanel,
        activeFilterCount,
      }),
    [activeFilterCount, router],
  );
  const filtersUi = useMemo(
    () =>
      showFilterPanel
        ? filterPanel({ filters, setFilter, clearFilters })
        : null,
    [clearFilters, filters, setFilter, showFilterPanel],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader />
          <SummaryCards values={summaryValues} />
          <div className="mt-5 [&>div]:!bg-white [&>div]:!text-slate-700 [&_table]:!text-slate-700 [&_thead]:!border-slate-200 [&_tr]:!border-slate-200 [&_th]:!border-slate-100 [&_th]:!text-slate-700 [&_td]:!border-slate-200 [&_td]:!text-slate-700 [&_p]:!text-slate-600 [&_p_span]:!text-slate-900">
            <DynamicPage
              className="border! border-neutral-200! shadow-none! ring-0! backdrop-blur-none! dark:bg-white"
              toolbar={toolbar}
              filterPanel={filtersUi}
              columns={columnFormats}
              items={data}
              total={total}
              currentPage={currentPage}
              totalPages={totalPages}
              loading={loading}
              onPageChange={setCurrentPage}
              emptyMessage="Tidak ada data inovasi yang tersedia."
              getRowId={(row) => row.id}
              renderActions={(row) => renderActions({
                row,
                deleteId,
                setDeleteId,
                onView: (id) => router.push(`/innovations/${id}`),
                onEdit: (id) => router.push(`/innovations/${id}?mode=edit`),
                onIndicators: (id) => router.push(`/innovations/${id}/indicators`),
                onDelete: deleteInnovation,
              })}
            />
          </div>
        </div>
      </main>
    </AppSidebarLayout>
  );
}
