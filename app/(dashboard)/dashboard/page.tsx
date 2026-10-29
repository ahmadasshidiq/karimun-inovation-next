"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AppSidebarLayout } from "@/components/app-sidebar";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import AssessedInnovationPreview from "./components/assessed-innovation-preview";
import DashboardContent from "./components/dashboard-content";
import {
  initialDashboardSummary,
  initialInnovationFilters,
  initialInnovationOptions,
  INNOVATION_ITEMS_PER_PAGE,
  innovationFilterPanel,
  innovationToolbar,
  type DashboardInnovationDto,
  type DashboardInnovationFilters,
  type DashboardInnovationListResponse,
  type DashboardInnovationOptions,
  type DashboardStatisticsResponse,
  type InnovationIndexPoint,
  type InnovationYearPoint,
  type AnnouncementItem,
  type CountdownValue,
  type DashboardSummary,
} from "./page.config";

const calculateCountdown = (target: number, active: boolean): CountdownValue => {
  const difference = active ? Math.max(0, target - Date.now()) : 0;
  const days = Math.floor(difference / 86_400_000);
  const hours = Math.floor((difference / 3_600_000) % 24);
  const minutes = Math.floor((difference / 60_000) % 60);
  const seconds = Math.floor((difference / 1_000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
};

export default function DashboardPage() {
  const [countdown, setCountdown] = useState<CountdownValue>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [summary, setSummary] = useState<DashboardSummary>(initialDashboardSummary);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [countdownTarget, setCountdownTarget] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);
  const [innovationIndex, setInnovationIndex] = useState<InnovationIndexPoint[]>(
    [],
  );
  const [innovationsPerYear, setInnovationsPerYear] = useState<
    InnovationYearPoint[]
  >([]);
  const [data, setData] = useState<DashboardInnovationDto[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [draftFilters, setDraftFilters] = useState<DashboardInnovationFilters>(
    initialInnovationFilters,
  );
  const [filters, setFilters] = useState<DashboardInnovationFilters>(
    initialInnovationFilters,
  );
  const [options, setOptions] = useState<DashboardInnovationOptions>(
    initialInnovationOptions,
  );
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [previewItem, setPreviewItem] = useState<DashboardInnovationDto>();
  const [canOpenDetail, setCanOpenDetail] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / INNOVATION_ITEMS_PER_PAGE)),
    [total],
  );

  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter((value) => value && value !== "all").length,
    [filters],
  );

  const fetchDashboardData = useCallback(async () => {
    try {
      const [announcementResponse, configurationResponse, statisticsResponse] =
        await Promise.all([
          fetch("/api/announcements?dashboard=true", { cache: "no-store" }),
          fetch("/api/dashboard-configuration", { cache: "no-store" }),
          fetch("/api/dashboard/statistics", { cache: "no-store" }),
        ]);

      const statisticsPayload =
        await parseApiResponse<DashboardStatisticsResponse>(
          statisticsResponse,
          "Gagal mengambil data dashboard",
        );
      setSummary({
        ...initialDashboardSummary,
        ...statisticsPayload.data?.summary,
      });
      setInnovationIndex(statisticsPayload.data?.innovationIndex ?? []);
      setInnovationsPerYear(statisticsPayload.data?.innovationsPerYear ?? []);
      if (announcementResponse.ok) {
        const announcementPayload = await announcementResponse.json();
        setAnnouncements(Array.isArray(announcementPayload.data) ? announcementPayload.data : []);
      }
      if (configurationResponse.ok) {
        const configurationPayload = await configurationResponse.json();
        const target = new Date(configurationPayload.data?.countdownTarget || "").getTime();
        setCountdownTarget(Number.isFinite(target) ? target : 0);
        setCountdownActive(Boolean(configurationPayload.data?.countdownActive));
      }
    } catch (error) {
      toast.add({
        title: "Gagal memuat dashboard",
        description:
          error instanceof Error ? error.message : "Silakan coba kembali.",
        type: "error",
      });
    }
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setCountdown(calculateCountdown(countdownTarget, countdownActive));
    });

    const interval = window.setInterval(() => {
      setCountdown(calculateCountdown(countdownTarget, countdownActive));
    }, 1_000);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearInterval(interval);
    };
  }, [countdownActive, countdownTarget]);

  const fetchInnovations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(INNOVATION_ITEMS_PER_PAGE),
      });
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value);
      });

      const response = await fetch(
        `/api/dashboard/innovations?${params.toString()}`,
        { cache: "no-store" },
      );
      const payload = await parseApiResponse<DashboardInnovationListResponse>(
        response,
        "Gagal mengambil data inovasi",
      );
      setData(Array.isArray(payload.data) ? payload.data : []);
      setTotal(Number(payload.total) || 0);
      setOptions({ ...initialInnovationOptions, ...payload.options });
      setCanOpenDetail(Boolean(payload.canOpenDetail));
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error ? error.message : "Gagal mengambil data inovasi",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    // Fetch berjalan setelah pagination atau filter yang diterapkan berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchInnovations();
  }, [fetchInnovations]);

  const setFilter = useCallback(
    (key: keyof DashboardInnovationFilters, value: string) => {
      setDraftFilters((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const applyFilters = useCallback(() => {
    setFilters({ ...draftFilters, search: draftFilters.search.trim() });
    setCurrentPage(1);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    setDraftFilters(initialInnovationFilters);
    setFilters(initialInnovationFilters);
    setCurrentPage(1);
  }, []);

  const toolbar = useMemo(
    () =>
      innovationToolbar({
        onToggleFilter: () => setShowFilterPanel((current) => !current),
        activeFilterCount,
      }),
    [activeFilterCount],
  );

  const filtersUi = useMemo(
    () =>
      showFilterPanel
        ? innovationFilterPanel({
            filters: draftFilters,
            setFilter,
            applyFilters,
            clearFilters,
            options,
          })
        : null,
    [applyFilters, clearFilters, draftFilters, options, setFilter, showFilterPanel],
  );

  useEffect(() => {
    // Fetch berjalan saat halaman dashboard dimuat.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <AppSidebarLayout>
      <DashboardContent
        countdown={countdown}
        summary={summary}
        announcements={announcements}
        countdownActive={countdownActive}
        innovationIndex={innovationIndex}
        innovationsPerYear={innovationsPerYear}
        innovations={{
          items: data,
          total,
          currentPage,
          totalPages,
          loading,
          onPageChange: setCurrentPage,
          onPreview: setPreviewItem,
          toolbar,
          filterPanel: filtersUi,
        }}
      />

      {previewItem ? (
        <AssessedInnovationPreview
          innovation={previewItem}
          canOpenDetail={canOpenDetail}
          onClose={() => setPreviewItem(undefined)}
        />
      ) : null}
    </AppSidebarLayout>
  );
}
