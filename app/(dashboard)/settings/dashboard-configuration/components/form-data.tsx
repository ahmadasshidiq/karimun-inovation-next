"use client";

import { CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import type { DashboardConfigurationDto } from "../page.config";

export default function FormData({
  value,
  saving,
  onChange,
  onSubmit,
}: {
  value: DashboardConfigurationDto;
  saving: boolean;
  onChange: (value: DashboardConfigurationDto) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <CalendarClock className="size-5" />
        </span>
        <div>
          <h2 className="font-bold text-neutral-900">
            Hitungan Mundur Pengisian Indeks
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Atur batas waktu yang tampil pada banner dashboard.
          </p>
        </div>
      </div>
      <div className="max-w-2xl space-y-5">
        <div className="space-y-2">
          <Label htmlFor="countdown-target" className="font-semibold">
            Tanggal dan Waktu Target *
          </Label>
          <Input
            id="countdown-target"
            type="datetime-local"
            value={value.countdownTarget}
            onChange={(event) =>
              onChange({ ...value, countdownTarget: event.target.value })
            }
            className="h-11"
          />
        </div>
        <Label
          htmlFor="countdown-active"
          className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-slate-50 p-4"
        >
          <span>
            <span className="block text-sm font-semibold text-neutral-900">
              Aktifkan hitungan mundur
            </span>
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Jika dinonaktifkan, banner hitungan mundur tidak ditampilkan di
              dashboard.
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span
              className={
                value.countdownActive
                  ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                  : "rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600"
              }
            >
              {value.countdownActive ? "Aktif" : "Nonaktif"}
            </span>
            <Checkbox
              id="countdown-active"
              checked={value.countdownActive}
              onCheckedChange={(checked) =>
                onChange({ ...value, countdownActive: checked === true })
              }
              className="size-6 border-2 border-slate-400 bg-white shadow-sm data-checked:border-blue-600 data-checked:bg-blue-600 data-checked:text-white"
            />
          </span>
        </Label>
        <Button
          onClick={onSubmit}
          disabled={saving || !value.countdownTarget}
          className="h-10 bg-[#2362ee] px-5 !text-white hover:bg-blue-700 hover:!text-white disabled:!text-white"
        >
          {saving ? "Menyimpan..." : "Simpan Konfigurasi"}
        </Button>
      </div>
    </section>
  );
}
