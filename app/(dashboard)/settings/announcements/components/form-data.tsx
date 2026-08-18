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

import type {
  AnnouncementDto,
  AnnouncementFormValues,
  AnnouncementStatus,
} from "../page.config";
import RichTextEditor from "./rich-text-editor";

type FormDataProps = {
  open: boolean;
  initialData?: AnnouncementDto;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: AnnouncementFormValues) => void;
};

export default function FormData({
  open,
  initialData,
  saving,
  onClose,
  onSubmit,
}: FormDataProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [announcementDate, setAnnouncementDate] = useState(
    initialData?.announcementDate || "",
  );
  const [status, setStatus] = useState<AnnouncementStatus>(
    initialData?.status || "ACTIVE",
  );
  const hasContent =
    Boolean(content.replace(/<[^>]*>/g, "").trim()) ||
    /<(img|video)\b/i.test(content);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-3xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            {initialData ? "Edit Pengumuman" : "Tambah Pengumuman"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Lengkapi informasi yang akan ditampilkan pada dashboard.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ title, content, announcementDate, status });
          }}
          className="contents"
        >
          <div className="max-h-[calc(90vh-190px)] space-y-4 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="announcement-title"
                className="text-sm font-semibold text-slate-700"
              >
                Judul Pengumuman <span className="text-red-500">*</span>
              </Label>
              <Input
                id="announcement-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Masukkan judul pengumuman"
                required
                className="h-10 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Deskripsi Pengumuman <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor value={content} onChange={setContent} />
              <p className="text-xs text-slate-500">
                Gunakan toolbar untuk format teks, daftar, tautan, gambar, atau video.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="announcement-date"
                  className="text-sm font-semibold text-slate-700"
                >
                  Tanggal <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="announcement-date"
                  type="date"
                  value={announcementDate}
                  onChange={(event) => setAnnouncementDate(event.target.value)}
                  required
                  className="h-10 border-slate-300 bg-white text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    value && setStatus(value as AnnouncementStatus)
                  }
                >
                  <SelectTrigger className="h-10! w-full border-slate-300 bg-white px-3 text-slate-900">
                    <SelectValue>
                      {status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white text-slate-900">
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-slate-200 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 border-blue-600 bg-white px-5 font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving || !hasContent}
              className="h-10 bg-[#2362ee] px-5 font-semibold text-white hover:bg-blue-700"
            >
              {saving ? "Menyimpan..." : "Simpan Pengumuman"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
