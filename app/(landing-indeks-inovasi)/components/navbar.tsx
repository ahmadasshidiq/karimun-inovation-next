"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "../page.config";

type NavbarProps = {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  handleScroll: (id: string) => void;
};

export default function Navbar({
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleScroll,
}: NavbarProps) {
  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-700 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-2xl py-3 border-b border-white/10"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Side */}
          <div
            onClick={() => handleScroll("beranda")}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                src="/images/logo-karimun.webp"
                alt="Logo Karimun"
                width={48}
                height={48}
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#FACC15] group-hover:text-green-400 transition-colors duration-500">
                PEMKAB
              </span>
              <span className="text-lg font-bold leading-none tracking-tighter text-white uppercase">
                KARIMUN
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-12 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScroll(link.id)}
                className="text-[11px] font-semibold text-slate-400 tracking-wider transition-all duration-500 hover:text-white relative group"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-green-500 transition-all duration-500 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Action Side */}
          <div className="hidden items-center gap-8 lg:flex">
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 border border-white/10 px-8 py-3 text-[11px] font-semibold tracking-wider text-white transition-all duration-500 hover:border-green-400/50"
            >
              <span className="relative z-10">Log In</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-green-500 to-green-600 transition-transform duration-500 group-hover:translate-x-0"></div>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2.5 text-white hover:bg-white/10 transition-colors focus:outline-none border border-white/10"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-4 pb-8 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScroll(link.id)}
                className="text-left px-4 py-3 rounded-xl text-base font-semibold tracking-wide text-slate-300 hover:bg-white/5 hover:text-green-400 transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/login"
              className="w-full block text-center px-6 py-4 bg-[#FACC15] rounded-xl text-sm font-semibold tracking-wide text-slate-950 hover:bg-[#EAB308] shadow-lg shadow-[#FACC15]/20 transition-all"
            >
              Portal Pelaporan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
