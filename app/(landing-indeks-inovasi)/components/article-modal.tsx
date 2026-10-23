"use client";

import React from "react";
import { type ModalData } from "../page.config";

type ArticleModalProps = {
  modalData: ModalData;
  setModalData: (data: ModalData) => void;
};

export default function ArticleModal({ modalData, setModalData }: ArticleModalProps) {
  if (!modalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-2">
            <span className="inline-block text-xs font-semibold text-[#FACC15] bg-[#FFFBE6] px-3 py-1 rounded-lg border border-[#FFEF9E] uppercase tracking-widest">
              {modalData.meta}
            </span>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {modalData.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setModalData(null)}
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          <div className="whitespace-pre-wrap">{modalData.content}</div>
          
          {modalData.timeline && modalData.timeline.length > 0 && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <h4 className="font-bold text-slate-900 text-base mb-4 uppercase tracking-tight">Jadwal & Tahapan:</h4>
              <div className="space-y-3">
                {modalData.timeline.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <span className="text-slate-900 font-bold">{t.phase}</span>
                    <span className="text-[#FACC15] font-semibold text-xs uppercase tracking-widest">{t.period}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={() => setModalData(null)}
            className="px-8 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-[#FACC15] hover:text-slate-950 shadow-lg transition-all duration-300"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
}
