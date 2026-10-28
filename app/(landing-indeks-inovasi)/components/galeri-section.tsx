"use client";

import React from "react";
import Image from "next/image";

export default function GaleriSection() {
  const items = [
    {
      title: "Visualisasi Inovasi Pelayanan Pesisir & Pulau Terluar",
      category: "Pemerintah Kabupaten Karimun",
      image: "/images/hero-karimun-new.jpg",
      duration: "04:20",
    },
    {
      title: "Monitoring Lapangan Verifikasi Berkas Evidensi Inovasi",
      category: "Baperlitbang Kabupaten Karimun",
      image: "/images/hero-karimun-new.jpg",
      duration: "03:15",
    },
    {
      title: "Katalog Profil Inovasi Daerah Bumi Berazam",
      category: "Kemendagri RI",
      image: "/images/hero-karimun-new.jpg",
      duration: "05:45",
    },
  ];

  return (
    <section id="galeri" className="py-24 lg:py-32 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-green-500"></span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#FACC15]">GALERI VISUAL</span>
            <span className="w-8 h-px bg-green-500"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter uppercase leading-[0.95]">
            DOKUMENTASI <br /> & <span className="text-[#FACC15]">INOVASI</span>
          </h2>
          <p className="text-lg text-slate-500 font-normal max-w-2xl mx-auto tracking-wide">
            Kumpulan video dan dokumentasi penerapan inovasi di lingkungan Pemerintah Kabupaten Karimun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, idx) => (
            <article
              key={idx}
              data-landing-card
              className="group relative flex flex-col transition-all duration-700"
            >
              <div className="relative aspect-video w-full rounded-[var(--landing-radius-card)] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-green-500 group-hover:border-green-500 group-hover:text-slate-950 text-white">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6">
                  <span className="px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-semibold uppercase tracking-widest">
                    {item.duration}
                  </span>
                </div>
              </div>
              <div className="pt-8 space-y-4">
                <div className="flex items-center gap-3 text-[9px] text-[#FACC15] font-semibold uppercase tracking-[0.3em]">
                  <span className="w-6 h-px bg-green-500"></span>
                  {item.category}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FACC15] transition-colors line-clamp-2 leading-snug uppercase tracking-tight">
                  {item.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
