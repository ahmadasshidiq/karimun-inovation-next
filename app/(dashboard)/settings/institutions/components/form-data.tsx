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
import { Textarea } from "@/components/ui/textarea";

import type {
  InstitutionDto,
  InstitutionFormValues,
  InstitutionOptionDto,
} from "../page.config";

type FormDataProps = {
  open: boolean;
  initialData?: InstitutionDto;
  nomenclatures: InstitutionOptionDto[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: InstitutionFormValues) => void | Promise<void>;
};

export default function FormData({
  open,
  initialData,
  nomenclatures,
  saving,
  onClose,
  onSubmit,
}: FormDataProps) {
  const [form, setForm] = useState<InstitutionFormValues>({
    name: initialData?.name || "",
    type: initialData?.type || "",
    nomenclatureId: initialData?.nomenclature?.id || "",
    address: initialData?.address || "",
  });
  const setField = (key: keyof InstitutionFormValues, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const requiredComplete =
    form.name.trim() && form.type.trim() && form.nomenclatureId;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-3xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            {initialData ? "Edit Instansi" : "Tambah Instansi"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Lengkapi informasi instansi dan nomenklatur yang terkait.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 gap-5">
            <FormField label="Nama Instansi" required>
              <Input
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="Masukkan nama instansi"
                className="h-11 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Tipe Instansi" required>
              <Input
                value={form.type}
                onChange={(event) => setField("type", event.target.value)}
                placeholder="Masukkan tipe instansi"
                className="h-11 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Nomenklatur" required>
              <Select
                value={form.nomenclatureId}
                onValueChange={(value) => setField("nomenclatureId", value || "")}
              >
                <SelectTrigger className="h-11! w-full border-slate-300 bg-white px-3">
                  <SelectValue>
                    {nomenclatures.find(
                      (item) => item.id === form.nomenclatureId,
                    )?.name || "Pilih nomenklatur"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900">
                  {nomenclatures.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Alamat">
              <Textarea
                value={form.address}
                onChange={(event) => setField("address", event.target.value)}
                placeholder="Masukkan alamat instansi"
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
                : "Simpan Instansi"}
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
