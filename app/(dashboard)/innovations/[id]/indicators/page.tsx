"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { parseApiError, parseApiResponse } from "@/lib/helper/response-api";

import IndicatorSummary from "./components/indicator-summary";
import IndicatorTable from "./components/indicator-table";
import ReviewIndicatorDialog from "./components/review-indicator-dialog";
import {
  indicators,
  type IndicatorDocument,
  type IndicatorDto,
  type IndicatorListResponse,
  type IndicatorReview,
  type IndicatorReviewValues,
} from "./page.config";

export default function InnovationIndicatorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [name, setName] = useState("Inovasi");
  const [stage, setStage] = useState("Inisiatif");
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [documents, setDocuments] = useState<Record<number, IndicatorDocument[]>>({});
  const [reviews, setReviews] = useState<Record<number, IndicatorReview>>({});
  const [canReview, setCanReview] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    indicator: IndicatorDto;
    action: IndicatorReviewValues["action"];
  } | null>(null);
  const [savingReview, setSavingReview] = useState(false);

  const fetchIndicators = useCallback(async () => {
    const response = await fetch(`/api/innovations/${id}/indicators`, {
      cache: "no-store",
    });
    const payload = await parseApiResponse<IndicatorListResponse>(
      response,
      "Gagal memuat indikator.",
    );
    const nextSelections: Record<number, string> = {};
    const nextDocuments: Record<number, IndicatorDocument[]> = {};
    const nextReviews: Record<number, IndicatorReview> = {};
    for (const assessment of payload.data || []) {
      nextSelections[assessment.indicatorId] = assessment.parameter;
      nextDocuments[assessment.indicatorId] = assessment.documents || [];
      nextReviews[assessment.indicatorId] = assessment.review;
    }
    setSelections(nextSelections);
    setDocuments(nextDocuments);
    setReviews(nextReviews);
    setCanReview(Boolean(payload.canReview));
  }, [id]);

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

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchIndicators().catch((error) =>
        toast.add({
          title: "Gagal memuat indikator",
          description: error instanceof Error ? error.message : "Silakan coba kembali.",
          type: "error",
        }),
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [fetchIndicators]);

  const onSelect = useCallback(async (indicatorId: number, value: string) => {
    const indicator = indicators.find((item) => item.id === indicatorId);
    setSelections((current) => ({ ...current, [indicatorId]: value }));
    try {
      const response = await fetch(`/api/innovations/${id}/indicators`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indicatorId, parameter: value, score: indicator?.weight || 0 }),
      });
      if (!response.ok)
        throw new Error(await parseApiError(response, "Gagal menyimpan parameter."));
      await fetchIndicators();
    } catch (error) {
      await fetchIndicators();
      toast.add({
        title: "Gagal menyimpan parameter",
        description: error instanceof Error ? error.message : "Silakan coba kembali.",
        type: "error",
      });
    }
  }, [fetchIndicators, id]);
  const onDocument = useCallback(async (indicatorId: number, document: IndicatorDocument) => {
    if (!document.file) return false;
    try {
      const formData = new FormData();
      formData.set("documentNumber", document.documentNumber);
      formData.set("documentDate", document.documentDate);
      formData.set("documentTitle", document.documentTitle);
      formData.set("file", document.file);
      const response = await fetch(
        `/api/innovations/${id}/indicators/${indicatorId}/documents`,
        { method: "POST", body: formData },
      );
      if (!response.ok)
        throw new Error(await parseApiError(response, "Gagal mengunggah dokumen."));
      await fetchIndicators();
      toast.add({ title: "Dokumen berhasil diunggah", type: "success" });
      return true;
    } catch (error) {
      toast.add({
        title: "Gagal mengunggah dokumen",
        description: error instanceof Error ? error.message : "Silakan coba kembali.",
        type: "error",
      });
      return false;
    }
  }, [fetchIndicators, id]);

  const onDeleteDocument = useCallback(async (indicatorId: number, document: IndicatorDocument) => {
    if (!document.id) return;
    try {
      const response = await fetch(
        `/api/innovations/${id}/indicators/${indicatorId}/documents/${document.id}`,
        { method: "DELETE" },
      );
      if (!response.ok)
        throw new Error(await parseApiError(response, "Gagal menghapus dokumen."));
      await fetchIndicators();
      toast.add({ title: "Dokumen berhasil dihapus", type: "success" });
    } catch (error) {
      toast.add({
        title: "Gagal menghapus dokumen",
        description: error instanceof Error ? error.message : "Silakan coba kembali.",
        type: "error",
      });
    }
  }, [fetchIndicators, id]);
  const handleOpenReview = useCallback(
    (indicator: IndicatorDto, action: IndicatorReviewValues["action"]) => {
      setReviewTarget({ indicator, action });
    },
    [],
  );

  const handleCloseReview = useCallback(() => {
    if (savingReview) return;
    setReviewTarget(null);
  }, [savingReview]);

  const handleReview = useCallback(
    async (values: IndicatorReviewValues) => {
      if (!reviewTarget) return;
      try {
        setSavingReview(true);
        const response = await fetch(
          `/api/innovations/${id}/indicators/${reviewTarget.indicator.id}/review`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          },
        );
        await parseApiResponse(response, "Gagal memverifikasi indikator");
        toast.add({
          type: "success",
          title:
            values.action === "approve"
              ? "Indikator berhasil disetujui"
              : "Indikator berhasil ditolak",
        });
        setReviewTarget(null);
        await fetchIndicators();
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal memverifikasi indikator",
        });
      } finally {
        setSavingReview(false);
      }
    },
    [fetchIndicators, id, reviewTarget],
  );

  const completed = Object.keys(selections).length;
  // Bobot indikator yang ditolak verifikator tidak dihitung.
  const score = indicators.reduce(
    (total, indicator) =>
      total +
      (selections[indicator.id] && reviews[indicator.id]?.status !== "REJECTED"
        ? indicator.weight
        : 0),
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
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Button
                nativeButton={false}
                variant="outline"
                className="h-10 w-fit border-blue-200 bg-white px-4 font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                render={<Link href="/innovations" />}
              >
                <ArrowLeft />
                Kembali
              </Button>
            </div>
            <IndicatorSummary
              stage={stage}
              score={score}
              completed={completed}
              total={indicators.length}
            />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
            <p className="mb-4 text-xs text-slate-600">
              <span className="font-semibold text-red-500">*</span> Indikator
              wajib. Pilih parameter dan unggah dokumen pendukungnya agar
              inovasi dapat dikirim ke Perjanjian Kinerja atau Lomba Inovasi.
            </p>
            <IndicatorTable
              innovationId={id}
              items={indicators}
              selections={selections}
              documents={documents}
              reviews={reviews}
              canReview={canReview}
              onReview={handleOpenReview}
              onSelect={onSelect}
              onDocument={onDocument}
              onDeleteDocument={onDeleteDocument}
            />
          </div>
        </div>
      </main>

      {reviewTarget ? (
        <ReviewIndicatorDialog
          open
          indicator={reviewTarget.indicator}
          action={reviewTarget.action}
          initialNote={
            reviewTarget.action === "reject"
              ? reviews[reviewTarget.indicator.id]?.note
              : ""
          }
          saving={savingReview}
          onClose={handleCloseReview}
          onSubmit={handleReview}
        />
      ) : null}
    </AppSidebarLayout>
  );
}
