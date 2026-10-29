"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type InnovationVideoProps = {
  title: string;
  video: { url: string | null; posterUrl: string | null } | null;
};

export default function InnovationVideo({ title, video }: InnovationVideoProps) {
  const [open, setOpen] = useState(false);

  if (!video) return <span className="text-slate-400">-</span>;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${video.url ? "Putar video" : "Lihat gambar"} ${title}`}
        className="group relative flex h-12 w-20 items-center justify-center overflow-hidden rounded-lg bg-slate-800"
      >
        {video.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL presigned dari MinIO, bukan aset statis.
          <img
            src={video.posterUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        {video.url ? (
          <span className="relative flex size-7 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition-transform group-hover:scale-110">
            <Play className="size-3.5 fill-current" />
          </span>
        ) : null}
      </button>

      {open ? (
        <Dialog open onOpenChange={(nextOpen) => !nextOpen && setOpen(false)}>
          <DialogContent className="w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-4xl">
            <DialogHeader className="border-b border-slate-200 px-6 py-4">
              <DialogTitle className="pr-8 text-lg font-bold">{title}</DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Video inovasi daerah
              </DialogDescription>
            </DialogHeader>
            <div className="bg-black">
              {video.url ? (
                <video
                  src={video.url}
                  poster={video.posterUrl ?? undefined}
                  controls
                  autoPlay
                  className="aspect-video max-h-[70vh] w-full"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- URL presigned dari MinIO, bukan aset statis.
                <img
                  src={video.posterUrl ?? undefined}
                  alt={title}
                  className="max-h-[70vh] w-full object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
