"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "../page.config";

type FooterSectionProps = {
  handleScroll: (id: string) => void;
};

export default function FooterSection({ handleScroll }: FooterSectionProps) {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-24 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 pb-20">
          {/* Brand Side */}
          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center gap-6">
              <div className="relative h-16 w-16 rounded-full bg-white/5 p-3 border border-white/10 shadow-2xl">
                <Image
                  src="/images/logo-karimun.webp"
                  alt="Lambang Kabupaten Karimun"
                  width={64}
                  height={64}
                  className="drop-shadow-[0_0_10px_rgba(250,204,21,0.35)] object-contain"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white leading-none uppercase tracking-tight">
                  KABUPATEN <br />
                  <span className="text-[#FACC15]">KARIMUN</span>
                </h3>
              </div>
            </div>
            
            <div className="space-y-6 max-w-md">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1px] bg-green-500"></span>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Baperlitbang Karimun</p>
              </div>
              <p className="text-lg leading-relaxed text-slate-500 font-normal">
                Pusat Pelaporan Indeks Inovasi Daerah (IID) untuk mewujudkan kemandirian daerah Bumi Berazam yang inovatif.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { label: "FB", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: "IG", icon: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z" },
                { label: "YT", icon: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.42a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33zM9.75 15.02V8.48L15.45 11.75l-5.7 3.27z" }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 hover:border-green-500 hover:text-slate-950 transition-all duration-500 shadow-2xl"
                >
                  <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="space-y-8">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/30">Navigasi</h4>
              <ul className="space-y-5">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleScroll(link.id)}
                      className="group flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-all"
                    >
                      <span className="w-0 h-px bg-green-500 transition-all duration-300 group-hover:w-4"></span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/30">Kontak</h4>
              <div className="space-y-6 text-sm font-normal text-slate-500">
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-green-400/50 transition-colors">
                    <svg className="w-4 h-4 text-[#FACC15] group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <p className="leading-relaxed pt-2">
                    Jl. Jend. Sudirman Poros No. 1, Pemkab Karimun, Kepulauan Riau
                  </p>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-green-400/50 transition-colors">
                    <svg className="w-4 h-4 text-[#FACC15] group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href="mailto:baperlitbang@karimunkab.go.id" className="hover:text-white transition-colors pt-2 underline decoration-[#FACC15]/40 underline-offset-8 group-hover:decoration-green-400/50">
                    baperlitbang@karimunkab.go.id
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/30">Portal</h4>
              <div className="space-y-6">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full py-4 rounded-full bg-[#FACC15] text-slate-950 text-[10px] font-semibold uppercase tracking-widest hover:bg-[#EAB308] transition-all duration-500 shadow-2xl"
                >
                  Masuk Sistem
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} Baperlitbang Karimun
            </p>
            <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">
              Bumi Berazam &mdash; Negeri Berinovasi
            </p>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest hover:text-green-400 transition-colors">Privasi</Link>
            <Link href="#" className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest hover:text-green-400 transition-colors">Ketentuan</Link>
          </div>
        </div>
      </div>
      
      {/* Yellow accent line at the very bottom */}
      <div className="h-2 w-full bg-green-900 shadow-[0_-4px_20px_rgba(20,83,45,0.5)]"></div>
    </footer>
  );
}
