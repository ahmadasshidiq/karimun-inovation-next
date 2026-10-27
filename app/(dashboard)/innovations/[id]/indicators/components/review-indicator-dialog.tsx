"use client";

import { useState } from "react";
import { CircleCheck, CircleX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { IndicatorDto, IndicatorReviewValues } from "../page.config";

type Props = {
  open: boolean;
  indicator: IndicatorDto;
  action: IndicatorReviewValues["action"];
  initialNote?: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: IndicatorReviewValues) => void | Promise<void>;
};

export default function ReviewIndicatorDialog({
  open,
  indicator,
  action,
  initialNote,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const [note, setNote] = useState(initialNote || "");
  const isReject = action === "reject";
  const requiredComplete = !isReject || Boolean(note.trim());

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            {isReject ? (
              <CircleX className="size-5 text-red-600" />
            ) : (
              <CircleCheck className="size-5 text-emerald-600" />
            )}
            {isReject ? "Tolak Indikator" : "Setujui Indikator"}
          </DialogTitle>
          <DialogDescription>
            {isReject
              ? `Bobot ${indicator.weight.toFixed(2)} pada indikator "${indicator.indicator}" tidak dihitung sampai dokumen diperbaiki.`
              : `Bobot ${indicator.weight.toFixed(2)} pada indikator "${indicator.indicator}" tetap dihitung.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 px-6 py-2 text-slate-900">
          <Label
            htmlFor="indicator-review-note"
            className="font-semibold text-slate-700"
          >
            Catatan {isReject ? <span className="text-red-500">*</span> : null}
          </Label>
          <Textarea
            id="indicator-review-note"
            className="min-h-28 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            placeholder={
              isReject
                ? "Jelaskan dokumen yang belum sesuai dan perbaikan yang diperlukan"
                : "Catatan tambahan (opsional)"
            }
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
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
            disabled={saving || !requiredComplete}
            onClick={() => void onSubmit({ action, note: note.trim() })}
            className={
              isReject
                ? "h-10 bg-red-600 px-5 text-white hover:bg-red-700 disabled:bg-slate-300 disabled:text-slate-600 disabled:opacity-100"
                : "h-10 bg-blue-600 px-5 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-600 disabled:opacity-100"
            }
          >
            {isReject ? <CircleX /> : <CircleCheck />}
            {saving ? "Menyimpan..." : isReject ? "Tolak Indikator" : "Setujui Indikator"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
