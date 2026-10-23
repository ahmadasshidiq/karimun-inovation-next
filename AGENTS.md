# AGENT.md

# Page Development Rules

Dokumen ini adalah aturan wajib untuk seluruh development halaman pada project.

Tujuannya agar struktur halaman, kode, integrasi API, dan desain tetap konsisten di semua halaman.

**Halaman acuan:** `app/(dashboard)/settings/accounts/`. Jika ragu, ikuti pola halaman tersebut.

---

# 1. Struktur Folder Wajib

Setiap halaman **WAJIB** memiliki struktur berikut:

```text
[module]/
└── [feature]/
    ├── page.tsx
    ├── page.config.tsx
    └── components/
        └── form-data.tsx
```

Aturan:

* `page.tsx`, `page.config.tsx`, dan `components/` **WAJIB ADA**
* Tidak boleh ada file lain di root folder page
* Component khusus halaman berada di `components/`
* Type, constant, column, toolbar, filter UI, dan action berada di `page.config.tsx`
* State, API request, lifecycle, dan event handler berada di `page.tsx`
* Sub-route (mis. `[id]/`, `create/`) mengikuti struktur yang sama
* Component yang dipakai bersama oleh beberapa sub-route dalam satu module boleh berada di `components/` milik module tersebut (contoh: `innovations/components/innovation-form.tsx`)
* Component yang dipakai lintas module berada di `components/` root project

DILARANG membuat folder/file berikut di dalam folder page:

```text
services/  hooks/  utils/  lib/  types/  constants/  api/  actions/  schemas/  validators/
service.ts  types.ts  constants.ts  utils.ts  api.ts  hooks.ts
page.types.ts  page.constants.ts  page.utils.ts
```

Helper yang hanya dipakai halaman tersebut diletakkan di `page.tsx`, `page.config.tsx`, atau component yang relevan.

---

# 2. Tanggung Jawab Setiap File

## `page.tsx` — orchestrator

* State (data, filter, search, pagination, modal, delete, saving)
* Fetch API, create/update/delete
* Draft & apply filter
* Event handler (`handleXxx`)
* Merakit layout halaman, `DynamicPage`, dan form modal

`page.tsx` tidak boleh berisi definisi column, JSX toolbar, JSX filter, atau JSX action.

## `page.config.tsx` — konfigurasi

* Type DTO, form values, filters, response API
* `ITEMS_PER_PAGE`, `initialFilters`, option list
* `columnFormats`
* `headerToolbar`, `filterPanel`, `renderActions`

Boleh memakai component UI (`Button`, `Input`, `Select`, `Popover`, `Tooltip`, `Badge`, dll.) dan icon `lucide-react`.

## `components/`

Component khusus halaman, umumnya form modal `form-data.tsx`.

---

# 3. Layout Halaman

Semua halaman dashboard memakai susunan berikut:

```tsx
return (
  <AppSidebarLayout>
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
      <div className="mx-auto w-full max-w-[1600px]">
        <AppPageHeader
          title="Akun"
          description="Kelola akun pengguna, role, instansi, dan status akses."
        />

        <DynamicPage
          className="mt-5"
          {/* ...props */}
        />
      </div>
    </main>

    {showModal ? <FormData open {/* ...props */} /> : null}
  </AppSidebarLayout>
);
```

* `DynamicPage` sudah memiliki style final (putih, light-only). **Jangan** menambahkan wrapper atau `className` untuk meng-override warna, border, atau shadow-nya; cukup `className="mt-5"` untuk jarak
* Jika halaman punya konten di atas tabel (mis. `SummaryCards`), letakkan di antara `AppPageHeader` dan `DynamicPage`
* Form modal diletakkan di dalam `AppSidebarLayout`, setelah `</main>`

---

# 4. DynamicPage Wajib Digunakan

Halaman yang menampilkan data tabel **WAJIB** memakai `DynamicPage`:

```tsx
import DynamicPage from "@/components/dynamic-page";
```

```tsx
<DynamicPage
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
      deleteId,
      setDeleteId,
      onEdit: handleOpenEdit,
      onDelete: handleDelete,
    })
  }
/>
```

Jangan membuat table baru jika `DynamicPage` sudah dapat menangani kebutuhan tersebut.

---

# 5. Standar `page.tsx`

## 5.1 Import

```tsx
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
  type UserDto,
  type UserFilters,
  type UserFormValues,
  type UserListResponse,
} from "./page.config";
```

