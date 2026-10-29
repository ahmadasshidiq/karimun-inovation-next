"use client";

import { useState, type ReactNode } from "react";
import { Clock3, Mail, Megaphone } from "lucide-react";

import {
  innovationColumnFormats,
  getStatistics,
  renderInnovationActions,
  type AnnouncementItem,
  type DashboardInnovationDto,
  type InnovationIndexPoint,
  type InnovationYearPoint,
  type CountdownValue,
  type DashboardSummary,
} from "../page.config";
import { AppPageHeader, useSessionUser } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InnovationIndexChart, InnovationYearChart } from "./innovation-charts";

type DashboardContentProps = {
  countdown: CountdownValue;
  summary: DashboardSummary;
  announcements: AnnouncementItem[];
  countdownActive: boolean;
  innovationIndex: InnovationIndexPoint[];
  innovationsPerYear: InnovationYearPoint[];
  innovations: {
    items: DashboardInnovationDto[];
    total: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (page: number) => void;
    onPreview: (innovation: DashboardInnovationDto) => void;
    toolbar: ReactNode;
    filterPanel: ReactNode;
  };
};

function CountdownBanner({
  countdown,
  active,
}: {
  countdown: CountdownValue;
  active: boolean;
}) {
  const values = [
    { value: countdown.days, label: "Hari" },
    { value: countdown.hours, label: "Jam" },
    { value: countdown.minutes, label: "Menit" },
    { value: countdown.seconds, label: "Detik" },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-400 bg-gradient-to-br from-[#428df7] via-[#4b62fa] to-[#5013f7] p-4 text-white sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-24 size-56 rounded-full border border-white/15" />
      <div className="pointer-events-none absolute -bottom-24 right-20 size-48 rounded-full bg-white/5" />

      <div className="relative flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 sm:size-11">
            <Clock3 className="size-5" />
          </div>
          <div>
            <h2 className="max-w-72 text-[13px] font-semibold leading-snug sm:text-base">
              Hitungan Mundur Pengisian Indeks Inovasi Daerah
              <div className="mx-2 inline-flex items-center gap-2 rounded-full border border-emerald-200/40 bg-emerald-400/20 px-2.5 py-1 text-[8px] font-semibold">
                <span
                  className={`size-1.5 rounded-full ${active ? "bg-emerald-300" : "bg-slate-300"}`}
                />
                {active ? "AKTIF" : "TIDAK AKTIF"}
              </div>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
          {values.map((item, index) => (
            <div key={item.label} className="relative">
              {index > 0 && (
                <span className="absolute -left-2 top-3 hidden text-lg font-semibold text-white/60 sm:block">
                  :
                </span>
              )}
              <div className="rounded-xl border border-white/20 bg-white/10 px-1 py-2.5 text-center backdrop-blur-sm sm:min-w-16 sm:px-2">
                <div className="text-lg font-bold leading-none tabular-nums sm:text-2xl">
                  {item.value}
                </div>
                <div className="mt-1.5 text-[8px] font-medium text-blue-100 sm:text-[10px]">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatisticsGrid({ summary }: { summary: DashboardSummary }) {
  const statistics = getStatistics(summary);

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {statistics.map((item, index) => {
        const Icon = item.icon;
        return (
          <article
            key={item.title}
            className={`relative min-h-28 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <p className="max-w-[78%] text-[11px] font-semibold leading-tight text-neutral-800 sm:text-[12px]">
              {item.title}
            </p>
            <Icon className="absolute right-3 top-3 size-5 text-neutral-900 sm:right-4 sm:top-4 sm:size-6" />
            <p className="mt-4 text-[32px] font-semibold leading-none tracking-tight text-black sm:mt-3 sm:text-[38px]">
              {item.value}
            </p>
          </article>
        );
      })}
    </section>
  );
}

function AnnouncementPanel({
  announcements,
}: {
  announcements: AnnouncementItem[];
}) {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementItem | null>(null);

  return (
    <section className="flex max-h-[420px] flex-col rounded-xl border border-neutral-200 bg-white p-4 xl:absolute xl:inset-0 xl:max-h-none">
      <h2 className="mb-5 flex shrink-0 items-center gap-2 text-sm font-semibold">
        <Megaphone className="size-5" />
        Pengumuman
      </h2>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {announcements.map((announcement) => (
          <button
            type="button"
            key={announcement.id}
            onClick={() => setSelectedAnnouncement(announcement)}
            className="flex w-full items-center gap-3 rounded-md bg-neutral-100 px-3 py-2.5 text-left transition-colors hover:bg-blue-50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold">
                {announcement.title}
              </p>
              <p className="mt-0.5 text-[10px] text-neutral-500">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(
                  new Date(`${announcement.announcementDate}T00:00:00`),
                )}
              </p>
            </div>
            <Mail className="size-4 shrink-0 text-[#4f71ff]" />
          </button>
        ))}
      </div>
      {announcements.length === 0 && (
        <p className="py-8 text-center text-xs text-slate-500">
          Belum ada pengumuman aktif.
        </p>
      )}
      <Dialog
        open={Boolean(selectedAnnouncement)}
        onOpenChange={(open) => !open && setSelectedAnnouncement(null)}
      >
        <DialogContent className="max-h-[88vh] overflow-hidden bg-white p-0 text-slate-900 sm:max-w-3xl">
          <DialogHeader className="border-b border-slate-200 px-6 py-4">
            <DialogTitle className="pr-8 text-lg font-bold">
              {selectedAnnouncement?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {selectedAnnouncement
                ? new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(
                    new Date(
                      `${selectedAnnouncement.announcementDate}T00:00:00`,
                    ),
                  )
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div
            className="max-h-[calc(88vh-100px)] overflow-y-auto px-6 pt-0 pb-5 text-sm leading-7 text-slate-700 [&>b:first-child]:mb-3 [&>b:first-child]:block [&>strong:first-child]:mb-3 [&>strong:first-child]:block [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:pl-4 [&_div]:my-2 [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3 [&_h4]:font-semibold [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_video]:my-4 [&_video]:max-h-[60vh] [&_video]:max-w-full [&_video]:rounded-xl"
            dangerouslySetInnerHTML={{
              __html: selectedAnnouncement?.content || "",
            }}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function DashboardContent({
  countdown,
  summary,
  announcements,
  countdownActive,
  innovationIndex,
  innovationsPerYear,
  innovations,
}: DashboardContentProps) {
  const { user } = useSessionUser();

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1500px] px-3 py-4 text-neutral-950 sm:px-6 sm:py-5 lg:px-8 lg:py-7">
      <AppPageHeader />

      <div className="mb-5 sm:mb-6">
        <h2 className="text-base font-bold leading-snug sm:text-xl">
          <span>Selamat Datang Kembali,</span>
          <span className="ml-1.5 text-[#ffad22]">
            {user?.fullname ?? "Pengguna"} 👋
          </span>
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-neutral-700 sm:text-[13px]">
          Lihat Inovasi OPD bidang Digital dan Non Digital secara cepat.
        </p>
      </div>

      <div className="space-y-4">
        {countdownActive ? (
          <CountdownBanner countdown={countdown} active />
        ) : null}
        <StatisticsGrid summary={summary} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <InnovationIndexChart data={innovationIndex} />
        <InnovationYearChart data={innovationsPerYear} />
        <aside className="relative lg:col-span-2 xl:col-span-1">
          <AnnouncementPanel announcements={announcements} />
        </aside>
      </div>

      <DynamicPage
        className="mt-4 rounded-xl p-4"
        toolbar={innovations.toolbar}
        filterPanel={innovations.filterPanel}
        columns={innovationColumnFormats}
        items={innovations.items}
        total={innovations.total}
        currentPage={innovations.currentPage}
        totalPages={innovations.totalPages}
        loading={innovations.loading}
        emptyMessage="Belum ada data inovasi."
        onPageChange={innovations.onPageChange}
        getRowId={(row) => row.id}
        renderActions={(row) =>
          renderInnovationActions({ row, onPreview: innovations.onPreview })
        }
      />
    </div>
  );
}
