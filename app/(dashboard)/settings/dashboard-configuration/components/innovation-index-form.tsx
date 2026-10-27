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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  predicateOptions,
  type InnovationIndexDto,
  type InnovationIndexFormValues,
} from "../page.config";

type InnovationIndexFormProps = {
  open: boolean;
  initialData?: InnovationIndexDto;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: InnovationIndexFormValues) => void | Promise<void>;
};

export default function InnovationIndexForm({
  open,
  initialData,
  saving,
  onClose,
  onSubmit,
}: InnovationIndexFormProps) {
  const [form, setForm] = useState<InnovationIndexFormValues>({
    year: initialData ? String(initialData.year) : "",
    score: initialData ? String(initialData.score) : "",
    predicate: initialData?.predicate || "",
  });
  const setField = (key: keyof InnovationIndexFormValues, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const requiredComplete = form.year.trim() && form.score.trim();

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-2xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            {initialData ? "Edit Nilai Indeks" : "Tambah Nilai Indeks"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Isi sesuai hasil Indeks Inovasi Daerah dari Kemendagri.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Tahun" required>
              <Input
                type="number"
                inputMode="numeric"
                value={form.year}
                onChange={(event) => setField("year", event.target.value)}
                placeholder="Contoh: 2025"
                className="h-11 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Nilai Indeks" required>
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={form.score}
                onChange={(event) => setField("score", event.target.value)}
                placeholder="Contoh: 52.34"
                className="h-11 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Predikat">
              <Select
                value={form.predicate}
                onValueChange={(value) => setField("predicate", value || "")}
              >
                <SelectTrigger className="h-11! w-full border-slate-300 bg-white px-3">
                  <SelectValue>{form.predicate || "Pilih predikat"}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900">
                  {predicateOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                : "Simpan Nilai Indeks"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </Label>
      {children}
    </div>
  );
}
