"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import RoleForm from "./components/role-form";
import {
  columnFormats,
  headerToolbar,
  ITEMS_PER_PAGE,
  renderActions,
  type RoleDto,
  type RoleFormValues,
  type RoleListResponse,
} from "./page.config";

export default function RolesPage() {
  const [data, setData] = useState<RoleDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [detailItem, setDetailItem] = useState<RoleDto>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total],
  );

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });

      if (debouncedSearchTerm) {
        params.set("search", debouncedSearchTerm);
      }

      const response = await fetch(`/api/roles?${params.toString()}`, {
        cache: "no-store",
      });

      const payload = await parseApiResponse<RoleListResponse>(
        response,
        "Gagal mengambil data role",
      );
      setData(Array.isArray(payload.data) ? payload.data : []);
      setTotal(Number(payload.total) || 0);
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error ? error.message : "Gagal mengambil data role",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setCurrentPage(1);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    // Fetch berjalan setelah dependency pagination atau pencarian berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRoles();
  }, [fetchRoles]);

  const handleOpenAdd = useCallback(() => {
    setDetailItem(undefined);
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((role: RoleDto) => {
    setDetailItem(role);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (saving) return;

    setShowModal(false);
    setDetailItem(undefined);
  }, [saving]);

  const handleSave = useCallback(
    async (values: RoleFormValues) => {
      try {
        setSaving(true);

        const response = await fetch(
          detailItem ? `/api/roles/${detailItem.id}` : "/api/roles",
          {
            method: detailItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          },
        );

        await parseApiResponse(response, "Gagal menyimpan data role");

        toast.add({
          type: "success",
          title: detailItem
            ? "Role berhasil diperbarui"
            : "Role berhasil ditambahkan",
        });

        setShowModal(false);
        setDetailItem(undefined);

        if (!detailItem && currentPage !== 1) {
          setCurrentPage(1);
        } else {
          await fetchRoles();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal menyimpan data role",
        });
      } finally {
        setSaving(false);
      }
    },
    [currentPage, detailItem, fetchRoles],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/roles/${id}`, {
          method: "DELETE",
        });

        await parseApiResponse(response, "Gagal menghapus data role");

        toast.add({ type: "success", title: "Role berhasil dihapus" });
        setDeleteId(null);

        if (data.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        } else {
          await fetchRoles();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal menghapus data role",
        });
      }
    },
    [currentPage, data.length, fetchRoles],
  );

  const toolbar = useMemo(
    () =>
      headerToolbar({
        onAdd: handleOpenAdd,
        searchTerm,
        setSearchTerm,
      }),
    [handleOpenAdd, searchTerm],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title="Role"
            description="Kelola role dan hak akses pengguna."
          />

          <div className="mt-5 [&>div]:!bg-white [&>div]:!text-slate-700 [&_table]:!text-slate-700 [&_thead]:!border-slate-200 [&_tr]:!border-slate-200 [&_th]:!border-slate-100 [&_th]:!text-slate-700 [&_td]:!border-slate-200 [&_td]:!text-slate-700 [&_p]:!text-slate-600 [&_p_span]:!text-slate-900">
            <DynamicPage
              className="border! border-neutral-200! shadow-none! ring-0! backdrop-blur-none! dark:bg-white"
              toolbar={toolbar}
              columns={columnFormats}
              items={data}
              total={total}
              currentPage={currentPage}
              totalPages={totalPages}
              loading={loading}
              emptyMessage="Belum ada data role."
              onPageChange={setCurrentPage}
              renderActions={(row) =>
                renderActions({
                  row,
                  onEdit: handleOpenEdit,
                  onDelete: handleDelete,
                  deleteId,
                  setDeleteId,
                })
              }
            />
          </div>
        </div>
      </main>

      <RoleForm
        key={detailItem?.id ?? "new-role"}
        open={showModal}
        initialData={detailItem}
        saving={saving}
        onClose={handleCloseModal}
        onSubmit={handleSave}
      />
    </AppSidebarLayout>
  );
}
