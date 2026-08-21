"use client";

import { Fragment, useState } from "react";
import { ExternalLink, FilePlus, FileText, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { IndicatorDto } from "../page.config";
import type { IndicatorDocument } from "../page.config";
import UploadDocumentDialog from "./upload-document-dialog";

type Props = {
  innovationId: string;
  items: IndicatorDto[];
  selections: Record<number, string>;
  documents: Record<number, IndicatorDocument[]>;
  onSelect: (id: number, value: string) => void;
  onDocument: (id: number, document: IndicatorDocument) => Promise<boolean>;
  onDeleteDocument: (id: number, document: IndicatorDocument) => void;
};

export default function IndicatorTable({
  innovationId,
  items,
  selections,
  documents,
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

            return (
              <Fragment key={item.id}>
                <tr className="border-b border-slate-200 align-middle hover:bg-slate-50/70">
                  <td className="px-3 py-5 align-middle font-semibold leading-5">
                    {item.id}
                  </td>
                  <td className="px-3 py-5 align-middle font-semibold leading-5">
                    {item.indicator}
                  </td>
                  <td className="px-3 py-5 align-middle leading-5">{item.description}</td>
                  <td className="px-3 py-5 align-middle font-semibold text-blue-600">
                    {item.weight.toFixed(2)}
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
                          <span className="inline-flex w-fit shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600">
                            {item.fileTypes}
                          </span>
                        </div>

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
                          <Button
                            type="button"
                            variant="outline"
                            className="min-h-9 max-w-full border-blue-200 bg-blue-50 px-3 py-2 font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                            onClick={() => setUploadIndicator(item)}
                          >
                            <FilePlus className="size-3.5 shrink-0" />
                            <span className="truncate">Upload Dokumen</span>
                          </Button>
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
