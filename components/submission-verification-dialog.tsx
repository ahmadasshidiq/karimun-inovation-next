"use client";

import { useState } from "react";
import { CircleCheck, Undo2 } from "lucide-react";

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
import { cn } from "@/lib/utils";

export type VerificationDecision = "accept" | "return";

export type VerificationValues = {
  decision: VerificationDecision;
  note: string;
};

type SubmissionVerificationDialogProps = {
  open: boolean;
  innovationName: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: VerificationValues) => void | Promise<void>;
};

const decisionOptions = [
  {
    value: "accept",
    label: "Terima",
    description: "Pengajuan memenuhi syarat dan diproses lebih lanjut.",
    icon: CircleCheck,
    activeClass: "border-emerald-500 bg-emerald-50 text-emerald-700",
  },
  {
    value: "return",
    label: "Kembalikan",
    description: "Pengajuan perlu diperbaiki lalu dapat dikirim ulang.",
    icon: Undo2,
    activeClass: "border-amber-500 bg-amber-50 text-amber-700",
  },
] as const;

export default function SubmissionVerificationDialog({
  open,
  innovationName,
  saving,
  onClose,
  onSubmit,
}: SubmissionVerificationDialogProps) {
  const [form, setForm] = useState<VerificationValues>({
    decision: "accept",
    note: "",
  });
  const noteRequired = form.decision === "return";
  const requiredComplete = !noteRequired || Boolean(form.note.trim());

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-2xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            Verifikasi Pengajuan
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {innovationName}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {decisionOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    decision: option.value,
                  }))
                }
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                  form.decision === option.value
                    ? option.activeClass
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                <option.icon className="mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="block text-sm font-bold">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {option.description}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">
              Catatan{" "}
              {noteRequired ? <span className="text-red-500">*</span> : null}
            </Label>
            <Textarea
              value={form.note}
              onChange={(event) =>
                setForm((current) => ({ ...current, note: event.target.value }))
              }
              placeholder={
                noteRequired
                  ? "Jelaskan bagian yang perlu diperbaiki"
                  : "Catatan untuk pengusul (opsional)"
              }
              className="min-h-28 resize-y border-slate-300 bg-white"
            />
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
            onClick={() =>
              void onSubmit({ decision: form.decision, note: form.note.trim() })
            }
            className="h-10 bg-[#2362ee] px-6 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Menyimpan..." : "Simpan Verifikasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