Urutan: React/Next → `@/components` → `@/lib` → import lokal (`./components`, `./page.config`).

## 5.2 State

```tsx
const [data, setData] = useState<UserDto[]>([]);
const [draftFilters, setDraftFilters] = useState<UserFilters>(initialFilters);
const [filters, setFilters] = useState<UserFilters>(initialFilters);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [total, setTotal] = useState(0);
const [showModal, setShowModal] = useState(false);
const [detailItem, setDetailItem] = useState<UserDto>();
const [deleteId, setDeleteId] = useState<string | null>(null);
const [showFilterPanel, setShowFilterPanel] = useState(true);
```

Gunakan state hanya jika dibutuhkan. Jangan membuat state yang tidak dipakai.

## 5.3 Derived value

```tsx
const totalPages = useMemo(
  () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
  [total],
);

const activeFilterCount = useMemo(
  () =>
    Object.values(filters).filter((value) => value && value !== "all").length,
  [filters],
);
```

## 5.4 Fetch

```tsx
const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(ITEMS_PER_PAGE),
    });
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
    });

    const response = await fetch(`/api/users?${params.toString()}`, {
      cache: "no-store",
    });
    const payload = await parseApiResponse<UserListResponse>(
      response,
      "Gagal mengambil data akun",
    );

    setData(Array.isArray(payload.data) ? payload.data : []);
    setTotal(Number(payload.total) || 0);
  } catch (error) {
    toast.add({
      type: "error",
      title: error instanceof Error ? error.message : "Gagal mengambil data akun",
    });
  } finally {
    setLoading(false);
  }
}, [currentPage, filters]);

useEffect(() => {
  // Fetch berjalan setelah pagination atau filter yang diterapkan berubah.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  void fetchUsers();
}, [fetchUsers]);
```

Nama fetch: `fetch` + nama data jamak (`fetchUsers`, `fetchInstitutions`).

## 5.5 Filter & Search (wajib tombol Terapkan)

Semua filter, **termasuk pencarian**, disaring di backend. FE hanya mengirim params; FE **tidak boleh** memfilter data yang sudah diterima dari API.

Perubahan input filter **tidak boleh** langsung memicu request. User mengubah input lalu menekan **Terapkan Filter** (atau Enter). Karena itu tidak dipakai debounce.

Filter berupa satu objek, didefinisikan di `page.config.tsx`. Nama key **harus sama** dengan nama query param di API:

```tsx
export type UserFilters = {
  search: string;
  status: string;
  roleId: string;
};

export const initialFilters: UserFilters = {
  search: "",
  status: "all",
  roleId: "all",
};
```

* Pencarian memakai key `search` dengan default `""`
* Select memakai default `"all"`
* Nilai `""` dan `"all"` tidak dikirim ke API

`page.tsx` menyimpan dua state:

* `draftFilters`: nilai yang sedang diisi di panel (belum dikirim)
* `filters`: nilai yang sudah diterapkan (dipakai `fetchXxx` dan `activeFilterCount`)

```tsx
const setFilter = useCallback((key: keyof UserFilters, value: string) => {
  setDraftFilters((current) => ({ ...current, [key]: value }));
}, []);

const applyFilters = useCallback(() => {
  setFilters({ ...draftFilters, search: draftFilters.search.trim() });
  setCurrentPage(1);
}, [draftFilters]);

const clearFilters = useCallback(() => {
  setDraftFilters(initialFilters);
  setFilters(initialFilters);
  setCurrentPage(1);
}, []);
```

Opsi select yang berasal dari data (role, instansi, inisiator, dll.) dikirim oleh API melalui `options` pada response list, bukan di-hardcode di FE.

## 5.6 Modal

```tsx
const handleOpenAdd = useCallback(() => {
  setDetailItem(undefined);
  setShowModal(true);
}, []);

const handleOpenEdit = useCallback((item: UserDto) => {
  setDetailItem(item);
  setShowModal(true);
}, []);

const handleCloseModal = useCallback(() => {
  if (saving) return;
  setShowModal(false);
  setDetailItem(undefined);
}, [saving]);
```

## 5.7 Save (create/update)

Request create/update dilakukan di `page.tsx`, bukan di form:

