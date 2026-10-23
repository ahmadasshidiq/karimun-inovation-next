"use client";

import { useState } from "react";

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

import type { NomenclatureDto, NomenclatureFormValues } from "../page.config";

type FormDataProps = {
  open: boolean;
  initialData?: NomenclatureDto;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: NomenclatureFormValues) => void | Promise<void>;
};

export default function FormData({
  open,
  initialData,
  saving,
  onClose,
  onSubmit,
}: FormDataProps) {
  const [form, setForm] = useState<NomenclatureFormValues>({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });
  const setField = (key: keyof NomenclatureFormValues, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-3xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            {initialData ? "Edit Nomenklatur" : "Tambah Nomenklatur"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Lengkapi informasi nomenklatur yang akan digunakan pada data
            instansi.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">
                Nama Nomenklatur <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="Masukkan nama nomenklatur"
                className="h-11 border-slate-300 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">Deskripsi</Label>
              <Textarea
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                placeholder="Masukkan deskripsi nomenklatur"
                className="min-h-28 resize-y border-slate-300 bg-white"
              />
            </div>
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
            disabled={saving || !form.name.trim()}
            onClick={() => void onSubmit(form)}
            className="h-10 bg-[#2362ee] px-6 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving
              ? "Menyimpan..."
              : initialData
                ? "Simpan Perubahan"
                : "Simpan Nomenklatur"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
