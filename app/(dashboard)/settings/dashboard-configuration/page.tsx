"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import FormData from "./components/form-data";
import InnovationIndexForm from "./components/innovation-index-form";
import {
  columnFormats,
  headerToolbar,
  initialConfiguration,
  ITEMS_PER_PAGE,
  renderActions,
  type DashboardConfigurationResponse,
  type InnovationIndexDto,
  type InnovationIndexFormValues,
  type InnovationIndexListResponse,
} from "./page.config";

const toLocalInput = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export default function DashboardConfigurationPage() {
  const [configuration, setConfiguration] = useState(initialConfiguration);
  const [savingConfiguration, setSavingConfiguration] = useState(false);
  const [data, setData] = useState<InnovationIndexDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [detailItem, setDetailItem] = useState<InnovationIndexDto>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total],
  );

  const fetchConfiguration = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard-configuration", {
        cache: "no-store",
      });
      const payload = await parseApiResponse<DashboardConfigurationResponse>(
        response,
        "Gagal mengambil konfigurasi",
      );
      if (payload.data) {
        setConfiguration({
          ...payload.data,
          countdownTarget: toLocalInput(payload.data.countdownTarget),
        });
      }
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error ? error.message : "Gagal mengambil konfigurasi",
      });
    }
  }, []);

  const fetchIndices = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      const response = await fetch(
        `/api/innovation-indices?${params.toString()}`,
        { cache: "no-store" },
      );
      const payload = await parseApiResponse<InnovationIndexListResponse>(
        response,
        "Gagal mengambil nilai indeks",
      );
      setData(Array.isArray(payload.data) ? payload.data : []);
      setTotal(Number(payload.total) || 0);
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error ? error.message : "Gagal mengambil nilai indeks",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    // Fetch konfigurasi berjalan saat halaman dimuat.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfiguration();
  }, [fetchConfiguration]);

  useEffect(() => {
    // Fetch berjalan setelah pagination berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchIndices();
  }, [fetchIndices]);

  const handleSaveConfiguration = useCallback(async () => {
    try {
      setSavingConfiguration(true);
      const response = await fetch("/api/dashboard-configuration", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...configuration,
          countdownTarget: new Date(configuration.countdownTarget).toISOString(),
        }),
      });
      await parseApiResponse(response, "Gagal menyimpan konfigurasi");
      toast.add({ type: "success", title: "Konfigurasi berhasil disimpan" });
      await fetchConfiguration();
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error ? error.message : "Gagal menyimpan konfigurasi",
      });
    } finally {
      setSavingConfiguration(false);
    }
  }, [configuration, fetchConfiguration]);

  const handleOpenAdd = useCallback(() => {
    setDetailItem(undefined);
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((index: InnovationIndexDto) => {
    setDetailItem(index);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (saving) return;
    setShowModal(false);
    setDetailItem(undefined);
  }, [saving]);

  const handleSave = useCallback(
    async (values: InnovationIndexFormValues) => {
      try {
        setSaving(true);
        const response = await fetch(
          detailItem
            ? `/api/innovation-indices/${detailItem.id}`
            : "/api/innovation-indices",
          {
            method: detailItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              year: Number(values.year),
              score: Number(values.score),
              predicate: values.predicate,
            }),
          },
        );
        await parseApiResponse(response, "Gagal menyimpan nilai indeks");

        toast.add({
          type: "success",
          title: detailItem
            ? "Nilai indeks berhasil diperbarui"
            : "Nilai indeks berhasil ditambahkan",
        });
        setShowModal(false);
        setDetailItem(undefined);

        if (!detailItem && currentPage !== 1) {
          setCurrentPage(1);
        } else {
          await fetchIndices();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal menyimpan nilai indeks",
        });
      } finally {
        setSaving(false);
      }
    },
    [currentPage, detailItem, fetchIndices],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/innovation-indices/${id}`, {
          method: "DELETE",
        });
        await parseApiResponse(response, "Gagal menghapus nilai indeks");
        toast.add({ type: "success", title: "Nilai indeks berhasil dihapus" });
        setDeleteId(null);

        if (data.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        } else {
          await fetchIndices();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal menghapus nilai indeks",
        });
      }
    },
    [currentPage, data.length, fetchIndices],
  );

  const toolbar = useMemo(
    () => headerToolbar({ onAdd: handleOpenAdd }),
    [handleOpenAdd],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title="Konfigurasi Dashboard"
            description="Atur hitungan mundur dan nilai Indeks Inovasi Daerah yang tampil di dashboard."
          />

          <div className="mt-5 text-slate-900 [&_button]:text-slate-900 [&_input]:border-neutral-200 [&_input]:bg-white [&_input]:text-slate-900 [&_label]:text-slate-700">
            <FormData
              value={configuration}
              saving={savingConfiguration}
              onChange={setConfiguration}
              onSubmit={handleSaveConfiguration}
            />
          </div>

          <DynamicPage
            className="mt-5"
            toolbar={toolbar}
            columns={columnFormats}
            items={data}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            emptyMessage="Belum ada nilai indeks."
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
        <InnovationIndexForm
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
