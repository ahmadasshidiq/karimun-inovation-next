"use client";

import Link from "next/link";
import { ExternalLink, FilePenLine, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateId } from "@/lib/helper/date";

import {
  assessmentStatusBadges,
  formatScore,
  type AssessedInnovationDto,
  type AssessmentResult,
} from "../page.config";

type AssessedInnovationPreviewProps = {
  innovation: AssessedInnovationDto;
  onClose: () => void;
};

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function ResultCard({
  title,
  icon: Icon,
  result,
}: {
  title: string;
  icon: LucideIcon;
  result: AssessmentResult | null;
}) {
  const badge = result ? assessmentStatusBadges[result.status] : null;

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Icon className="size-4 text-slate-500" />
          {title}
        </p>
        {badge ? (
          <Badge className={badge.className}>{badge.label}</Badge>
        ) : (
          <span className="text-xs text-slate-400">Belum diajukan</span>
        )}
      </div>
      {result ? (
        <div className="mt-3 space-y-2 text-xs text-slate-600">
          {result.periodName ? <p>Periode: {result.periodName}</p> : null}
          <p>Diajukan: {formatDateId(result.submittedAt)}</p>
          <p>
            Diverifikasi:{" "}
            {result.reviewedAt ? formatDateId(result.reviewedAt) : "Belum"}
          </p>
          {result.reviewNote ? (
            <p className="rounded-lg bg-slate-50 p-2 text-slate-700">
              {result.reviewNote}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function AssessedInnovationPreview({
  innovation,
  onClose,
}: AssessedInnovationPreviewProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-3xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="pr-8 text-lg font-bold">
            {innovation.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {innovation.institution}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-170px)] space-y-6 overflow-y-auto px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoItem label="Tahapan" value={innovation.stage} />
            <InfoItem label="Bentuk Inovasi" value={innovation.innovationForm} />
            <InfoItem
              label="Skor Kematangan"
              value={formatScore(innovation.score)}
            />
            <InfoItem label="Inisiator" value={innovation.initiatorName} />
            <InfoItem
              label="Urusan Pemerintahan"
              value={innovation.governmentAffairs}
            />
            <InfoItem
              label="Waktu Penerapan"
              value={formatDateId(innovation.implementationPeriod)}
            />
          </div>

          {innovation.description ? (
            <div>
              <p className="text-xs text-slate-500">Deskripsi</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
                {innovation.description}
              </p>
            </div>
          ) : null}

          <div>
            <p className="mb-3 text-sm font-bold text-slate-900">
              Hasil Penilaian
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard
                title="Perjanjian Kinerja"
                icon={FilePenLine}
                result={innovation.contract}
              />
              <ResultCard
                title="Lomba Inovasi"
                icon={Trophy}
                result={innovation.competition}
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
            Tutup
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={`/innovations/${innovation.id}`} />}
            className="h-10 gap-2 bg-[#2362ee] px-6 font-semibold text-white hover:bg-blue-700"
          >
            <ExternalLink className="size-4" />
            Buka Detail Inovasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
