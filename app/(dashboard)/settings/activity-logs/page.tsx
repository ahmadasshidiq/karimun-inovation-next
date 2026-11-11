"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import { downloadCsv } from "@/lib/helper/csv";
import { parseApiResponse } from "@/lib/helper/response-api";

import LogDetail from "./components/log-detail";
import {
  columnFormats,
  filterPanel,
  formatActionLabel,
  formatDateTimeId,
  headerToolbar,
  initialFilters,
  ITEMS_PER_PAGE,
  renderActions,
  type ActivityLogDto,
  type ActivityLogFilters,
  type ActivityLogListResponse,
  type ActivityLogOptionDto,
} from "./page.config";

export default function ActivityLogPage() {
  const [data, setData] = useState<ActivityLogDto[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [entities, setEntities] = useState<string[]>([]);
  const [users, setUsers] = useState<ActivityLogOptionDto[]>([]);
  const [canExport, setCanExport] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<ActivityLogFilters>(initialFilters);
  const [filters, setFilters] = useState<ActivityLogFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [detailItem, setDetailItem] = useState<ActivityLogDto>();
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

  const fetchActivityLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value);
      });

      const response = await fetch(`/api/audit-logs?${params.toString()}`, {
        cache: "no-store",
      });
      const payload = await parseApiResponse<ActivityLogListResponse>(
        response,
        "Gagal mengambil data log aktivitas",
      );
      setData(
        Array.isArray(payload.data)
          ? payload.data.map((log, index) => ({
              ...log,
              number: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
            }))
          : [],
      );
      setTotal(Number(payload.total) || 0);
      setCanExport(payload.canExport === true);
      setActions(
        Array.isArray(payload.options?.actions) ? payload.options.actions : [],
      );
      setEntities(
        Array.isArray(payload.options?.entities)
          ? payload.options.entities
          : [],
      );
      setUsers(Array.isArray(payload.options?.users) ? payload.options.users : []);
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data log aktivitas",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    // Fetch berjalan setelah pagination atau filter yang diterapkan berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchActivityLogs();
  }, [fetchActivityLogs]);

  const handleOpenDetail = useCallback((log: ActivityLogDto) => {
    setDetailItem(log);
  }, []);

  const handleCloseModal = useCallback(() => {
    setDetailItem(undefined);
  }, []);

  const setFilter = useCallback(
    (key: keyof ActivityLogFilters, value: string) => {
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

  const handleExport = useCallback(() => {
    downloadCsv(
      "log-aktivitas.csv",
      [
        "Waktu",
        "Pengguna",
        "Username",
        "Aktivitas",
        "Modul",
        "ID Data",
        "Alamat IP",
        "Perangkat",
      ],
      data.map((log) => [
        formatDateTimeId(log.createdAt),
        log.user?.fullname,
        log.user?.username,
        formatActionLabel(log.action),
        log.entity,
        log.entityId,
        log.ipAddress,
        log.userAgent,
      ]),
    );
  }, [data]);

  const toolbar = useMemo(
    () =>
      headerToolbar({
        onExport: canExport ? handleExport : undefined,
        onToggleFilter: () => setShowFilterPanel((current) => !current),
        activeFilterCount,
      }),
    [activeFilterCount, canExport, handleExport],
  );

  const filtersUi = useMemo(
    () =>
      showFilterPanel
        ? filterPanel({
            filters: draftFilters,
            setFilter,
            applyFilters,
            clearFilters,
            actions,
            entities,
            users,
          })
        : null,
    [
      actions,
      applyFilters,
      clearFilters,
      draftFilters,
      entities,
      setFilter,
      showFilterPanel,
      users,
    ],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title="Log Aktivitas"
            description="Pantau seluruh aktivitas pengguna, login, dan perubahan data sistem."
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
            emptyMessage="Belum ada data log aktivitas."
            onPageChange={setCurrentPage}
            getRowId={(row) => row.id}
            renderActions={(row) =>
              renderActions({
                row,
                onView: handleOpenDetail,
              })
            }
          />
        </div>
      </main>

      {detailItem ? (
        <LogDetail open log={detailItem} onClose={handleCloseModal} />
      ) : null}
    </AppSidebarLayout>
  );
}