```tsx
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
        title: detailItem ? "Akun berhasil diperbarui" : "Akun berhasil ditambahkan",
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
        title: error instanceof Error ? error.message : "Gagal menyimpan akun",
      });
    } finally {
      setSaving(false);
    }
  },
  [currentPage, detailItem, fetchUsers],
);
```

## 5.8 Delete

```tsx
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
        title: error instanceof Error ? error.message : "Gagal menghapus akun",
      });
    }
  },
  [currentPage, data.length, fetchUsers],
);
```

Delete **tidak boleh** langsung dijalankan saat tombol hapus ditekan. Wajib melalui popover konfirmasi (lihat bagian 6.6).

## 5.9 Toolbar & filter UI

```tsx
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
          roles,
        })
      : null,
  [applyFilters, clearFilters, draftFilters, roles, setFilter, showFilterPanel],
);
```

---

# 6. Standar `page.config.tsx`

## 6.1 Type & constant

```tsx
"use client";

import { SquarePen } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  DeleteAction,
  FilterPanel,
  FilterSearch,
  FilterSelect,
  TableActions,
  TableToolbar,
} from "@/components/table-elements";
import { Badge } from "@/components/ui/badge";

export type UserDto = { id: string; /* ... */ };
export type UserFormValues = { /* ... */ };
export type UserFilters = { status: string; roleId: string };
export type UserListResponse = {
  data?: UserDto[];
  total?: number;
  message?: string;
  options?: { roles?: UserOptionDto[] };
};

export const ITEMS_PER_PAGE = 10;
export const initialFilters: UserFilters = { status: "all", roleId: "all" };
export const statusOptions = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "INACTIVE", label: "Tidak Aktif" },
];
```

* Penamaan type: `XxxDto`, `XxxFormValues`, `XxxFilters`, `XxxListResponse`, `XxxOptionDto`
* Opsi select ditulis sebagai `{ value, label }[]` (mis. `statusOptions`), jangan menulis mapping label inline berulang

## 6.2 Column

Column selalu diberi generic DTO:

```tsx
export const columnFormats: DefaultColumnFormat<UserDto>[] = [
  {
    key: "fullname",
    title: "Nama Lengkap",
    textClassName: "min-w-52 font-semibold text-slate-900!",
  },
  {
    key: "email",
    title: "Email",
    formatter: (value) => String(value || "-"),
  },
  {
    key: "role",
    title: "Role",
    formatter: (_value, row) => row.role?.name || "-",
  },
  {
    key: "createdAt",
    title: "Dibuat",
    formatter: (value) => formatDateId(value),
  },
  {
    key: "status",
    title: "Status",
    formatter: (value) =>
      value === "ACTIVE" ? (
        <Badge className="bg-emerald-100 text-emerald-700">Aktif</Badge>
      ) : (
        <Badge className="bg-slate-200 text-slate-600">Tidak Aktif</Badge>
      ),
  },
];
```

* Nilai kosong ditampilkan sebagai `"-"`
* Tanggal wajib memakai `formatDateId` dari `@/lib/helper/date`
* Relasi diakses lewat `row` pada argumen kedua formatter
* Kolom utama (nama) memakai `font-semibold text-slate-900!`

## 6.3 Komponen tabel bersama (`@/components/table-elements`)

Toolbar, filter, dan action **WAJIB** memakai komponen dari `@/components/table-elements`. Jangan menulis ulang `Button`/`Popover`/`Tooltip` untuk kebutuhan yang sama di `page.config.tsx`.

| Komponen | Fungsi |
|---|---|
| `TableToolbar` | Tombol Tambah, Filter (dengan badge jumlah filter aktif), dan Export Excel. Tombol hanya tampil jika handler-nya dikirim |
| `FilterPanel` | Container panel filter (form) + tombol Reset Filter dan Terapkan Filter; Enter juga menerapkan filter. Default grid `sm:grid-cols-2 xl:grid-cols-3`; ubah lewat `className` (mis. `xl:grid-cols-5`) |
| `FilterField` | Label + slot input custom di dalam panel filter |
| `FilterSearch` | Input pencarian dengan ikon |
| `FilterSelect` | Select dengan opsi "Semua ..." bernilai `"all"` |
| `TableActions` | Container action per baris (sudah termasuk `TooltipProvider`) |
| `ActionButton` | Tombol ikon + tooltip, `tone`: `blue` / `yellow` / `green` / `indigo` |
| `ActionMenu` | Tombol ikon yang membuka dropdown berisi beberapa aksi. Item yang belum bisa dipakai diberi `disabled` + `hint` berisi alasannya |
| `ConfirmAction` | Aksi merah dengan popover konfirmasi (mis. Batalkan Pengajuan) |
| `DeleteAction` | `ConfirmAction` khusus hapus |

