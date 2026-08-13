"use client";

import Image from "next/image";
import { Clock3, Mail, MapPinned, Megaphone, PieChart } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import {
  announcements,
  assessmentData,
  statistics,
  type CountdownValue,
} from "../page.config";
import { AppPageHeader, useSessionUser } from "@/components/app-sidebar";

type DashboardContentProps = {
  countdown: CountdownValue;
};

function CountdownBanner({ countdown }: { countdown: CountdownValue }) {
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
                <span className="size-1.5 rounded-full bg-emerald-300" />
                AKTIF
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

function StatisticsGrid() {
  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-3">
      {statistics.map((item) => {
        const Icon = item.icon;
        return (
          <article
            key={item.title}
            className="relative min-h-28 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5"
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

function MapPanel() {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-3 sm:p-4">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <MapPinned className="size-5" />
        Peta Inovasi
      </h2>
      <div className="relative aspect-[4/3] min-h-52 overflow-hidden rounded-lg bg-slate-800 sm:aspect-[16/8] sm:min-h-64">
        <Image
          src="/images/dashboard-kepri-map.png"
          alt="Peta satelit Kepulauan Riau"
          fill
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        <div className="absolute bottom-3 left-3 rounded-md border border-cyan-300 bg-cyan-400/90 p-2 text-white">
          <MapPinned className="size-4" />
        </div>
      </div>
    </section>
  );
}

function AnnouncementPanel() {
  return (
    <section className="min-h-[320px] rounded-xl border border-neutral-200 bg-white p-4 lg:min-h-0">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold">
        <Megaphone className="size-5" />
        Pengumuman
      </h2>
      <div className="space-y-3">
        {announcements.map((announcement) => (
          <article
            key={announcement.title}
            className="flex items-center gap-3 rounded-md bg-neutral-100 px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold">
                {announcement.title}
              </p>
              <p className="mt-0.5 text-[10px] text-neutral-500">
                {announcement.date}
              </p>
            </div>
            <Mail className="size-4 shrink-0 text-[#4f71ff]" />
          </article>
        ))}
      </div>
    </section>
  );
}

function AssessmentPanel() {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <PieChart className="size-5" />
        Aspek Penilaian
      </h2>
      <div className="h-[280px] min-h-[255px] min-w-0 w-full lg:h-[255px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 320, height: 255 }}
        >
          <RadarChart data={assessmentData} outerRadius="60%">
            <PolarGrid stroke="#d9e2ef" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#65758b", fontSize: 8, fontWeight: 600 }}
            />
            <Radar
              dataKey="value"
              stroke="#146be8"
              strokeWidth={4}
              fill="#4191ff"
              fillOpacity={0.28}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default function DashboardContent({ countdown }: DashboardContentProps) {
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2.6fr)_minmax(270px,1fr)]">
        <div className="space-y-4">
          <CountdownBanner countdown={countdown} />
          <StatisticsGrid />
          <MapPanel />
        </div>
        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-[1fr_auto]">
          <AnnouncementPanel />
          <AssessmentPanel />
        </aside>
      </div>
    </div>
  );
}
