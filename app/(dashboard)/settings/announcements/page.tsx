"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import FormData from "./components/form-data";
import {
  columnFormats,
  filterPanel,
  headerToolbar,
  initialFilters,
  ITEMS_PER_PAGE,
  renderActions,
  type AnnouncementDto,
  type AnnouncementFilters,
  type AnnouncementFormValues,
  type AnnouncementListResponse,
} from "./page.config";

export default function AnnouncementsPage() {
  const [data, setData] = useState<AnnouncementDto[]>([]);
  const [draftFilters, setDraftFilters] =
    useState<AnnouncementFilters>(initialFilters);
  const [filters, setFilters] = useState<AnnouncementFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [detailItem, setDetailItem] = useState<AnnouncementDto>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
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

  const fetchAnnouncements = useCallback(async () => {
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
        `/api/announcements?${params.toString()}`,
        { cache: "no-store" },
      );
      const payload = await parseApiResponse<AnnouncementListResponse>(
        response,
        "Gagal mengambil data pengumuman",
      );
      setData(
        Array.isArray(payload.data)
          ? payload.data.map((item, index) => ({
              ...item,
              number: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
            }))
          : [],
      );
      setTotal(Number(payload.total) || 0);
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data pengumuman",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    // Fetch berjalan setelah pagination atau filter yang diterapkan berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleOpenAdd = useCallback(() => {
    setDetailItem(undefined);
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((announcement: AnnouncementDto) => {
    setDetailItem(announcement);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (saving) return;
    setShowModal(false);
    setDetailItem(undefined);
  }, [saving]);

  const handleSave = useCallback(
    async (values: AnnouncementFormValues) => {
      try {
        setSaving(true);
        const response = await fetch(
          detailItem
            ? `/api/announcements/${detailItem.id}`
            : "/api/announcements",
          {
            method: detailItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          },
        );
        await parseApiResponse(response, "Gagal menyimpan pengumuman");

        toast.add({
          type: "success",
          title: detailItem
            ? "Pengumuman berhasil diperbarui"
            : "Pengumuman berhasil ditambahkan",
        });
        setShowModal(false);
        setDetailItem(undefined);

        if (!detailItem && currentPage !== 1) {
          setCurrentPage(1);
        } else {
          await fetchAnnouncements();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal menyimpan pengumuman",
        });
      } finally {
        setSaving(false);
      }
    },
    [currentPage, detailItem, fetchAnnouncements],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/announcements/${id}`, {
          method: "DELETE",
        });
        await parseApiResponse(response, "Gagal menghapus pengumuman");
        toast.add({ type: "success", title: "Pengumuman berhasil dihapus" });
        setDeleteId(null);

        if (data.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        } else {
          await fetchAnnouncements();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal menghapus pengumuman",
        });
      }
    },
    [currentPage, data.length, fetchAnnouncements],
  );

  const setFilter = useCallback(
    (key: keyof AnnouncementFilters, value: string) => {
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
        onAdd: handleOpenAdd,
        onToggleFilter: () => setShowFilterPanel((current) => !current),
        activeFilterCount,
      }),
    [activeFilterCount, handleOpenAdd],
  );

  const filtersUi = useMemo(
    () =>
      showFilterPanel
        ? filterPanel({
            filters: draftFilters,
            setFilter,
            applyFilters,
            clearFilters,
          })
        : null,
    [applyFilters, clearFilters, draftFilters, setFilter, showFilterPanel],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title="Pengumuman"
            description="Kelola pengumuman yang ditampilkan pada dashboard."
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
            emptyMessage="Belum ada data pengumuman."
            onPageChange={setCurrentPage}
            getRowId={(row) => row.id}
            renderActions={(row) =>
              renderActions({
                row,
                deleteId,
                setDeleteId,
                onEdit: handleOpenEdit,
                onDelete: handleDelete,
              })
            }
          />
        </div>
      </main>

      {showModal ? (
        <FormData
          open
          initialData={detailItem}
          saving={saving}
          onClose={handleCloseModal}
          onSubmit={handleSave}
        />
      ) : null}
    </AppSidebarLayout>
  );
}
