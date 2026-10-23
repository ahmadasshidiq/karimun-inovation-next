"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import SummaryCards from "./components/summary-cards";
import {
  columnFormats,
  filterPanel,
  headerToolbar,
  initialFilters,
  ITEMS_PER_PAGE,
  innovationCategoryOptions,
  renderActions,
  type ActiveCompetitionPeriod,
  type InnovationFilterOptions,
  type InnovationFilters,
  type InnovationTableDto,
  type SubmissionAccess,
  type SubmissionTrack,
} from "./page.config";

const initialSummary = {
  total: 0,
  initiative: 0,
  trial: 0,
  implementation: 0,
  award: 0,
};

type InnovationListResponse = {
  data?: InnovationTableDto[];
  total?: number;
  summary?: typeof initialSummary;
  options?: Partial<InnovationFilterOptions>;
  activeCompetitionPeriod?: ActiveCompetitionPeriod | null;
  submissionAccess?: SubmissionAccess;
  message?: string;
};

export default function InnovationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const categoryLabel = innovationCategoryOptions.find(
    (option) => option.value === category,
  )?.label;
  const [data, setData] = useState<InnovationTableDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [summaryValues, setSummaryValues] = useState(initialSummary);
  const [draftFilters, setDraftFilters] =
    useState<InnovationFilters>(initialFilters);
  const [filters, setFilters] = useState<InnovationFilters>(initialFilters);
  const [filterOptions, setFilterOptions] = useState<InnovationFilterOptions>({
    governmentAffairs: [],
    initiators: [],
  });
  const [activeCompetitionPeriod, setActiveCompetitionPeriod] =
    useState<ActiveCompetitionPeriod | null>(null);
  const [submissionAccess, setSubmissionAccess] = useState<SubmissionAccess>({
    contract: false,
    competition: false,
  });
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total],
  );
  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter((value) => value && value !== "all")
        .length,
    [filters],
  );
  const categoryQuery = category
    ? `category=${encodeURIComponent(category)}`
    : "";

  const fetchInnovations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      if (category) params.set("category", category);
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value);
      });

      const response = await fetch(`/api/innovations?${params.toString()}`, {
        cache: "no-store",
      });
      const payload = await parseApiResponse<InnovationListResponse>(
        response,
        "Gagal mengambil data inovasi",
      );
      setData(Array.isArray(payload.data) ? payload.data : []);
      setTotal(Number(payload.total) || 0);
      setSummaryValues(payload.summary || initialSummary);
      setFilterOptions({
        governmentAffairs: payload.options?.governmentAffairs ?? [],
        initiators: payload.options?.initiators ?? [],
      });
      setActiveCompetitionPeriod(payload.activeCompetitionPeriod ?? null);
      setSubmissionAccess(
        payload.submissionAccess ?? { contract: false, competition: false },
      );
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data inovasi",
      });
    } finally {
      setLoading(false);
    }
  }, [category, currentPage, filters]);

  useEffect(() => {
    // Fetch berjalan setelah pagination, kategori, atau filter yang diterapkan berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchInnovations();
  }, [fetchInnovations]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/innovations/${id}`, {
          method: "DELETE",
        });
        await parseApiResponse(response, "Gagal menghapus inovasi");
        toast.add({ type: "success", title: "Inovasi berhasil dihapus" });
        setDeleteId(null);

        if (data.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        } else {
          await fetchInnovations();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error ? error.message : "Gagal menghapus inovasi",
        });
      }
    },
    [currentPage, data.length, fetchInnovations],
  );

  const handleSubmitTrack = useCallback(
    async (id: string, track: SubmissionTrack) => {
      try {
        const response = await fetch(`/api/innovations/${id}/submissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ track }),
        });
        const payload = await parseApiResponse(
          response,
          "Gagal mengirim inovasi",
        );
        toast.add({
          type: "success",
          title: payload.message || "Inovasi berhasil dikirim",
        });
        await fetchInnovations();
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error ? error.message : "Gagal mengirim inovasi",
        });
      }
    },
    [fetchInnovations],
  );

  const setFilter = useCallback(
    (key: keyof InnovationFilters, value: string) => {
      setDraftFilters((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const applyFilters = useCallback(() => {
    setFilters({ ...draftFilters, search: draftFilters.search.trim() });
    setCurrentPage(1);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
    setCurrentPage(1);
  }, []);

  const toolbar = useMemo(
    () =>
      headerToolbar({
        onAdd: () =>
          router.push(
            `/innovations/create?category=${encodeURIComponent(
              category || "perangkat-daerah",
            )}`,
          ),
        onExport: () =>
          toast.add({
            title: "Export Excel",
            description: "Data inovasi siap diekspor",
            type: "success",
          }),
        onToggleFilter: () => setShowFilterPanel((current) => !current),
        activeFilterCount,
      }),
    [activeFilterCount, category, router],
  );

  const filtersUi = useMemo(
    () =>
      showFilterPanel
        ? filterPanel({
            filters: draftFilters,
            options: filterOptions,
            setFilter,
            applyFilters,
            clearFilters,
          })
        : null,
    [
      applyFilters,
      clearFilters,
      draftFilters,
      filterOptions,
      setFilter,
      showFilterPanel,
    ],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title={
              categoryLabel
                ? `Inovasi Daerah - ${categoryLabel}`
                : "Inovasi Daerah"
            }
          />
          <SummaryCards values={summaryValues} />

          <DynamicPage
            className="mt-5"
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
            renderActions={(row) =>
              renderActions({
                row,
                submissionAccess,
                activeCompetitionPeriod,
                deleteId,
                setDeleteId,
                onView: (id) =>
                  router.push(
                    `/innovations/${id}${categoryQuery ? `?${categoryQuery}` : ""}`,
                  ),
                onEdit: (id) =>
                  router.push(
                    `/innovations/${id}?mode=edit${categoryQuery ? `&${categoryQuery}` : ""}`,
                  ),
                onIndicators: (id) =>
                  router.push(`/innovations/${id}/indicators`),
                onSubmitTrack: handleSubmitTrack,
                onDelete: handleDelete,
              })
            }
          />
        </div>
      </main>
    </AppSidebarLayout>
  );
}
