"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import {
  columnFormats,
  filterPanel,
  headerToolbar,
  initialFilters,
  ITEMS_PER_PAGE,
  renderActions,
  type LeaderboardDto,
  type LeaderboardFilters,
  type LeaderboardListResponse,
  type LeaderboardPeriodDto,
} from "./page.config";

export default function LeaderboardPage() {
  const router = useRouter();
  const [data, setData] = useState<LeaderboardDto[]>([]);
  const [period, setPeriod] = useState<LeaderboardPeriodDto | null>(null);
  const [periods, setPeriods] = useState<LeaderboardPeriodDto[]>([]);
  const [draftFilters, setDraftFilters] =
    useState<LeaderboardFilters>(initialFilters);
  const [filters, setFilters] = useState<LeaderboardFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilterPanel, setShowFilterPanel] = useState(true);

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

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value);
      });

      const response = await fetch(
        `/api/innovation-competitions/leaderboard?${params.toString()}`,
        { cache: "no-store" },
      );
      const payload = await parseApiResponse<LeaderboardListResponse>(
        response,
        "Gagal mengambil papan peringkat",
      );
      setData(Array.isArray(payload.data) ? payload.data : []);
      setTotal(Number(payload.total) || 0);
      setPeriod(payload.period ?? null);
      setPeriods(
        Array.isArray(payload.options?.periods) ? payload.options.periods : [],
      );
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error
            ? error.message
            : "Gagal mengambil papan peringkat",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    // Fetch berjalan setelah pagination atau filter yang diterapkan berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchLeaderboard();
  }, [fetchLeaderboard]);

  const setFilter = useCallback(
    (key: keyof LeaderboardFilters, value: string) => {
      setDraftFilters((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const applyFilters = useCallback(() => {
    setFilters(draftFilters);
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
        onToggleFilter: () => setShowFilterPanel((current) => !current),
        activeFilterCount,
      }),
    [activeFilterCount],
  );

  const filtersUi = useMemo(
    () =>
      showFilterPanel
        ? filterPanel({
            filters: draftFilters,
            periods,
            setFilter,
            applyFilters,
            clearFilters,
          })
        : null,
    [
      applyFilters,
      clearFilters,
      draftFilters,
      periods,
      setFilter,
      showFilterPanel,
    ],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title="Papan Peringkat"
            description={
              period
                ? `Peringkat inovasi yang diterima pada ${period.name}.`
                : "Belum ada periode lomba."
            }
          />

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
            emptyMessage="Belum ada inovasi yang diterima pada periode ini."
            onPageChange={setCurrentPage}
            getRowId={(row) => row.id}
            renderActions={(row) =>
              renderActions({
                row,
                onView: (innovationId) =>
                  router.push(`/innovations/${innovationId}`),
              })
            }
          />
        </div>
      </main>
    </AppSidebarLayout>
  );
}
