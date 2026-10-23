"use client";

import React, { useState } from "react";
import { faqData } from "../page.config";

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-green-500"></span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#FACC15]">TANYA JAWAB</span>
            <span className="w-8 h-px bg-green-500"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-[0.95]">
            PERTANYAAN <span className="text-[#FACC15]">UMUM</span>
          </h2>
          <p className="text-lg text-slate-500 font-normal max-w-2xl mx-auto tracking-wide">
            Temukan jawaban cepat untuk pertanyaan yang sering diajukan seputar sistem IID.
          </p>
        </div>

        <div className="space-y-6">
          {faqData.map((item, idx) => (
            <div
              key={idx}
              data-landing-card
              className="rounded-[2.5rem] border border-slate-200 bg-slate-50 overflow-hidden transition-all duration-700 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-slate-300"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-10 text-left focus:outline-none group"
              >
                <span className="text-lg font-bold text-slate-950 pr-8 tracking-tight uppercase">
                  {item.question}
                </span>
                <div className={`flex-shrink-0 w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-500 ${activeIndex === idx ? 'bg-slate-950 border-slate-950 text-white rotate-180' : 'text-slate-400 group-hover:text-slate-950 group-hover:border-slate-950'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                className={`transition-all duration-700 ease-in-out overflow-hidden ${
                  activeIndex === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-10 pb-10 pt-0 text-lg text-slate-500 leading-relaxed font-normal">
                  <div className="h-px bg-slate-200 w-full mb-8"></div>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
