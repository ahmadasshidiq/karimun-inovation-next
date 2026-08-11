"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InnovationFormValues } from "../page.config";

type FormDataProps = {
  isOpen: boolean;
  values: InnovationFormValues;
  onChange: (field: keyof InnovationFormValues, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const fieldClass =
  "h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

type FormSelectProps = {
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
};

function FormSelect({ value, options, onValueChange }: FormSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => nextValue && onValueChange(nextValue)}
    >
      <SelectTrigger className="h-10! w-full rounded-lg border-neutral-300 bg-white px-3 text-sm text-neutral-900 dark:bg-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white text-neutral-900">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function FormData({
  isOpen,
  values,
  onChange,
  onClose,
  onSubmit,
}: FormDataProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white p-6 text-neutral-900 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Tambah Inovasi
          </DialogTitle>
          <DialogDescription>
            Lengkapi informasi inovasi perangkat daerah.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold">Nama Inovasi</span>
            <input
              required
              value={values.innovationName}
              onChange={(event) =>
                onChange("innovationName", event.target.value)
              }
              className={fieldClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold">
              Organisasi Perangkat Daerah
            </span>
            <FormSelect
              value={values.organization}
              options={[
                "Badan Pendapatan Daerah",
                "Dinas Komunikasi dan Informatika",
              ]}
              onValueChange={(value) => onChange("organization", value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold">Bentuk Inovasi</span>
            <FormSelect
              value={values.innovationForm}
              options={["Digital", "Non Digital"]}
              onValueChange={(value) => onChange("innovationForm", value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold">Urusan Pemerintahan</span>
            <FormSelect
              value={values.governmentAffair}
              options={["Keuangan", "Pendidikan", "Kesehatan"]}
              onValueChange={(value) => onChange("governmentAffair", value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold">Nama Inisiator</span>
            <input
              required
              value={values.initiator}
              onChange={(event) => onChange("initiator", event.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold">Tahapan Inovasi</span>
            <FormSelect
              value={values.stage}
              options={["Inisiatif", "Uji Coba", "Penerapan"]}
              onValueChange={(value) => onChange("stage", value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold">Waktu Uji Coba</span>
            <input
              type="date"
              required
              value={values.trialDate}
              onChange={(event) => onChange("trialDate", event.target.value)}
              className={fieldClass}
            />
          </label>
          <DialogFooter className="mt-2 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 px-5"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="h-9 bg-[#2362ee] px-5 text-white hover:bg-blue-700"
            >
              Simpan Inovasi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
