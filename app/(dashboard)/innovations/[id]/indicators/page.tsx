"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import IndicatorSummary from "./components/indicator-summary";
import IndicatorTable from "./components/indicator-table";
import { indicators } from "./page.config";

export default function InnovationIndicatorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState("Inovasi");
  const [stage, setStage] = useState("Inisiatif");
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [files, setFiles] = useState<Record<number, File | undefined>>({});

  useEffect(() => {
    void fetch(`/api/innovations/${id}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setName(result.data.name || "Inovasi");
        const now = new Date();
        const implementation = result.data.implementationPeriod
          ? new Date(result.data.implementationPeriod)
          : null;
        const trial = result.data.trialPeriod
          ? new Date(result.data.trialPeriod)
          : null;
        setStage(
          implementation && implementation <= now
            ? "Penerapan"
            : trial && trial <= now
              ? "Uji Coba"
              : "Inisiatif",
        );
      })
      .catch((error) =>
        toast.add({
          title: "Gagal memuat inovasi",
          description:
            error instanceof Error ? error.message : "Silakan coba kembali.",
          type: "error",
        }),
      );
  }, [id]);

  const onSelect = useCallback(
    (indicatorId: number, value: string) =>
      setSelections((current) => ({ ...current, [indicatorId]: value })),
    [],
  );
  const onFile = useCallback(
    (indicatorId: number, file?: File) =>
      setFiles((current) => ({ ...current, [indicatorId]: file })),
    [],
  );
  const completed = Object.keys(selections).length;
  const score = indicators.reduce(
    (total, indicator) =>
      total + (selections[indicator.id] ? indicator.weight : 0),
    0,
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen min-w-0 bg-[#f7f8fc] px-4 py-5 text-slate-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title={name}
            description={`Inovasi Perangkat Daerah > ${name}`}
          />
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-600">Tahapan</p>
              <span className="mt-2 inline-flex min-w-32 justify-center rounded-full bg-emerald-200 px-4 py-1 text-xs font-medium text-emerald-700">
                {stage}
              </span>
            </div>
            <IndicatorSummary
              score={score}
              completed={completed}
              total={indicators.length}
            />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
            <IndicatorTable
              items={indicators}
              selections={selections}
              files={files}
              onSelect={onSelect}
              onFile={onFile}
            />
          </div>
        </div>
      </main>
    </AppSidebarLayout>
  );
}
