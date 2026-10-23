"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type BeritaItem } from "../page.config";

type BeritaSectionProps = {
  items: BeritaItem[];
};

export default function BeritaSection({ items }: BeritaSectionProps) {
  const mainNews = items[0];
  const sideNews = items.slice(1, 3);

  return (
    <section id="berita" className="py-24 lg:py-32 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-px bg-green-500"></span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#FACC15]">INFORMASI TERKINI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-[0.95]">
              BERITA & <span className="text-[#FACC15]">AGENDA</span>
            </h2>
          </div>
          <Link
            href="/berita"
            className="group inline-flex items-center gap-6 text-slate-950 font-semibold text-[10px] uppercase tracking-[0.3em] transition-colors"
          >
            <span className="relative">
              LIHAT SEMUA
              <span className="absolute -bottom-2 left-0 w-full h-px bg-green-500 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></span>
            </span>
            <div className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center transition-all duration-500 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950">
              <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-12">
          {/* Main News */}
          <Link
            href={`/berita/${mainNews.id}`}
            className="col-span-7 group relative flex flex-col transition-all duration-700"
            data-landing-card
          >
            <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-200">
              <Image
                src={mainNews.image}
                alt={mainNews.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute top-8 left-8 z-10">
                <span className="px-6 py-2.5 rounded-full bg-slate-950 text-white text-[9px] font-semibold uppercase tracking-[0.2em] shadow-2xl">
                  {mainNews.category}
                </span>
              </div>
            </div>
            <div className="pt-10 space-y-6 flex-grow">
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold uppercase tracking-[0.2em]">
                <span className="flex items-center gap-3">
                  {mainNews.date}
                </span>
                <span className="w-px h-3 bg-slate-200"></span>
                <span>{mainNews.readTime}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#FACC15] transition-colors line-clamp-2 leading-snug tracking-tight uppercase">
                {mainNews.title}
              </h3>
              <p className="text-slate-500 leading-relaxed line-clamp-3 text-lg font-normal">
                {mainNews.excerpt}
              </p>
              <div className="pt-4">
                <span className="inline-flex items-center gap-4 text-[#FACC15] font-semibold text-[10px] uppercase tracking-[0.3em] group/btn">
                  BACA SELENGKAPNYA
                  <span className="w-12 h-px bg-[#FACC15] transition-all duration-500 group-hover/btn:w-20 group-hover/btn:bg-green-500"></span>
                </span>
              </div>
            </div>
          </Link>

          {/* Side News - Compact */}
          <div className="col-span-5 space-y-12">
            {sideNews.map((news) => (
              <Link
                key={news.id}
                href={`/berita/${news.id}`}
                className="group grid grid-cols-5 gap-8 transition-all duration-500"
                data-landing-card
              >
                <div className="col-span-2 relative aspect-square w-full rounded-[2rem] overflow-hidden shadow-lg border border-slate-200">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="col-span-3 space-y-4 py-2">
                  <div className="text-[9px] text-[#FACC15] font-semibold uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="w-6 h-px bg-green-500"></span>
                    {news.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FACC15] transition-colors line-clamp-2 leading-snug uppercase tracking-tight">
                    {news.title}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.2em]">{news.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Carousel - Horizontal Scroll */}
        <div className="lg:hidden -mx-4 px-4 flex overflow-x-auto snap-x snap-mandatory gap-6 no-scrollbar pb-8">
          {items.map((news) => (
            <Link
              key={news.id}
              href={`/berita/${news.id}`}
              className="flex-shrink-0 w-[85%] snap-start group rounded-3xl overflow-hidden bg-white shadow-xl border border-slate-200 flex flex-col"
            >
              <div className="relative aspect-video w-full">
                <Image src={news.image} alt={news.title} fill className="object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-lg bg-white/95 text-[#FACC15] text-[10px] font-semibold shadow-sm">
                    {news.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="text-xs text-slate-500 font-bold">{news.date}</div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                  {news.title}
                </h3>
                <span className="inline-block pt-2 text-[#FACC15] font-bold text-sm">
                  Baca Selengkapnya →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
