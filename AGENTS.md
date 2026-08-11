# AGENT.md

# Page Development Rules

Dokumen ini adalah aturan wajib untuk seluruh development halaman pada project.

Tujuan utama aturan ini adalah menjaga struktur halaman tetap konsisten, mudah dipelihara, dan seluruh halaman menggunakan pola yang sama.

---

## 1. Struktur Folder Wajib

Setiap halaman/page **WAJIB** memiliki struktur berikut:

```text
[module]/
└── [feature]/
    ├── page.tsx
    ├── page.config.tsx
    └── components/
```

Contoh:

```text
app/
└── tenants/
    ├── page.tsx
    ├── page.config.tsx
    └── components/
        └── form-data.tsx
```

### ATURAN KERAS

Di dalam folder page:

* `page.tsx` **WAJIB ADA**
* `page.config.tsx` **WAJIB ADA**
* `components/` **WAJIB ADA**
* Tidak boleh menambahkan file lain di root page
* Tidak boleh mengurangi salah satu dari tiga struktur tersebut
* Semua component khusus halaman harus berada di `components/`
* Configuration, type, column definition, toolbar, dan action berada di `page.config.tsx`
* Orchestration, state, API request, dan lifecycle berada di `page.tsx`

### DILARANG

Struktur seperti berikut tidak diperbolehkan:

```text
tenants/
├── page.tsx
├── page.config.tsx
├── service.ts
├── types.ts
├── constants.ts
├── utils.ts
└── components/
```

Jangan membuat:

```text
tenants/
├── page.tsx
├── page.config.tsx
├── api.ts
├── hooks.ts
└── components/
```

Jangan membuat:

```text
tenants/
├── page.tsx
├── page.config.tsx
├── components/
├── hooks/
└── services/
```

Jika membutuhkan helper khusus halaman, letakkan logic tersebut di `page.tsx`, `page.config.tsx`, atau component yang relevan di dalam `components/`.

---

# 2. Tanggung Jawab Setiap File

## `page.tsx`

`page.tsx` adalah **orchestrator halaman**.

Tanggung jawab:

* State management
* Fetch API
* Pagination
* Search
* Debounce
* Filter state
* Modal state
* Delete state
* Permission/role checking
* Event handler
* Memanggil component
* Mengirim data ke `DynamicPage`

`page.tsx` tidak boleh menjadi tempat definisi column yang panjang.

Gunakan:

```tsx
import {
  columnFormats,
  headerToolbar,
  ITEMS_PER_PAGE,
  renderActions,
  type TenantDto,
} from "./page.config";
```

---

## `page.config.tsx`

`page.config.tsx` adalah pusat konfigurasi halaman.

Tanggung jawab:

* Type/interface halaman
* DTO type
* Form type
* `ITEMS_PER_PAGE`
* Column definition
* Toolbar
* Filter UI
* Action renderer
* Formatter
* Konfigurasi tampilan table

Contoh:

```tsx
export const ITEMS_PER_PAGE = 10;

export const columnFormats: DefaultColumnFormat[] = [
  {
    key: "companyName",
    title: "Nama Perusahaan",
    formatter: (value) => String(value || "-"),
  },
];
```

`page.config.tsx` boleh menggunakan component UI seperti:

```tsx
Button
Input
Label
Select
Popover
```

dan icon:

```tsx
lucide-react
```

---

## `components/`

Folder `components/` digunakan untuk component yang hanya berkaitan dengan halaman tersebut.

Contoh:

```text
components/
└── form-data.tsx
```

Jika halaman membutuhkan form modal, gunakan:

```tsx
<FormData
  isOpen={showModal}
  initialData={detailItem}
  onClose={handleCloseModal}
  onSuccess={fetchTenants}
/>
```

Jangan membuat component khusus halaman di luar folder `components/`.

---

# 3. DynamicPage Wajib Digunakan

Untuk halaman yang menampilkan data dalam bentuk table, **WAJIB menggunakan `DynamicPage`**.

Import:

```tsx
import DynamicPage from "@/components/dynamic-page";
```

Contoh penggunaan:

