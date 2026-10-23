"use client";

import React from "react";
import Link from "next/link";

type HeroSectionProps = {
  handleScroll: (id: string) => void;
};

/* ============================================================
   DATA HERO — ISI DATA ASLI
   Ganti nilai di bawah ini dengan data resmi BAPERLITBANG
   ============================================================ */
const REPORTING_DEADLINE = "28 Februari 2026"; // ISI DATA ASLI: tanggal batas akhir pelaporan

const HERO_STATS = [
  { value: "1.248", label: "Total Inovasi", note: "Terlapor & terverifikasi" }, // ISI DATA ASLI
  { value: "36", label: "OPD Berpartisipasi", note: "Perangkat daerah" }, // ISI DATA ASLI
  { value: "2025", label: "Tahun Pengukuran", note: "Periode penilaian" }, // ISI DATA ASLI
  { value: "AAA", label: "Skor / Predikat", note: "Indeks Inovasi Daerah" }, // ISI DATA ASLI
];

/* Stagger animasi fade-up antar elemen (80–120ms per elemen) */
const RISE_DELAY = 90;

export default function HeroSection({ handleScroll }: HeroSectionProps) {
  return (
    <section
      id="beranda"
      className="relative flex min-h-[100dvh] w-full flex-col bg-slate-950"
    >
      {/* Background foto tulisan KARIMUN — opacity dinaikkan agar foto lebih terlihat */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/images/hero-karimun-new.jpg')" }}
        aria-hidden="true"
      ></div>
      {/* Navy overlay: gelap ~70% di atas, ~90% di bawah, tengah dibuka agar foto tampak */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-slate-950/90 pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-10 text-center">
        <div data-landing-card className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {/* 1. Headline (H1) */}
          <h1
            className="hero-rise mx-auto max-w-6xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight text-white"
            style={{ animationDelay: `${RISE_DELAY * 1}ms` }}
          >
            KABUPATEN
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FACC15] to-[#EAB308]">
              KARIMUN
            </span>
          </h1>

          {/* 2. Subheadline */}
          <p
            className="hero-rise mx-auto max-w-[60ch] text-lg lg:text-xl leading-relaxed text-white/80 font-normal"
            style={{ animationDelay: `${RISE_DELAY * 2}ms` }}
          >
            Satu pintu untuk melaporkan, memverifikasi, dan memantau inovasi perangkat daerah Kabupaten Karimun.
          </p>

          {/* 3. CTA */}
          <div
            className="hero-rise flex flex-wrap items-center justify-center gap-4 sm:gap-6"
            style={{ animationDelay: `${RISE_DELAY * 3}ms` }}
          >
            <Link
              href="/login"
              aria-label="Mulai Pelaporan inovasi daerah"
              className="group inline-flex min-h-[56px] items-center gap-4 rounded-full bg-[#FACC15] px-10 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 transition-all duration-500 hover:-translate-y-1 hover:bg-[#EAB308] hover:shadow-[0_24px_50px_-12px_rgba(250,204,21,0.45)]"
            >
              <span>Mulai Pelaporan</span>
              <svg
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => handleScroll("pedoman")}
              aria-label="Unduh pedoman teknis indeks inovasi daerah"
              className="inline-flex min-h-[56px] items-center gap-4 rounded-full border border-white/25 bg-white/[0.04] px-10 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#FACC15]/60 hover:bg-[#FACC15]/10"
            >
              Unduh Pedoman Teknis
            </button>
          </div>

          {/* 4. Micro-copy */}
          <p
            className="hero-rise text-sm leading-relaxed text-slate-300/90"
            style={{ animationDelay: `${RISE_DELAY * 4}ms` }}
          >
            Khusus OPD / Perangkat Daerah&nbsp;&nbsp;·&nbsp;&nbsp;Batas pelaporan:{" "}
            <span className="font-semibold text-white">{REPORTING_DEADLINE}</span>
          </p>
        </div>

        {/* 5. Stats strip glassmorphism */}
        <div
          className="hero-rise mx-auto mt-12 sm:mt-16 w-full max-w-4xl rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl"
          style={{ animationDelay: `${RISE_DELAY * 5}ms` }}
        >
          <dl className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                data-stat
                data-value={stat.value}
                className="flex flex-col items-center gap-1.5 text-center lg:border-l lg:border-white/10 lg:first:border-l-0"
              >
                <dd className="text-3xl sm:text-4xl font-bold text-[#FACC15] tabular-nums">
                  {stat.value}
                </dd>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
                  {stat.label}
                </dt>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest text-white/40">
                  {stat.note}
                </span>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}