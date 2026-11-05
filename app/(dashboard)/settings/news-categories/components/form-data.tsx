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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { NewsCategoryDto, NewsCategoryFormValues } from "../page.config";

type FormDataProps = {
  open: boolean;
  initialData?: NewsCategoryDto;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: NewsCategoryFormValues) => void | Promise<void>;
};

export default function FormData({
  open,
  initialData,
  saving,
  onClose,
  onSubmit,
}: FormDataProps) {
  const [form, setForm] = useState<NewsCategoryFormValues>({
    name: initialData?.name || "",
    isActive: initialData?.isActive ?? true,
  });

  const requiredComplete = Boolean(form.name.trim());

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            {initialData ? "Edit Kategori Berita" : "Tambah Kategori Berita"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Kategori digunakan untuk mengelompokkan Berita dan Agenda.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label className="font-semibold text-slate-700">
                Nama Kategori <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Contoh: Pelayanan Publik"
                className="h-11 border-slate-300 bg-white"
              />
            </div>

            {initialData ? (
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.isActive ? "ACTIVE" : "INACTIVE"}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      isActive: value === "ACTIVE",
                    }))
                  }
                >
                  <SelectTrigger className="h-11! w-full border-slate-300 bg-white px-3">
                    <SelectValue>
                      {form.isActive ? "Aktif" : "Tidak Aktif"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white text-slate-900">
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
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
            onClick={() => void onSubmit({ ...form, name: form.name.trim() })}
            className="h-10 bg-[#2362ee] px-6 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving
              ? "Menyimpan..."
              : initialData
                ? "Simpan Perubahan"
                : "Simpan Kategori"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
