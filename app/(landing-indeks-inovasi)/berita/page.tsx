"use client";

import Image from "next/image";
import Link from "next/link";
import { beritaData, type BeritaItem } from "../page.config";

export default function BeritaIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-800">
      {/* Header */}
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-semibold text-white/90 transition hover:text-white"
          >
            ← Kembali ke Beranda
          </Link>
          <Image
            src="/images/logo-karimun.webp"
            alt="Kabupaten Karimun"
            width={36}
            height={36}
          />
        </div>
      </header>

      {/* Title */}
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center gap-4">
          <span className="w-8 h-px bg-green-500"></span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#FACC15]">
            INFORMASI TERKINI
          </span>
        </div>
        <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900 sm:text-5xl leading-[0.95]">
          Semua Berita & <span className="text-[#FACC15]">Agenda</span>
        </h1>
      </div>

      {/* Grid of all news */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {beritaData.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}

function NewsCard({ item }: { item: BeritaItem }) {
  return (
    <Link
      href={`/berita/${item.id}`}
      data-landing-card
      className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute top-6 left-6">
          <span className="px-5 py-2 rounded-full bg-slate-950/90 text-white text-[9px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md">
            {item.category}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-8">
        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold uppercase tracking-[0.2em]">
          <span>{item.date}</span>
          <span className="w-px h-3 bg-slate-200"></span>
          <span>{item.readTime}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#FACC15] transition-colors line-clamp-2 leading-snug tracking-tight uppercase">
          {item.title}
        </h2>
        <p className="text-slate-500 leading-relaxed line-clamp-3 text-base font-normal">
          {item.excerpt}
        </p>
        <span className="inline-flex items-center gap-4 pt-2 text-[#FACC15] font-semibold text-[10px] uppercase tracking-[0.3em]">
          BACA SELENGKAPNYA
          <span className="w-12 h-px bg-[#FACC15] transition-all duration-500 group-hover:w-20 group-hover:bg-green-500"></span>
        </span>
      </div>
    </Link>
  );
}