"use client";

import React from "react";
import Image from "next/image";
import bupatiImage from "@/public/images/Bupati.jpeg";
import { type ModalData } from "../page.config";

type SambutanSectionProps = {
  setModalData: (data: ModalData) => void;
};

export default function SambutanSection({ setModalData }: SambutanSectionProps) {
  const fullContent = `Puji syukur ke hadirat Tuhan Yang Maha Esa atas hadirnya portal resmi Indeks Inovasi Daerah (IID) Kabupaten Karimun. Portal ini dikembangkan sebagai wujud komitmen Pemerintah Daerah dalam mempercepat transformasi pelayanan publik, memetakan potensi keunggulan lokal, serta menumbuhkembangkan budaya berinovasi di seluruh Organisasi Perangkat Daerah dan unit kerja Bumi Berazam. Melalui pemenuhan 36 indikator kematangan inovasi dan integrasi pelaporan ke Badan Strategi Kebijakan Dalam Negeri (BSKDN) Kemendagri, mari kita wujudkan tata kelola pemerintahan yang adaptif, berintegritas, dan memberikan manfaat nyata bagi kesejahteraan masyarakat.`;

  const truncatedContent = `Puji syukur ke hadirat Tuhan Yang Maha Esa atas hadirnya portal resmi Indeks Inovasi Daerah (IID) Kabupaten Karimun. Portal ini dikembangkan sebagai wujud komitmen Pemerintah Daerah dalam mempercepat transformasi pelayanan publik, memetakan potensi keunggulan lokal...`;

  return (
    <section id="sambutan" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          {/* Image Side */}
          <div className="relative w-full lg:w-1/2" data-landing-card>
            <div className="relative z-10 rounded-[var(--landing-radius-card)] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-[1px] border-slate-200">
              <div className="aspect-[4/5] relative bg-slate-50">
                <Image
                  src={bupatiImage}
                  alt="Bupati Kabupaten Karimun"
                  fill
                  className="object-cover object-top transition-transform duration-1000 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            {/* Minimal Decorative elements */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-green-500/5 rounded-full blur-3xl -z-10"></div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 space-y-12" data-landing-card>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-8 h-px bg-green-500"></span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#FACC15]">KATA SAMBUTAN</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-[0.95] tracking-tighter uppercase">
                Mewujudkan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FACC15] to-[#EAB308]">BERINOVASI</span>
              </h2>
            </div>

            <div className="space-y-10">
              <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-normal italic border-l-2 border-green-500/40 pl-8">
                &ldquo;{truncatedContent}&rdquo;
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => setModalData({
                    title: "Sambutan Bupati Kabupaten Karimun",
                    meta: "H. Ing Iskandarsyah",
                    content: fullContent
                  })}
                  className="group inline-flex items-center gap-6 text-slate-950 font-semibold text-[10px] uppercase tracking-[0.3em] transition-colors"
                >
                  <span className="relative">
                    Baca Selengkapnya
                    <span className="absolute -bottom-2 left-0 w-full h-px bg-green-500 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></span>
                  </span>
                  <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-500 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950">
                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-10 flex items-center gap-8">
              <div className="w-12 h-px bg-slate-200"></div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">H. ING ISKANDARSYAH</h4>
                <p className="text-[9px] font-semibold text-[#FACC15] uppercase tracking-[0.3em]">BUPATI KABUPATEN KARIMUN</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