```tsx
<DynamicPage
  toolbar={toolbar}
  columns={columnFormats}
  items={data}
  total={total}
  currentPage={currentPage}
  totalPages={totalPages}
  loading={loading}
  emptyMessage="Tidak ada data"
  onPageChange={setCurrentPage}
  renderActions={(row) =>
    renderActions({
      row,
      onView,
      onDelete,
      deleteId,
      setDeleteId,
    })
  }
/>
```

Jangan membuat table baru jika `DynamicPage` sudah dapat menangani kebutuhan tersebut.

---

# 4. Standar State `page.tsx`

Halaman CRUD/table umumnya menggunakan pola state berikut:

```tsx
const [data, setData] = useState<TenantDto[]>([]);
const [searchTerm, setSearchTerm] = useState("");
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
const [status, setStatus] = useState("all");
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [detailItem, setDetailItem] = useState<TenantDto | undefined>(
  undefined,
);
const [currentPage, setCurrentPage] = useState(1);
const [total, setTotal] = useState(0);
const [showFilterPanel, setShowFilterPanel] = useState(false);
const [deleteId, setDeleteId] = useState<string | null>(null);
```

Gunakan state hanya jika memang dibutuhkan oleh halaman.

Jangan membuat state yang tidak digunakan.

---

# 5. Pagination

Pagination harus menggunakan:

```tsx
export const ITEMS_PER_PAGE = 10;
```

Total halaman:

```tsx
const totalPages = useMemo(
  () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
  [total],
);
```

API request harus mengirim:

```tsx
params.set("page", String(currentPage));
params.set("limit", String(ITEMS_PER_PAGE));
```

`DynamicPage` menerima:

```tsx
total={total}
currentPage={currentPage}
totalPages={totalPages}
onPageChange={setCurrentPage}
```

---

# 6. Search

Search menggunakan debounce.

State:

```tsx
const [searchTerm, setSearchTerm] = useState("");
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
```

Debounce standar:

```tsx
useEffect(() => {
  const timeout = window.setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);

  return () => window.clearTimeout(timeout);
}, [searchTerm]);
```

API menggunakan:

```tsx
if (debouncedSearchTerm) {
  params.set("search", debouncedSearchTerm);
}
```

Jangan langsung menggunakan `searchTerm` untuk fetch API jika debounce diperlukan.

---

# 7. Filter

Filter harus memiliki:

* state filter
* active filter count
* clear filter
* filter panel
* filter UI di `page.config.tsx`

Contoh:

```tsx
const activeFilterCount = useMemo(() => {
  let count = 0;

  if (searchTerm) count++;
  if (status !== "all") count++;

  return count;
}, [searchTerm, status]);
```

Clear filter:

```tsx
const clearFilters = useCallback(() => {
  setSearchTerm("");
  setStatus("all");
}, []);
```

Ketika filter berubah, pagination kembali ke halaman pertama:

```tsx
useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearchTerm, status]);
```

---

# 8. Filter UI Berada di `page.config.tsx`

Toolbar/filter menggunakan function:

```tsx
export const headerToolbar = ({
  actions,
  filters,
}: HeaderToolbarProps) => (
  // UI
);
```

`page.tsx` hanya menyediakan state dan handler:

```tsx
const toolbar = useMemo(
  () =>
    headerToolbar({
      actions: {
        onAdd,
      },
      filters: {
        show: showFilterPanel,
        setShow: setShowFilterPanel,
        activeCount: activeFilterCount,
        clear: clearFilters,
        searchTerm,
        setSearchTerm,
        status,
        setStatus,
      },
    }),
  [
    activeFilterCount,
    clearFilters,
    onAdd,
    searchTerm,
    showFilterPanel,
    status,
  ],
);
```

Dengan pola ini, `page.tsx` tetap bersih.

---

# 9. API Fetch

API request dilakukan di `page.tsx`.

Gunakan `useCallback`:

