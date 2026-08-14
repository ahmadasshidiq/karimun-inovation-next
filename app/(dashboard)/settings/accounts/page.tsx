"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import AccountForm from "./components/account-form";
import {
  columnFormats,
  filterPanel,
  headerToolbar,
  initialFilters,
  ITEMS_PER_PAGE,
  renderActions,
  type UserDto,
  type UserFilters,
  type UserFormValues,
  type UserListResponse,
  type UserOptionDto,
} from "./page.config";

export default function AccountPage() {
  const [data, setData] = useState<UserDto[]>([]);
  const [roles, setRoles] = useState<UserOptionDto[]>([]);
  const [institutions, setInstitutions] = useState<UserOptionDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [detailItem, setDetailItem] = useState<UserDto>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(true);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total],
  );
  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter((value) => value !== "all").length +
      (searchTerm.trim() ? 1 : 0),
    [filters, searchTerm],
  );

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.roleId !== "all") params.set("roleId", filters.roleId);

      const response = await fetch(`/api/users?${params.toString()}`, {
        cache: "no-store",
      });
      const payload = await parseApiResponse<UserListResponse>(
        response,
        "Gagal mengambil data akun",
      );
      setData(
        Array.isArray(payload.data)
          ? payload.data.map((user, index) => ({
              ...user,
              number: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
            }))
          : [],
      );
      setTotal(Number(payload.total) || 0);
      setRoles(Array.isArray(payload.options?.roles) ? payload.options.roles : []);
      setInstitutions(
        Array.isArray(payload.options?.institutions)
          ? payload.options.institutions
          : [],
      );
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data akun",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, filters]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setCurrentPage(1);
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    // Filter selalu kembali ke halaman pertama.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    // Fetch berjalan setelah pagination, pencarian, atau filter berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = useCallback(() => {
    setDetailItem(undefined);
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((user: UserDto) => {
    setDetailItem(user);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (saving) return;
    setShowModal(false);
    setDetailItem(undefined);
  }, [saving]);

  const handleSave = useCallback(
    async (values: UserFormValues) => {
      try {
        setSaving(true);
        const response = await fetch(
          detailItem ? `/api/users/${detailItem.id}` : "/api/users",
          {
            method: detailItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          },
        );
        await parseApiResponse(response, "Gagal menyimpan akun");

        toast.add({
          type: "success",
          title: detailItem
            ? "Akun berhasil diperbarui"
            : "Akun berhasil ditambahkan",
        });
        setShowModal(false);
        setDetailItem(undefined);

        if (!detailItem && currentPage !== 1) {
          setCurrentPage(1);
        } else {
          await fetchUsers();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error ? error.message : "Gagal menyimpan akun",
        });
      } finally {
        setSaving(false);
      }
    },
    [currentPage, detailItem, fetchUsers],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
        await parseApiResponse(response, "Gagal menghapus akun");
        toast.add({ type: "success", title: "Akun berhasil dihapus" });
        setDeleteId(null);

        if (data.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        } else {
          await fetchUsers();
        }
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error ? error.message : "Gagal menghapus akun",
        });
      }
    },
    [currentPage, data.length, fetchUsers],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilters(initialFilters);
  }, []);

  const setFilter = useCallback(
    (key: keyof UserFilters, value: string) => {
      setFilters((current) => ({ ...current, [key]: value }));
      setCurrentPage(1);
    },
    [],
  );

  const handleExport = useCallback(() => {
    const escapeCell = (value: unknown) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = data.map((user) => [
      user.fullname,
      user.username,
      user.email || "",
      user.role?.name || "",
      user.institution?.name || "",
      user.status === "ACTIVE" ? "Aktif" : "Tidak Aktif",
    ]);
    const csv = [
      ["Nama Lengkap", "Username", "Email", "Role", "Instansi", "Status"],
      ...rows,
    ]
      .map((row) => row.map(escapeCell).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "data-akun.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const toolbar = useMemo(
    () =>
      headerToolbar({
        onAdd: handleOpenAdd,
        onExport: handleExport,
        setShowFilter: setShowFilterPanel,
        activeFilterCount,
      }),
    [activeFilterCount, handleExport, handleOpenAdd],
  );

  const filtersUi = useMemo(
    () =>
      showFilterPanel
        ? filterPanel({
            searchTerm,
            setSearchTerm,
            filters,
            setFilter,
            roles,
            clearFilters,
          })
        : null,
    [clearFilters, filters, roles, searchTerm, setFilter, showFilterPanel],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title="Akun"
            description="Kelola akun pengguna, role, instansi, dan status akses."
          />

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
              emptyMessage="Belum ada data akun."
              onPageChange={setCurrentPage}
              getRowId={(row) => row.id}
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

      <AccountForm
        key={detailItem?.id ?? "new-account"}
        open={showModal}
        initialData={detailItem}
        roles={roles}
        institutions={institutions}
        saving={saving}
        onClose={handleCloseModal}
        onSubmit={handleSave}
      />
    </AppSidebarLayout>
  );
}