## 6.4 `headerToolbar`

```tsx
type HeaderToolbarProps = {
  onAdd: () => void;
  onExport: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar addLabel="Tambah Akun" {...props} />
);
```

Hilangkan prop yang tidak dibutuhkan (mis. `onExport`). Jangan menampilkan tombol yang belum berfungsi.

## 6.5 `filterPanel`

```tsx
type FilterPanelProps = {
  filters: UserFilters;
  setFilter: (key: keyof UserFilters, value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  roles: UserOptionDto[];
};

export const filterPanel = ({
  filters,
  setFilter,
  applyFilters,
  clearFilters,
  roles,
}: FilterPanelProps) => (
  <FilterPanel
    title="Filter Akun"
    onApply={applyFilters}
    onReset={clearFilters}
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama, username, atau email..."
    />
    <FilterSelect
      label="Status"
      allLabel="Semua Status"
      value={filters.status}
      options={statusOptions}
      onChange={(value) => setFilter("status", value)}
    />
    <FilterSelect
      label="Role"
      allLabel="Semua Role"
      value={filters.roleId}
      options={roles.map((role) => ({ value: role.id, label: role.name }))}
      onChange={(value) => setFilter("roleId", value)}
    />
  </FilterPanel>
);
```

* `filters` yang dikirim ke panel adalah `draftFilters`
* Pencarian selalu berada di panel filter, bukan di toolbar

## 6.6 `renderActions`

```tsx
type RenderActionsProps = {
  row: UserDto;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onEdit: (user: UserDto) => void;
  onDelete: (id: string) => void | Promise<void>;
};

export const renderActions = ({
  row,
  deleteId,
  setDeleteId,
  onEdit,
  onDelete,
}: RenderActionsProps) => (
  <TableActions>
    <ActionButton
      label="Edit"
      icon={SquarePen}
      tone="yellow"
      onClick={() => onEdit(row)}
    />
    <DeleteAction
      open={deleteId === row.id}
      onOpenChange={(open) => setDeleteId(open ? row.id : null)}
      onConfirm={() => onDelete(row.id)}
      description="Akun akan dinonaktifkan dan tidak dapat digunakan untuk login."
    />
  </TableActions>
);
```

Urutan dan warna action (kiri → kanan):

| Action | Icon | `tone` |
|---|---|---|
| Lihat | `Eye` | `blue` |
| Edit | `SquarePen` | `yellow` |
| Action khusus (mis. Indikator) | sesuai konteks | `green` |
| Kirim / pengajuan | `Send` (`ActionMenu`) | `indigo` |
| Hapus | — | gunakan `DeleteAction` |

`description` pada `DeleteAction` opsional; isi jika penghapusan punya konsekuensi khusus.

---

# 7. Form Modal (`components/form-data.tsx`)

Kontrak props:

```tsx
type FormDataProps = {
  open: boolean;
  initialData?: UserDto;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
};
```

* Nama file `components/form-data.tsx`, default export `FormData`
* Form **tidak** melakukan fetch create/update; cukup memanggil `onSubmit(values)`
* Data opsi dropdown (roles, institutions, dll.) dikirim dari `page.tsx` lewat props
* Form dirender kondisional supaya state selalu bersih setiap kali dibuka. Jangan memakai `useEffect` untuk mereset form:

```tsx
{showModal ? (
  <FormData
    open
    initialData={detailItem}
    saving={saving}
    onClose={handleCloseModal}
    onSubmit={handleSave}
  />
) : null}
```

```tsx
const [form, setForm] = useState<UserFormValues>({
  fullname: initialData?.fullname || "",
  // ...
});
```

Struktur dan desain dialog:

