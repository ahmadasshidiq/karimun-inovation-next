"use client";

import { Fragment, useState } from "react";
import {
  CircleCheck,
  CircleX,
  ExternalLink,
  FilePlus,
  FileText,
  MessageSquareText,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isMandatoryIndicator } from "@/lib/innovation-indicator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  reviewStatusOptions,
  type IndicatorDocument,
  type IndicatorDto,
  type IndicatorReview,
  type IndicatorReviewValues,
} from "../page.config";
import UploadDocumentDialog from "./upload-document-dialog";

type Props = {
  innovationId: string;
  items: IndicatorDto[];
  selections: Record<number, string>;
  documents: Record<number, IndicatorDocument[]>;
  reviews: Record<number, IndicatorReview>;
  canReview: boolean;
  onReview: (
    indicator: IndicatorDto,
    action: IndicatorReviewValues["action"],
  ) => void;
  onSelect: (id: number, value: string) => void;
  onDocument: (id: number, document: IndicatorDocument) => Promise<boolean>;
  onDeleteDocument: (id: number, document: IndicatorDocument) => void;
};

export default function IndicatorTable({
  innovationId,
  items,
  selections,
  documents,
  reviews,
  canReview,
  onReview,
  onSelect,
  onDocument,
  onDeleteDocument,
}: Props) {
  const [uploadIndicator, setUploadIndicator] = useState<IndicatorDto | null>(null);
  return (
    <div className="w-full overflow-x-auto" dir="ltr">
      <table className="w-full min-w-[860px] table-fixed text-left text-xs text-slate-700">
        <colgroup>
          <col className="w-[5%]" />
          <col className="w-[25%]" />
          <col className="w-[35%]" />
          <col className="w-[10%]" />
          <col className="w-[25%]" />
        </colgroup>
        <thead>
          <tr className="border-b-2 border-slate-200">
            {["No", "Indikator", "Keterangan", "Bobot", "Parameter"].map(
              (title) => (
                <th
                  key={title}
                  className="px-3 py-5 text-[12px] font-semibold text-slate-700"
                >
                  {title}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const selectedParameter = selections[item.id];
            const review = reviews[item.id];
            const reviewStatus = reviewStatusOptions.find(
              (option) => option.value === review?.status,
            );
            const isRejected = review?.status === "REJECTED";

            return (
              <Fragment key={item.id}>
                <tr className="border-b border-slate-200 align-middle hover:bg-slate-50/70">
                  <td className="px-3 py-5 align-middle font-semibold leading-5">
                    {item.id}
                  </td>
                  <td className="px-3 py-5 align-middle font-semibold leading-5">
                    {item.indicator}
                    {isMandatoryIndicator(item.id) ? (
                      <span className="text-red-500"> *</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-5 align-middle leading-5">{item.description}</td>
                  <td className="px-3 py-5 align-middle font-semibold">
                    {isRejected ? (
                      <>
                        <span className="text-slate-400 line-through">
                          {item.weight.toFixed(2)}
                        </span>
                        <span className="block text-red-600">0.00</span>
                      </>
                    ) : (
                      <span className="text-blue-600">
                        {item.weight.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-5 align-middle">
                    <Select
                      value={selectedParameter || ""}
                      onValueChange={(value) =>
                        value && onSelect(item.id, value)
                      }
                    >
                      <SelectTrigger className="h-10! w-full bg-white text-xs leading-5">
                        <SelectValue placeholder="Pilih parameter" />
                      </SelectTrigger>
                      <SelectContent
                        align="end"
                        alignItemWithTrigger={false}
                        className="w-[min(36rem,calc(100vw-2rem))] max-w-none border border-slate-200 bg-white p-1 text-slate-900 shadow-lg"
                      >
                        {item.parameters.map((parameter) => (
                          <SelectItem
                            key={parameter}
                            value={parameter}
                            className="items-start rounded-md border-0 border-b border-slate-100 bg-white px-3 py-3 pr-9 text-slate-700 shadow-none last:border-b-0 hover:bg-slate-50 focus:bg-blue-50 focus:text-blue-700 focus:[&_*]:!text-blue-700 [&>span:first-child]:min-w-0 [&>span:first-child]:shrink [&>span:first-child]:whitespace-normal"
                          >
                            <span className="block max-w-full whitespace-normal break-words leading-5">
                              {parameter}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>

                {selectedParameter && (
                  <tr className="border-b border-blue-100 bg-blue-50/40">
                    <td colSpan={5} className="px-4 py-5">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2 rounded-xl border border-blue-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
                              Parameter Terpilih
                            </p>
                            <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                              {selectedParameter}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center gap-2">
                            {reviewStatus && (documents[item.id] ?? []).length > 0 ? (
                              <Badge className={reviewStatus.className}>
                                {reviewStatus.label}
                              </Badge>
                            ) : null}
                            <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600">
                              {item.fileTypes}
                            </span>
                          </div>
                        </div>

                        {review?.note ? (
                          <div
                            className={
                              isRejected
                                ? "flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                                : "flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                            }
                          >
                            <MessageSquareText
                              className={
                                isRejected
                                  ? "mt-0.5 size-4 shrink-0 text-red-600"
                                  : "mt-0.5 size-4 shrink-0 text-emerald-600"
                              }
                            />
                            <div className="min-w-0">
                              <p
                                className={
                                  isRejected
                                    ? "text-[10px] font-bold uppercase tracking-wide text-red-600"
                                    : "text-[10px] font-bold uppercase tracking-wide text-emerald-600"
                                }
                              >
                                Catatan Verifikator
                              </p>
                              <p className="mt-1 whitespace-pre-line text-xs leading-6 text-slate-700">
                                {review.note}
                              </p>
                              {review.reviewedBy ? (
                                <p className="mt-1 text-[11px] text-slate-500">
                                  {review.reviewedBy}
                                  {review.reviewedAt
                                    ? ` · ${new Date(review.reviewedAt).toLocaleString("id-ID")}`
                                    : ""}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ) : null}

                        <div className="flex flex-col items-start gap-4 rounded-xl border border-blue-100 bg-white p-4">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                              Data Pendukung
                            </p>
                            <p className="mt-2 text-xs leading-6 text-slate-600">
                              {item.supportingData}
                            </p>
                          </div>
                          {(documents[item.id] ?? []).length > 0 && (
                            <div className="w-full space-y-2">
                              {(documents[item.id] ?? []).map((document, index) => (
                                <div
                                  key={document.id || `${document.file?.name}-${document.file?.lastModified}-${index}`}
                                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
                                >
                                  <FileText className="size-4 shrink-0 text-blue-600" />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-800">
                                      {document.documentTitle}
                                    </p>
                                    <p className="truncate text-[11px] text-slate-500">
                                      {document.originalName || document.file?.name || "Dokumen"}
                                      {document.documentNumber
                                        ? ` · ${document.documentNumber} - ${document.documentDate}`
                                        : ""}
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    nativeButton={false}
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-blue-600 hover:bg-blue-50 hover:text-white"
                                    render={
                                      <a
                                        href={`/api/innovations/${innovationId}/indicators/${item.id}/documents/${document.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="Lihat dokumen"
                                      />
                                    }
                                  >
                                    <ExternalLink />
                                    <span className="sr-only">Lihat dokumen</span>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-red-500 hover:bg-red-50 hover:text-white"
                                    onClick={() => onDeleteDocument(item.id, document)}
                                  >
                                    <Trash2 />
                                    <span className="sr-only">Hapus dokumen</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex w-full flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="min-h-9 max-w-full border-blue-200 bg-blue-50 px-3 py-2 font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                              onClick={() => setUploadIndicator(item)}
                            >
                              <FilePlus className="size-3.5 shrink-0" />
                              <span className="truncate">Upload Dokumen</span>
                            </Button>
                            {canReview && (documents[item.id] ?? []).length > 0 ? (
                              <div className="flex flex-wrap gap-2 sm:ml-auto">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={review?.status === "APPROVED"}
                                  className="min-h-9 border-emerald-200 bg-emerald-50 px-3 font-semibold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                                  onClick={() => onReview(item, "approve")}
                                >
                                  <CircleCheck className="size-3.5" />
                                  Setujui
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="min-h-9 border-red-200 bg-red-50 px-3 font-semibold text-red-600 hover:bg-red-100 hover:text-red-700"
                                  onClick={() => onReview(item, "reject")}
                                >
                                  <CircleX className="size-3.5" />
                                  {isRejected ? "Ubah Catatan" : "Tolak"}
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <UploadDocumentDialog
        key={uploadIndicator?.id ?? "closed-upload-dialog"}
        indicator={uploadIndicator}
        onClose={() => setUploadIndicator(null)}
        onSave={async (document) => {
          if (!uploadIndicator) return;
          if (await onDocument(uploadIndicator.id, document)) {
            setUploadIndicator(null);
          }
        }}
      />
    </div>
  );
}
