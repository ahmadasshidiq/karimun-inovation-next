"use client";

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
  formatActionLabel,
  formatDateTimeId,
  type ActivityLogDto,
} from "../page.config";

type LogDetailProps = {
  open: boolean;
  log: ActivityLogDto;
  onClose: () => void;
};

export default function LogDetail({ open, log, onClose }: LogDetailProps) {
  const rows = [
    { label: "Waktu", value: formatDateTimeId(log.createdAt) },
    {
      label: "Pengguna",
      value: log.user ? `${log.user.fullname} (${log.user.username})` : "-",
    },
    { label: "Aktivitas", value: formatActionLabel(log.action) },
    { label: "Kode Aktivitas", value: log.action },
    { label: "Modul", value: log.entity },
    { label: "ID Data", value: log.entityId || "-" },
    { label: "Alamat IP", value: log.ipAddress || "-" },
    { label: "Perangkat", value: log.userAgent || "-" },
  ];

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-2xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            Detail Log Aktivitas
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Rekaman aktivitas bersifat permanen dan tidak dapat diubah.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-6">
          <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-[160px_1fr]">
            {rows.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-sm font-semibold text-slate-600">
                  {row.label}
                </dt>
                <dd className="break-all text-sm text-slate-900">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          {log.metadata ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-600">Metadata</p>
              <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          ) : null}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