```tsx
<Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
  <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-3xl">
    <DialogHeader className="border-b border-slate-200 px-6 py-4">
      <DialogTitle className="text-lg font-bold">
        {initialData ? "Edit Akun" : "Tambah Akun"}
      </DialogTitle>
      <DialogDescription className="text-sm text-slate-500">
        Lengkapi identitas, role, instansi, dan kredensial akun.
      </DialogDescription>
    </DialogHeader>

    <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">
            Nama Lengkap <span className="text-red-500">*</span>
          </Label>
          <Input className="h-11 border-slate-300 bg-white" />
        </div>
      </div>
    </div>

    <DialogFooter className="border-t border-slate-200 px-6 py-4">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="h-10 border-blue-500 px-6 font-semibold text-blue-600 hover:bg-blue-50"
      >
        Batal
      </Button>
      <Button
        type="button"
        disabled={saving || !requiredComplete}
        onClick={() => void onSubmit(form)}
        className="h-10 bg-[#2362ee] px-6 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
      >
        {saving ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Simpan Akun"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

* Input dan select di form: tinggi `h-11`, `border-slate-300 bg-white`
* Field wajib ditandai `<span className="text-red-500">*</span>`
* Tombol simpan di-disable selama `saving` atau saat field wajib belum lengkap
* Label tombol simpan: `"Simpan Perubahan"` saat edit, `"Simpan <Entitas>"` saat tambah

Form halaman penuh (create/detail, seperti inovasi) memakai `FormSection` dan `Field` dari `@/components/form-elements`.

---

# 8. Integrasi API (Frontend)

* Selalu memakai `parseApiResponse` dari `@/lib/helper/response-api`
* Jangan menulis manual `response.json()` + `result.message ||`
* `parseApiError` hanya dipakai jika response body tidak dibutuhkan setelah dicek
* Export CSV memakai `downloadCsv(filename, headers, rows)` dari `@/lib/helper/csv`

```tsx
const payload = await parseApiResponse<UserListResponse>(
  response,
  "Gagal mengambil data akun",
);
```

---

# 9. Toast

Project **tidak** memakai `sonner`. Gunakan:

```tsx
import { toast } from "@/components/ui/toast";
```

Format standar:

```tsx
toast.add({ type: "success", title: "Akun berhasil ditambahkan" });