```tsx
const fetchTenants = useCallback(async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams();

    params.set("page", String(currentPage));
    params.set("limit", String(ITEMS_PER_PAGE));

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    }

    if (status !== "all") {
      params.set("status", status);
    }

    const res = await fetch(`/api/tenants?${params.toString()}`);

    if (!res.ok) {
      throw new Error(
        await parseApiError(res, "Gagal mengambil data tenant"),
      );
    }

    const json = await res.json();

    setData(json.data || []);
    setTotal(json.total || 0);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data tenant";

    toast.error(message);
  } finally {
    setLoading(false);
  }
}, [currentPage, debouncedSearchTerm, status]);
```

Fetch dipanggil melalui:

```tsx
useEffect(() => {
  fetchTenants();
}, [fetchTenants]);
```

---

# 10. API Error Handling

Gunakan:

```tsx
import { parseApiError } from "@/lib/helper/response-api";
```

Untuk response API yang gagal:

```tsx
if (!res.ok) {
  throw new Error(
    await parseApiError(res, "Gagal mengambil data"),
  );
}
```

Jangan membuat helper error baru khusus halaman jika helper global sudah tersedia.

---

# 11. Toast

Gunakan:

```tsx
import { toast } from "sonner";
```

Success:

```tsx
toast.success("Data berhasil disimpan");
```

Error:

```tsx
toast.error(message);
```

---

# 12. CRUD Action

Action table menggunakan:

```tsx
export const renderActions = ({
  row,
  onView,
  onDelete,
  deleteId,
  setDeleteId,
}: RenderActionsProps) => (
  // action UI
);
```

`page.tsx` menangani logic.

Contoh:

```tsx
const onDelete = useCallback(
  async (id: string) => {
    try {
      const res = await fetch(`/api/tenants/${id}`, {
        method: "DELETE",
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.message || "Gagal menghapus data");
      }

      toast.success("Data berhasil dihapus");

      fetchTenants();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menghapus data";

      toast.error(message);
    } finally {
      setDeleteId(null);
    }
  },
  [fetchTenants],
);
```

---

# 13. Delete Confirmation

Delete **tidak boleh langsung dilakukan ketika tombol delete ditekan**.

Gunakan confirmation UI.

Pola standar:

```tsx
<Popover
  open={deleteId === row.id}
  onOpenChange={(open) =>
    setDeleteId?.(open ? row.id : null)
  }
>
  <PopoverTrigger asChild>
    <button>
      <Trash2 className="h-4 w-4" />
    </button>
  </PopoverTrigger>

  <PopoverContent className="w-56 space-y-3">
    <p className="text-sm">
      Yakin ingin menghapus data ini?
    </p>

    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDeleteId?.(null)}
      >
        Batal
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(row.id)}
      >
        Hapus
      </Button>
    </div>
  </PopoverContent>
</Popover>
```

---

# 14. Modal/Form

Modal/form khusus halaman harus berada di:

```text
components/
```

Contoh:

```text
tenants/
├── page.tsx
├── page.config.tsx
└── components/
    └── form-data.tsx
```

`page.tsx` bertanggung jawab terhadap:

```tsx
const [showModal, setShowModal] = useState(false);
const [detailItem, setDetailItem] = useState<TenantDto | undefined>();
```

Open add:

```tsx
const onAdd = useCallback(() => {
  setDetailItem(undefined);
  setShowModal(true);
}, []);
```

Open edit/view:

```tsx
const onView = useCallback((tenant: TenantDto) => {
  setDetailItem(tenant);
  setShowModal(true);
}, []);
```

Close:

```tsx
const handleCloseModal = useCallback(() => {
  setDetailItem(undefined);
  setShowModal(false);
}, []);
```

Render:

```tsx
<FormData
  isOpen={showModal}
  initialData={detailItem}
  onClose={handleCloseModal}
  onSuccess={fetchTenants}
/>
```

---

# 15. Type Definition

Type yang hanya digunakan oleh halaman harus berada di:

```text
page.config.tsx
```

Contoh:

```tsx
export type TenantDto = {
  id: string;
  companyName: string;
  adminEmail: string;
  isActive: boolean;
  logoUrl: string | null;
  logoDarkUrl: string | null;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  createdAt: string;
};
```

Form props:

