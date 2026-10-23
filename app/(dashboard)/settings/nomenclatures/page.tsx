"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import { downloadCsv } from "@/lib/helper/csv";
import { parseApiResponse } from "@/lib/helper/response-api";

import FormData from "./components/form-data";
import {
  columnFormats,
  filterPanel,
  headerToolbar,
  initialFilters,
  ITEMS_PER_PAGE,
  renderActions,
  type NomenclatureDto,
  type NomenclatureFilters,
  type NomenclatureFormValues,
  type NomenclatureListResponse,
} from "./page.config";

export default function NomenclaturesPage() {
  const router = useRouter();
  const [data, setData] = useState<NomenclatureDto[]>([]);
  const [draftFilters, setDraftFilters] =
    useState<NomenclatureFilters>(initialFilters);
  const [filters, setFilters] = useState<NomenclatureFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [detailItem, setDetailItem] = useState<NomenclatureDto>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(true);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total],
  );
  const activeFilterCount = filters.search ? 1 : 0;

  const fetchNomenclatures = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      if (filters.search) params.set("search", filters.search);

      const response = await fetch(
        `/api/nomenclatures?${params.toString()}`,
        { cache: "no-store" },
      );
      const payload = await parseApiResponse<NomenclatureListResponse>(
        response,
        "Gagal mengambil data nomenklatur",
      );
      setData(Array.isArray(payload.data) ? payload.data : []);
      setTotal(Number(payload.total) || 0);
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data nomenklatur",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    // Fetch berjalan setelah pagination atau filter yang diterapkan berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNomenclatures();
  }, [fetchNomenclatures]);

  const handleOpenAdd = useCallback(() => {
    setDetailItem(undefined);
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((nomenclature: NomenclatureDto) => {
    setDetailItem(nomenclature);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (saving) return;
    setShowModal(false);
    setDetailItem(undefined);
  }, [saving]);

  const handleSave = useCallback(
    async (values: NomenclatureFormValues) => {
      try {
        setSaving(true);
        const response = await fetch(
          detailItem
            ? `/api/nomenclatures/${detailItem.id}`
            : "/api/nomenclatures",
          {
            method: detailItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          },
        );
        await parseApiResponse(response, "Gagal menyimpan nomenklatur");

        toast.add({
          type: "success",
          title: detailItem
            ? "Nomenklatur berhasil diperbarui"
            : "Nomenklatur berhasil ditambahkan",
        });
        setShowModal(false);
        setDetailItem(undefined);

        if (!detailItem && currentPage !== 1) {
          setCurrentPage(1);
        } else {
          await fetchNomenclatures();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal menyimpan nomenklatur",
        });
      } finally {
        setSaving(false);
      }
    },
    [currentPage, detailItem, fetchNomenclatures],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/nomenclatures/${id}`, {
          method: "DELETE",
        });
        await parseApiResponse(response, "Gagal menghapus nomenklatur");
        toast.add({ type: "success", title: "Nomenklatur berhasil dihapus" });
        setDeleteId(null);

        if (data.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        } else {
          await fetchNomenclatures();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal menghapus nomenklatur",
        });
      }
    },
    [currentPage, data.length, fetchNomenclatures],
  );

  const setFilter = useCallback(
    (key: keyof NomenclatureFilters, value: string) => {
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
      "data-nomenklatur.csv",
      ["Nama Nomenklatur", "Deskripsi", "Jumlah Instansi"],
      data.map((item) => [
        item.name,
        item.description,
        item._count?.institutions || 0,
      ]),
    );
  }, [data]);

  const toolbar = useMemo(
    () =>
      headerToolbar({
        onAdd: handleOpenAdd,
        onExport: handleExport,
        onToggleFilter: () => setShowFilterPanel((current) => !current),
        activeFilterCount,
      }),
    [activeFilterCount, handleExport, handleOpenAdd],
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
            title="Nomenklatur"
            description="Kelola nomenklatur yang digunakan pada data instansi."
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
            emptyMessage="Belum ada data nomenklatur."
            onPageChange={setCurrentPage}
            getRowId={(row) => row.id}
            renderActions={(row) =>
              renderActions({
                row,
                deleteId,
                setDeleteId,
                onView: (id) => router.push(`/settings/nomenclatures/${id}`),
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