toast.add({
  type: "error",
  title: error instanceof Error ? error.message : "Gagal menyimpan akun",
});
```

* `title` berisi pesan utama; `description` hanya jika ada informasi tambahan yang berguna
* Pesan sukses: `"<Entitas> berhasil ditambahkan/diperbarui/dihapus"`
* Pesan error fallback: `"Gagal <aksi> <entitas>"`

---

# 10. API Route (Backend)

Route berada di `app/api/[resource]/route.ts` (GET list, POST) dan `app/api/[resource]/[id]/route.ts` (GET detail, PUT, DELETE).

## 10.1 GET list

```ts
export async function GET(request: NextRequest) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10),
  );
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const status = request.nextUrl.searchParams.get("status");

  const where = {
    deletedAt: null,
    ...(status === Status.ACTIVE || status === Status.INACTIVE ? { status } : {}),
    ...(search
      ? {
          OR: [
            { fullname: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [data, total, roles] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { fullname: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
    prisma.role.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return NextResponse.json({ data, total, options: { roles } });
}
```

## 10.2 Kontrak response

| Kasus | Body | Status |
|---|---|---|
| List | `{ data, total, options? }` | 200 |
| Detail | `{ data }` | 200 |
| Create | `{ message, data }` | 201 |
| Update | `{ message, data }` | 200 |
| Delete | `{ message }` | 200 |
| Error | `{ message }` | 400 / 401 / 404 / 409 |

* Pesan dalam Bahasa Indonesia dan diakhiri titik (`"Akun tidak ditemukan."`)
* Filter `"all"` atau nilai tidak valid diabaikan, bukan error
* Filter dan search **wajib** diterapkan di `where` Prisma. Dilarang mengambil semua data lalu memfilternya dengan JavaScript
* Opsi filter yang berasal dari data dikirim di `options` (mis. `distinct` Prisma), dengan scope akses yang sama dengan data list
* Delete berupa soft delete (`deletedAt: new Date()`); semua query wajib memakai `deletedAt: null`
* Validasi payload dengan type guard (`typeof x === "string" ? x.trim() : ""`), lalu kembalikan 400 dengan pesan field wajib
* Cek duplikasi sebelum create/update, kembalikan 409
* `params` route bertipe `Promise`: `context: { params: Promise<{ id: string }> }` lalu `await context.params`
* Akses data inovasi wajib memakai `innovationOwnerScope(user)` dari `@/lib/innovation-access`
* Endpoint baru wajib mengecek permission dengan `hasPermission(user.role.permission, model, action)` dari `@/lib/permission` dan mengembalikan 403 jika tidak diizinkan. Model dan action harus terdaftar di `lib/master-permission.ts`
* Flag aksi per baris (mis. `canCancel`, `canVerify`) dihitung di backend dari permission + status data; FE hanya menampilkan aksi berdasarkan flag tersebut

---

# 11. Penamaan

| Jenis | Pola | Contoh |
|---|---|---|
| Fetch list | `fetch<Entities>` | `fetchUsers` |
| Buka form tambah | `handleOpenAdd` | |
| Buka form edit | `handleOpenEdit` | |
| Tutup form | `handleCloseModal` | |
| Simpan | `handleSave` | |
| Hapus | `handleDelete` | |
| Export | `handleExport` | |
| Ubah input filter (draft) | `setFilter` | |
| Terapkan filter | `applyFilters` | |
| Reset filter | `clearFilters` | |
| JSX toolbar/filter | `toolbar`, `filtersUi` | |
| Komponen halaman | `<Entity>Page` | `AccountPage` |
| Form modal | `components/form-data.tsx`, default export `FormData` | |

State: `data`, `total`, `loading`, `saving`, `currentPage`, `draftFilters`, `filters`, `showModal`, `detailItem`, `deleteId`, `showFilterPanel`.

---

# 12. Design Token

| Elemen | Class |
|---|---|
| Background halaman | `bg-[#f7f8fc]` |
| Warna primer | `#2362ee` (`bg-[#2362ee] hover:bg-blue-700`) |
| Badge filter aktif | `bg-[#ffb437]` |
| Tombol toolbar | `h-9 rounded-md px-4 text-xs font-semibold` |
| Panel filter | `rounded-xl border border-neutral-200 bg-[#fafbfc] p-5` |
| Input/select filter | `h-11! border-neutral-300 bg-white text-xs` |
| Label filter | `text-xs font-semibold text-slate-600` |
| Badge status aktif | `bg-emerald-100 text-emerald-700` |
| Badge status nonaktif | `bg-slate-200 text-slate-600` |
| Link di tabel | `font-medium text-blue-600 hover:text-blue-700 hover:underline` + `ExternalLink size-3.5` |

Jangan membuat warna atau ukuran baru jika token di atas sudah mencukupi.

---

# 13. Format Kode

* Kode wajib terformat multi-line seperti contoh di dokumen ini (gaya Prettier)
* Dilarang menulis component, handler, atau JSX dalam satu baris panjang
* `"use client"` wajib di `page.tsx` dan di `page.config.tsx` jika file tersebut menghasilkan JSX
* Komentar `eslint-disable` hanya untuk `react-hooks/set-state-in-effect` pada effect fetch, disertai komentar alasan singkat

---

# 14. Final Validation

Sebelum menyelesaikan sebuah halaman, pastikan:

* [ ] Ada `page.tsx`, `page.config.tsx`, dan `components/`, tanpa file tambahan di root page
* [ ] Layout memakai `AppSidebarLayout` + `AppPageHeader` + `DynamicPage`
* [ ] Type, column, toolbar, filter UI, dan action berada di `page.config.tsx`
* [ ] Fetch, pagination, dan handler berada di `page.tsx`
* [ ] Filter dan search disaring di backend lewat params (bukan di FE, bukan di memory BE)
* [ ] Request hanya terjadi saat Terapkan Filter / Reset, dan pagination kembali ke halaman 1
* [ ] Opsi select yang berasal dari data dikirim oleh API (`options`)
* [ ] Request memakai `parseApiResponse`
* [ ] Toast memakai `@/components/ui/toast`
* [ ] Toolbar, filter, dan action memakai `@/components/table-elements`
* [ ] Tidak ada override style pada `DynamicPage` selain jarak
* [ ] Delete melalui `DeleteAction`
* [ ] Form modal memakai kontrak `open/initialData/saving/onClose/onSubmit` dan dirender kondisional
* [ ] API route mengikuti kontrak response bagian 10
* [ ] Penamaan dan design token mengikuti bagian 11 dan 12
* [ ] Kode terformat rapi, tidak ada baris yang dimampatkan

**Aturan paling penting:**

> Jangan mengubah struktur page.
> Jangan menambah file di root page.
> Jangan membuat pola baru jika pola `DynamicPage + page.tsx + page.config.tsx + components/` sudah dapat digunakan.
> Jika ragu, ikuti `app/(dashboard)/settings/accounts/`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