```tsx
export type FormDataProps = {
  isOpen: boolean;
  initialData?: Tenant;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
};
```

Tidak perlu membuat:

```text
types.ts
```

karena type halaman berada di:

```text
page.config.tsx
```

---

# 16. Column Definition

Semua column table berada di:

```tsx
page.config.tsx
```

Contoh:

```tsx
export const columnFormats: DefaultColumnFormat[] = [
  {
    key: "companyName",
    title: "Nama Perusahaan",
    textClassName:
      "font-medium text-slate-900 dark:text-slate-100",
    formatter: (value) => String(value || "-"),
  },
  {
    key: "adminEmail",
    title: "Email Admin",
    textClassName:
      "text-slate-700 dark:text-slate-200",
    formatter: (value) => String(value || "-"),
  },
];
```

Formatter harus menangani nilai kosong/null jika diperlukan.

---

# 17. Date Formatting

Gunakan helper existing:

```tsx
import { formatDateId } from "@/lib/helper/date";
```

Contoh:

```tsx
formatter: (value) =>
  formatDateId(
    typeof value === "string" ? value : null,
  ),
```

Jangan membuat formatter tanggal baru khusus halaman jika helper global sudah tersedia.

---

# 18. Naming Convention

Gunakan nama file yang konsisten.

Wajib:

```text
page.tsx
page.config.tsx
components/
```

Component:

```text
form-data.tsx
```

Nama function:

```tsx
fetchTenants
onAdd
onView
onDelete
handleCloseModal
clearFilters
```

Nama state mengikuti pola:

```tsx
showModal
showFilterPanel
deleteId
currentPage
searchTerm
debouncedSearchTerm
```

---

# 19. Client Component

Jika halaman menggunakan:

* `useState`
* `useEffect`
* `useMemo`
* `useCallback`
* browser API
* localStorage
* event handler

maka `page.tsx` harus menggunakan:

```tsx
"use client";
```

`page.config.tsx` juga menggunakan:

```tsx
"use client";
```

jika configuration tersebut menghasilkan JSX atau menggunakan client-side component.

---

# 20. Permission / Role

Jika halaman memiliki batasan role, pengecekan dilakukan di `page.tsx`.

Contoh:

```tsx
const [userData, setUserData] = useState({
  id: "",
  role: "",
});

useEffect(() => {
  const data = JSON.parse(
    localStorage.getItem("hr_user_data") || "{}",
  );

  setUserData(data);
}, []);
```

Kemudian:

```tsx
if (userData.role !== "Super Admin") {
  return (
    <div>
      Halaman ini hanya bisa diakses oleh role Super Admin.
    </div>
  );
}
```

---

# 21. Import Order

Gunakan urutan import yang konsisten:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import DynamicPage from "@/components/dynamic-page";
import { toast } from "sonner";

import FormData from "./components/form-data";

import {
  columnFormats,
  headerToolbar,
  ITEMS_PER_PAGE,
  renderActions,
  type TenantDto,
} from "./page.config";

import { parseApiError } from "@/lib/helper/response-api";
```

Tidak perlu memaksakan urutan ini jika formatter/linter project memiliki aturan otomatis sendiri, tetapi struktur import harus tetap rapi.

---

# 22. Standar `page.tsx`

Template dasar halaman table:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "sonner";

import {
  columnFormats,
  headerToolbar,
  ITEMS_PER_PAGE,
  renderActions,
  type TenantDto,
} from "./page.config";

import { parseApiError } from "@/lib/helper/response-api";

export default function Page() {
  const [data, setData] = useState<TenantDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total],
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(currentPage));
      params.set("limit", String(ITEMS_PER_PAGE));

      if (debouncedSearchTerm) {
        params.set("search", debouncedSearchTerm);
      }

      const res = await fetch(`/api/resource?${params.toString()}`);

      if (!res.ok) {
        throw new Error(
          await parseApiError(
            res,
            "Gagal mengambil data",
          ),
        );
      }

      const json = await res.json();

      setData(json.data || []);
      setTotal(json.total || 0);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil data";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toolbar = useMemo(
    () =>
      headerToolbar({
        filters: {
          show: showFilterPanel,
          setShow: setShowFilterPanel,
          searchTerm,
          setSearchTerm,
        },
      }),
    [
      searchTerm,
      showFilterPanel,
    ],
  );

  return (
    <DynamicPage
      toolbar={toolbar}
      columns={columnFormats}
      items={data}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      loading={loading}
      emptyMessage="Tidak ada data"
      onPageChange={setCurrentPage}
      renderActions={(row) =>
        renderActions({
          row,
          deleteId,
          setDeleteId,
        })
      }
    />
  );
}
```

