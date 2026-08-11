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
import { AppPageHeader } from "@/components/app-sidebar";

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
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4992ff] to-[#4c12ff] px-5 py-4 text-white shadow-sm sm:px-8">
      <div className="absolute left-0 right-0 top-6 hidden items-center gap-5 px-8 lg:flex">
        <span className="h-px flex-1 bg-white/70" />
        <span className="text-[13px] font-semibold">
          Hitungan Mundur Pengisian Indeks Inovasi Daerah
        </span>
        <span className="h-px flex-1 bg-white/70" />
      </div>
      <p className="mb-2 text-center text-xs font-semibold lg:hidden">
        Hitungan Mundur Pengisian Indeks Inovasi Daerah
      </p>
      <div className="flex items-center justify-center gap-3 pt-1 lg:pt-7">
        <Clock3 className="size-7 shrink-0" />
        <div className="flex items-start gap-1.5">
          {values.map((item, index) => (
            <div key={item.label} className="flex items-start gap-1.5">
              {index > 0 && <span className="text-2xl font-bold">:</span>}
              <div className="min-w-8 text-center">
                <div className="text-2xl font-bold leading-none tracking-wide sm:text-[27px]">
                  {item.value}
                </div>
                <div className="mt-1 text-[9px]">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-1 w-fit rounded-full bg-emerald-400 px-5 py-0.5 text-[9px] font-bold">
        AKTIF
      </div>
    </section>
  );
}

function StatisticsGrid() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {statistics.map((item) => {
        const Icon = item.icon;
        return (
          <article
            key={item.title}
            className="relative min-h-28 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <p className="max-w-[80%] text-[12px] font-semibold leading-tight text-neutral-800">
              {item.title}
            </p>
            <Icon className="absolute right-4 top-4 size-6 text-neutral-900" />
            <p className="mt-3 text-[38px] font-semibold leading-none tracking-tight text-black">
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
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <MapPinned className="size-5" />
        Peta Inovasi
      </h2>
      <div className="relative aspect-[16/8] min-h-64 overflow-hidden rounded-lg bg-slate-800">
        <Image
          src="/images/dashboard-kepri-map.png"
          alt="Peta satelit Kepulauan Riau"
          fill
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        <div className="absolute bottom-3 left-3 rounded-md bg-cyan-400/90 p-2 text-white shadow">
          <MapPinned className="size-4" />
        </div>
      </div>
    </section>
  );
}

function AnnouncementPanel() {
  return (
    <section className="min-h-[320px] rounded-xl border border-neutral-200 bg-white p-4 shadow-sm lg:min-h-0">
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
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
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
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1500px] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
      <AppPageHeader />

      <div className="mb-6">
        <h2 className="flex flex-wrap items-center gap-x-1.5 text-lg font-bold sm:text-xl">
          <span>Selamat Datang Kembali,</span>
          <span className="text-[#ffad22]">Admin Karimun 👋</span>
        </h2>
        <p className="mt-1 text-[13px] text-neutral-700">
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
