"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { toast } from "@/components/ui/toast";
import FormData from "./components/form-data";
import SummaryCards from "./components/summary-cards";
import {
  columnFormats,
  filterPanel,
  headerToolbar,
  initialFilters,
  initialFormValues,
  initialInnovations,
  ITEMS_PER_PAGE,
  type InnovationDto,
  type InnovationFilters,
  type InnovationFormValues,
} from "./page.config";

export default function InnovationPage() {
  const [data, setData] = useState<InnovationDto[]>(initialInnovations);
  const [filters, setFilters] = useState<InnovationFilters>(initialFilters);
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] =
    useState<InnovationFormValues>(initialFormValues);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        Object.entries(filters).every(
          ([key, value]) =>
            value === "all" || item[key as keyof InnovationDto] === value,
        ),
      ),
    [data, filters],
  );
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE)),
    [filteredData.length],
  );
  const paginatedData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [currentPage, filteredData],
  );
  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((value) => value !== "all").length,
    [filters],
  );
  const summaryValues = useMemo(
    () => ({
      total: data.length,
      initiative: data.filter((item) => item.stage === "Inisiatif").length,
      trial: data.filter((item) => item.stage === "Uji Coba").length,
      implementation: data.filter((item) => item.stage === "Penerapan").length,
      award: data.filter((item) => item.awarded).length,
    }),
    [data],
  );

  const setFilter = useCallback(
    (key: keyof InnovationFilters, value: string) => {
      setFilters((current) => ({ ...current, [key]: value }));
      setCurrentPage(1);
    },
    [],
  );
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, []);
  const handleFormChange = useCallback(
    (field: keyof InnovationFormValues, value: string) =>
      setFormValues((current) => ({ ...current, [field]: value })),
    [],
  );
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setData((current) => [
        ...current,
        {
          ...formValues,
          id: `innovation-${Date.now()}`,
          number: current.length + 1,
          awarded: false,
        },
      ]);
      setFormValues(initialFormValues);
      setShowModal(false);
      toast.add({
        title: "Berhasil",
        description: "Inovasi berhasil ditambahkan",
        type: "success",
      });
    },
    [formValues],
  );

  const toolbar = useMemo(
    () =>
      headerToolbar({
        onAdd: () => setShowModal(true),
        onExport: () =>
          toast.add({
            title: "Export Excel",
            description: "Data inovasi siap diekspor",
            type: "success",
          }),
        setShowFilter: setShowFilterPanel,
        activeFilterCount,
      }),
    [activeFilterCount],
  );
  const filtersUi = useMemo(
    () =>
      showFilterPanel
        ? filterPanel({ filters, setFilter, clearFilters })
        : null,
    [clearFilters, filters, setFilter, showFilterPanel],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader />
          <SummaryCards values={summaryValues} />
          <div className="mt-5 [&>div]:!bg-white [&>div]:!text-slate-200 [&_table]:!text-slate-100 [&_thead]:!border-slate-200 [&_tr]:!border-slate-200 [&_th]:!border-slate-100 [&_th]:!text-slate-700 [&_td]:!border-slate-200 [&_td]:!text-slate-700 [&_p]:!text-slate-600 [&_p_span]:!text-slate-100">
            <DynamicPage
              className="border! border-neutral-200! shadow-none! ring-0! backdrop-blur-none! dark:bg-white"
              toolbar={toolbar}
              filterPanel={filtersUi}
              columns={columnFormats}
              items={paginatedData}
              total={filteredData.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              emptyMessage="Tidak ada inovasi yang sesuai dengan filter"
              getRowId={(row) => row.id}
            />
          </div>
        </div>
      </main>
      <FormData
        isOpen={showModal}
        values={formValues}
        onChange={handleFormChange}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </AppSidebarLayout>
  );
}