Template tersebut adalah pola dasar dan harus disesuaikan dengan kebutuhan halaman.

---

# 23. Standar `page.config.tsx`

Template dasar:

```tsx
"use client";

import type React from "react";
import type { DefaultColumnFormat } from "@/components/dynamic-page";

export type DataDto = {
  id: string;
};

interface HeaderToolbarProps {
  filters: {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<
      React.SetStateAction<string>
    >;
  };
}

interface RenderActionsProps {
  row: DataDto;
}

export const ITEMS_PER_PAGE = 10;

export const columnFormats: DefaultColumnFormat[] = [
  {
    key: "id",
    title: "ID",
    formatter: (value) => String(value || "-"),
  },
];

export const headerToolbar = ({
  filters,
}: HeaderToolbarProps) => (
  // toolbar dan filter
);

export const renderActions = ({
  row,
}: RenderActionsProps) => (
  // actions
);
```

---

# 24. Prinsip Utama

Setiap page harus mengikuti pembagian tanggung jawab:

```text
page.tsx
│
├── State
├── API
├── Fetch
├── Pagination
├── Search
├── Filter State
├── Modal State
├── Delete State
├── Permission
└── Orchestration
        │
        ├── DynamicPage
        └── components/
```

Sedangkan:

```text
page.config.tsx
│
├── Types
├── DTO
├── Constants
├── Columns
├── Toolbar
├── Filter UI
├── Formatter
└── Actions
```

---

# 25. Forbidden Structure

AI/Developer **DILARANG** membuat struktur baru seperti:

```text
services/
hooks/
utils/
lib/
types/
constants/
api/
actions/
schemas/
validators/
```

di dalam folder page.

Jangan membuat:

```text
page.tsx
page.config.tsx
page.types.ts
page.constants.ts
page.utils.ts
```

Jangan memindahkan:

```tsx
columnFormats
headerToolbar
renderActions
ITEMS_PER_PAGE
```

ke file lain.

Semuanya harus tetap berada di:

```text
page.config.tsx
```

---

# 26. Final Validation

Sebelum menyelesaikan development sebuah page, pastikan:

* [ ] Ada `page.tsx`
* [ ] Ada `page.config.tsx`
* [ ] Ada folder `components/`
* [ ] Tidak ada file tambahan di root page
* [ ] Table menggunakan `DynamicPage`
* [ ] Column berada di `page.config.tsx`
* [ ] Toolbar berada di `page.config.tsx`
* [ ] Filter UI berada di `page.config.tsx`
* [ ] Action renderer berada di `page.config.tsx`
* [ ] Type/DTO berada di `page.config.tsx`
* [ ] API fetch berada di `page.tsx`
* [ ] Pagination berada di `page.tsx`
* [ ] Search menggunakan debounce jika diperlukan
* [ ] Filter mengembalikan pagination ke halaman 1
* [ ] Loading state tersedia
* [ ] Empty state menggunakan `DynamicPage`
* [ ] API error menggunakan helper yang sudah tersedia
* [ ] Toast menggunakan `sonner`
* [ ] Component khusus halaman berada di `components/`
* [ ] Tidak membuat helper/service/type file baru di dalam page
* [ ] Tidak membuat struktur folder tambahan
* [ ] Naming mengikuti pola yang sudah ditentukan

**Aturan paling penting:**

> Jangan mengubah struktur page.
> Jangan menambah file.
> Jangan mengurangi file.
> Jangan membuat pola baru jika pola `DynamicPage + page.tsx + page.config.tsx + components/` sudah dapat digunakan.
