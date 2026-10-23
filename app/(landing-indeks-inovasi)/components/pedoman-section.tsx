"use client";

import React, { useState } from "react";
import Link from "next/link";
import { stepsData, checklistData, type ModalData } from "../page.config";

type PedomanSectionProps = {
  setModalData: (data: ModalData) => void;
};

export default function PedomanSection({ setModalData }: PedomanSectionProps) {
  const [activeTab, setActiveTab] = useState<"alur" | "checklist">("alur");
  const [showAllChecklist, setShowAllChecklist] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  const displayedChecklist = showAllChecklist ? checklistData : checklistData.slice(0, 3);

  return (
    <section id="pedoman" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-green-500"></span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#FACC15]">PANDUAN PELAPORAN</span>
            <span className="w-8 h-px bg-green-500"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter uppercase leading-[0.95]">
            PEDOMAN <br /> & <span className="text-[#FACC15]">DOKUMEN</span>
          </h2>
          <p className="text-lg text-slate-500 font-normal max-w-2xl mx-auto tracking-wide">
            Pastikan seluruh tahapan dan dokumen pendukung sesuai dengan standar penilaian Indeks Inovasi Daerah.
          </p>
        </div>

        {/* Tab Switcher - Refined */}
        <div className="flex justify-center mb-20">
          <div className="inline-flex p-1.5 bg-slate-50 rounded-full border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveTab("alur")}
              className={`px-12 py-4 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-700 ${
                activeTab === "alur"
                  ? "bg-slate-950 text-white shadow-2xl"
                  : "text-slate-400 hover:text-slate-950"
              }`}
            >
              Alur Penginputan
            </button>
            <button
              onClick={() => setActiveTab("checklist")}
              className={`px-12 py-4 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-700 ${
                activeTab === "checklist"
                  ? "bg-slate-950 text-white shadow-2xl"
                  : "text-slate-400 hover:text-slate-950"
              }`}
            >
              Checklist Dokumen
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {activeTab === "alur" ? (
              <div className="space-y-10">
                {stepsData.map((s) => (
                  <div
                    key={s.step}
                    data-landing-card
                    className="group flex gap-10 p-10 rounded-[3rem] border border-slate-100 bg-slate-50 transition-all duration-700 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-slate-200"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 text-slate-950 font-bold text-3xl flex items-center justify-center transition-all duration-500 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950">
                        {s.step}
                      </div>
                    </div>
                    <div className="space-y-4 pt-2">
                      <div className="text-[9px] font-semibold text-[#FACC15] uppercase tracking-[0.3em] flex items-center gap-4">
                        <span className="w-6 h-px bg-green-500"></span>
                        {s.subtitle}
                      </div>
                      <h4 className="text-xl font-bold text-slate-950 leading-snug uppercase tracking-tight">
                        {s.title}
                      </h4>
                      <p className="text-slate-500 leading-relaxed text-base font-normal">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {displayedChecklist.map((item, index) => (
                  <div
                    key={index}
                    data-landing-card
                    className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-700 hover:shadow-2xl hover:border-slate-300"
                  >
                    <button
                      onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                      className="w-full flex items-center justify-between p-10 text-left group"
                    >
                      <div className="flex items-center gap-8">
                        <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-lg font-bold transition-all duration-700 ${
                          activeAccordion === index ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-400 group-hover:text-slate-950"
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-xl font-bold text-slate-950 tracking-tight uppercase">
                          {item.category}
                        </span>
                      </div>
                      <div className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-500 ${
                        activeAccordion === index ? "bg-green-500 border-green-500 text-slate-950 rotate-180" : "text-slate-400 group-hover:text-slate-950 group-hover:border-slate-950"
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {activeAccordion === index && (
                      <div className="px-10 pb-10 pt-0 space-y-8">
                        <div className="h-px bg-slate-200 w-full"></div>
                        <p className="text-lg text-slate-500 leading-relaxed font-normal">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-6">
                          <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-950 text-white text-[9px] font-semibold uppercase tracking-[0.2em]">
                            {item.requirement}
                          </div>
                          <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-500 text-[9px] font-semibold uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]"></span>
                            FORMAT: {item.format}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {!showAllChecklist && (
                  <button
                    onClick={() => setShowAllChecklist(true)}
                    className="w-full py-8 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-semibold uppercase tracking-[0.3em] text-[10px] hover:border-[#FACC15] hover:text-[#FACC15] transition-all duration-700"
                  >
                    LIHAT SEMUA DOKUMEN
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-slate-950 rounded-[3rem] p-12 text-white space-y-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden border border-slate-900">
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-400/[0.06] rounded-full blur-[80px]"></div>
              <div className="space-y-6 relative z-10">
                <div className="w-12 h-px bg-green-400"></div>
                <h3 className="text-2xl font-bold leading-[1] tracking-tight uppercase">
                  UNDUH <br /> DOKUMEN
                </h3>
              </div>
              <p className="text-slate-400 text-base leading-relaxed font-normal relative z-10">
                Dapatkan paket lengkap pedoman teknis, template dokumen, dan panduan resmi IID.
              </p>
              <button
                onClick={() => setModalData({
                  title: "Unduh Pedoman Teknis IID",
                  meta: "Format: PDF • Ukuran: 3.8 MB",
                  content: "Buku Pedoman Teknis memuat seluruh petunjuk pengisian 36 indikator Satuan Inovasi Daerah (SPD & SPP) serta checklist kelengkapan dokumen sesuai standar Kementerian Dalam Negeri."
                })}
                className="group relative w-full py-6 rounded-full bg-[#FACC15] text-slate-950 font-semibold text-[10px] uppercase tracking-[0.3em] transition-all duration-700 hover:bg-[#EAB308] hover:scale-[1.02] shadow-2xl shadow-[#FACC15]/20"
              >
                Unduh Pedoman (PDF)
              </button>
            </div>

            <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-200 space-y-8">
              <div className="flex items-center gap-4">
                <h4 className="text-[10px] font-semibold text-slate-950 uppercase tracking-[0.3em]">Bantuan Teknis</h4>
              </div>
              <p className="text-slate-500 text-base leading-relaxed font-normal">
                Hubungi Admin Daerah melalui helpdesk jika Anda mengalami kendala penginputan.
              </p>
              <Link
                href="#"
                className="group inline-flex items-center gap-6 text-slate-950 font-semibold text-[10px] uppercase tracking-[0.3em] transition-colors"
              >
                <span>HUBUNGI ADMIN</span>
                <div className="w-12 h-px bg-slate-200 transition-all duration-500 group-hover:w-20 group-hover:bg-green-500"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
