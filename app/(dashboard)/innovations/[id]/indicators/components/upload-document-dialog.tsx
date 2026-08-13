"use client";

import { useRef, useState } from "react";
import { FileText, FileUp, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { IndicatorDocument, IndicatorDto } from "../page.config";

type Props = {
  indicator: IndicatorDto | null;
  onClose: () => void;
  onSave: (document: IndicatorDocument) => void;
};

const emptyDocument: IndicatorDocument = {
  documentNumber: "",
  documentDate: "",
  documentTitle: "",
};

export default function UploadDocumentDialog({
  indicator,
  onClose,
  onSave,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<IndicatorDocument>(emptyDocument);

  return (
    <Dialog open={Boolean(indicator)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Upload className="size-5 text-blue-600" />
            Upload Dokumen Pendukung
          </DialogTitle>
          <DialogDescription>
            Lengkapi informasi dokumen untuk indikator {indicator?.indicator}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-2 text-slate-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="document-number" className="font-semibold text-slate-700">
                Nomor Surat / Dokumen
              </Label>
              <Input
                id="document-number"
                className="h-10 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                placeholder="Masukkan nomor dokumen"
                value={form.documentNumber}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    documentNumber: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-date" className="font-semibold text-slate-700">
                Tanggal Surat / Dokumen
              </Label>
              <Input
                id="document-date"
                type="date"
                className="h-10 border-slate-300 bg-white text-slate-900 [color-scheme:light]"
                value={form.documentDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    documentDate: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-title" className="font-semibold text-slate-700">
              Tentang / Judul Dokumen
            </Label>
            <Input
              id="document-title"
              className="h-10 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              placeholder="Contoh: SK Penetapan Inovasi"
              value={form.documentTitle}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  documentTitle: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
                  Pilih Dokumen
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Format yang didukung: {indicator?.fileTypes}
                </p>
                <p className="mt-1 text-[11px] text-blue-600">
                  Satu dokumen hanya menggunakan satu file.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-9 border-blue-200 bg-white text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                onClick={() => inputRef.current?.click()}
              >
                <FileUp />
                Pilih File
              </Button>
              <Input
                ref={inputRef}
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) => {
                  const selectedFile = event.currentTarget.files?.[0];
                  setForm((current) => ({
                    ...current,
                    file: selectedFile,
                  }));
                }}
              />
            </div>

            {form.file && (
              <div className="space-y-2 border-t border-blue-100 pt-3">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <FileText className="size-4 shrink-0 text-blue-600" />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                    {form.file.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-slate-200 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-slate-300 bg-white px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            className="h-10 bg-blue-600 px-5 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-600 disabled:opacity-100"
            disabled={!form.documentTitle.trim() || !form.file}
            onClick={() => form.file && onSave(form)}
          >
            <Upload />
            Simpan Dokumen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
