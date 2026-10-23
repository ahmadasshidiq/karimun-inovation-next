"use client";

import React from "react";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-slate-950 rounded-[4rem] overflow-hidden px-8 py-24 sm:px-20 sm:py-32 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-slate-900 text-center">
          {/* Refined decorative background */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.06),transparent)] pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10 space-y-12">
            <div className="flex items-center justify-center gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">AKSES SISTEM PELAPORAN</p>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tighter leading-[0.95] uppercase">
              SIAP MELAPORKAN <br className="hidden sm:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FACC15] to-[#EAB308]">INOVASI ANDA</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal tracking-wide">
              Pastikan seluruh satuan inovasi perangkat daerah di Kabupaten Karimun terdata secara tepat waktu sebelum batas akhir penilaian.
            </p>
            
            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link
                href="/login"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-6 px-16 py-6 rounded-full bg-[#FACC15] text-slate-950 text-[10px] font-semibold uppercase tracking-[0.3em] transition-all duration-500 hover:bg-[#EAB308] hover:shadow-[0_20px_40px_-10px_rgba(250,204,21,0.35)]"
              >
                <span>Portal Pelaporan</span>
                <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="#"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-6 px-16 py-6 rounded-full bg-white/[0.03] border border-white/10 text-white text-[10px] font-semibold uppercase tracking-[0.3em] backdrop-blur-md transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20"
              >
                Panduan Sistem
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
