"use client";

import React from "react";
import { type PengumumanItem, type ModalData } from "../page.config";

type Props = {
  pengumumanData: PengumumanItem[];
  setModalData: (data: ModalData) => void;
};

export default function PengumumanSection({ pengumumanData, setModalData }: Props) {
  return (
    <section id="pengumuman" className="py-24 lg:py-32 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-px bg-green-500"></span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#FACC15]">AGENDA & KOMPETISI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-[0.95]">
              PENGUMUMAN <span className="text-[#FACC15]">INOVASI</span>
            </h2>
          </div>
        </div>

        <div className="space-y-16">
          {pengumumanData.map((item) => (
            <article
              key={item.id}
              data-landing-card
              className="relative group flex flex-col md:flex-row items-center gap-10 md:gap-16 transition-all duration-700"
            >
              {/* Refined Date Circle */}
              <div className="relative shrink-0 w-28 h-28 rounded-full border border-slate-200 bg-slate-50 flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 group-hover:scale-105">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-40 group-hover:opacity-60">{item.date.split(" ")[1]}</span>
                <span className="text-3xl font-bold tracking-tighter">{item.date.split(" ")[0]}</span>
              </div>

              <div className="flex-1 min-w-0 space-y-5 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                  {item.status === "Dibuka" && (
                    <span className="px-5 py-2 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-[0.2em] flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      {item.status}
                    </span>
                  )}
                  {item.status === "Segera" && (
                    <span className="px-5 py-2 rounded-full text-[9px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-[0.2em]">
                      {item.status}
                    </span>
                  )}
                  {item.status === "Ditutup" && (
                    <span className="px-5 py-2 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-[0.2em]">
                      {item.status}
                    </span>
                  )}
                  <span className="text-[9px] text-[#FACC15] font-semibold uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="w-4 h-px bg-green-500"></span>
                    {item.category}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-[0.2em]">
                    DEADLINE: {item.deadline}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold leading-snug text-slate-900 group-hover:text-[#FACC15] transition-colors uppercase tracking-tight">{item.title}</h3>
                <p className="max-w-4xl text-lg text-slate-500 leading-relaxed font-normal line-clamp-2">{item.summary}</p>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    setModalData({
                      title: item.title,
                      meta: `Status: ${item.status} • Batas: ${item.deadline}`,
                      content: item.description,
                      timeline: item.timeline,
                    })
                  }
                  className="group relative inline-flex w-full items-center justify-center gap-6 px-12 py-5 rounded-full bg-white border border-slate-200 text-slate-950 font-semibold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 hover:bg-slate-950 hover:text-white hover:border-slate-950 md:w-auto shadow-xl"
                >
                  <span>Lihat Detail</span>
                  <div className="w-8 h-px bg-slate-200 transition-all duration-500 group-hover:w-12 group-hover:bg-green-400"></div>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
