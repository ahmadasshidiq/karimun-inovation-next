"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import SubmissionVerificationDialog, {
  type VerificationValues,
} from "@/components/submission-verification-dialog";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import {
  columnFormats,
  filterPanel,
  headerToolbar,
  initialFilters,
  ITEMS_PER_PAGE,
  renderActions,
  type CompetitionPeriodOptionDto,
  type CompetitionSubmissionDto,
  type CompetitionSubmissionFilters,
  type CompetitionSubmissionListResponse,
} from "./page.config";

export default function CompetitionInnovationsPage() {
  const router = useRouter();
  const [data, setData] = useState<CompetitionSubmissionDto[]>([]);
  const [periods, setPeriods] = useState<CompetitionPeriodOptionDto[]>([]);
  const [draftFilters, setDraftFilters] =
    useState<CompetitionSubmissionFilters>(initialFilters);
  const [filters, setFilters] =
    useState<CompetitionSubmissionFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [verifyItem, setVerifyItem] = useState<CompetitionSubmissionDto>();
  const [saving, setSaving] = useState(false);
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

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        track: "COMPETITION",
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value);
      });

      const response = await fetch(
        `/api/innovation-submissions?${params.toString()}`,
        { cache: "no-store" },
      );
      const payload = await parseApiResponse<CompetitionSubmissionListResponse>(
        response,
        "Gagal mengambil data Lomba Inovasi",
      );
      setData(Array.isArray(payload.data) ? payload.data : []);
      setTotal(Number(payload.total) || 0);
      setPeriods(
        Array.isArray(payload.options?.periods) ? payload.options.periods : [],
      );
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data Lomba Inovasi",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    // Fetch berjalan setelah pagination atau filter yang diterapkan berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSubmissions();
  }, [fetchSubmissions]);

  const handleCancel = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/innovation-submissions/${id}`, {
          method: "DELETE",
        });
        await parseApiResponse(response, "Gagal membatalkan pengajuan");
        toast.add({ type: "success", title: "Pengajuan berhasil dibatalkan" });
        setCancelId(null);
        await fetchSubmissions();
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal membatalkan pengajuan",
        });
      }
    },
    [fetchSubmissions],
  );

  const handleCloseVerify = useCallback(() => {
    if (saving) return;
    setVerifyItem(undefined);
  }, [saving]);

  const handleVerify = useCallback(
    async (values: VerificationValues) => {
      if (!verifyItem) return;
      try {
        setSaving(true);
        const response = await fetch(
          `/api/innovation-submissions/${verifyItem.id}/verification`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          },
        );
        const payload = await parseApiResponse(
          response,
          "Gagal menyimpan verifikasi",
        );
        toast.add({
          type: "success",
          title: payload.message || "Verifikasi berhasil disimpan",
        });
        setVerifyItem(undefined);
        await fetchSubmissions();
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal menyimpan verifikasi",
        });
      } finally {
        setSaving(false);
      }
    },
    [fetchSubmissions, verifyItem],
  );

  const setFilter = useCallback(
    (key: keyof CompetitionSubmissionFilters, value: string) => {
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
            title="Lomba Inovasi Perangkat Daerah"
            description="Daftar inovasi yang diajukan pada Lomba Inovasi."
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
            emptyMessage="Belum ada inovasi yang diajukan pada Lomba Inovasi."
            onPageChange={setCurrentPage}
            getRowId={(row) => row.id}
            renderActions={(row) =>
              renderActions({
                row,
                cancelId,
                setCancelId,
                onView: (innovationId) =>
                  router.push(`/innovations/${innovationId}`),
                onVerify: setVerifyItem,
                onCancel: handleCancel,
              })
            }
          />
        </div>
      </main>

      {verifyItem ? (
        <SubmissionVerificationDialog
          open
          innovationName={verifyItem.innovationName}
          saving={saving}
          onClose={handleCloseVerify}
          onSubmit={handleVerify}
        />
      ) : null}
    </AppSidebarLayout>
  );
}
