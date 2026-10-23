"use client";

import { useState, type ReactNode } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type {
  CompetitionPeriodDto,
  CompetitionPeriodFormValues,
} from "../page.config";

type FormDataProps = {
  open: boolean;
  initialData?: CompetitionPeriodDto;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: CompetitionPeriodFormValues) => void | Promise<void>;
};

export default function FormData({
  open,
  initialData,
  saving,
  onClose,
  onSubmit,
}: FormDataProps) {
  const [form, setForm] = useState<CompetitionPeriodFormValues>({
    name: initialData?.name || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    description: initialData?.description || "",
  });
  const setField = (key: keyof CompetitionPeriodFormValues, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const dateInvalid =
    Boolean(form.startDate && form.endDate) && form.startDate > form.endDate;
  const requiredComplete =
    form.name.trim() && form.startDate && form.endDate && !dateInvalid;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-3xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            {initialData ? "Edit Periode Lomba" : "Tambah Periode Lomba"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Pengajuan Lomba Inovasi hanya dapat dilakukan di antara tanggal buka
            dan tanggal tutup.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Nama Periode" required className="sm:col-span-2">
              <Input
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="Contoh: Lomba Inovasi Daerah 2026"
                className="h-11 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Tanggal Buka" required>
              <Input
                type="date"
                value={form.startDate}
                onChange={(event) => setField("startDate", event.target.value)}
                className="h-11 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Tanggal Tutup" required>
              <Input
                type="date"
                value={form.endDate}
                min={form.startDate || undefined}
                onChange={(event) => setField("endDate", event.target.value)}
                className="h-11 border-slate-300 bg-white"
              />
              {dateInvalid ? (
                <p className="text-xs font-medium text-red-500">
                  Tanggal tutup tidak boleh sebelum tanggal buka.
                </p>
              ) : null}
            </FormField>
            <FormField label="Keterangan" className="sm:col-span-2">
              <Textarea
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                placeholder="Masukkan keterangan periode lomba"
                className="min-h-28 resize-y border-slate-300 bg-white"
              />
            </FormField>
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
            {saving
              ? "Menyimpan..."
              : initialData
                ? "Simpan Perubahan"
                : "Simpan Periode"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="font-semibold text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </Label>
      {children}
    </div>
  );
}
