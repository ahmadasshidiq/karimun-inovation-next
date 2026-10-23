"use client";

import React, { useEffect, useState, useCallback } from "react";
import { animate, stagger } from "animejs";

// Components
import Navbar from "./components/navbar";
import HeroSection from "./components/hero-section";
import SambutanSection from "./components/sambutan-section";
import BeritaSection from "./components/berita-section";
import PengumumanSection from "./components/pengumuman-section";
import PedomanSection from "./components/pedoman-section";
import GaleriSection from "./components/galeri-section";
import FaqSection from "./components/faq-section";
import CtaSection from "./components/cta-section";
import FooterSection from "./components/footer-section";
import ArticleModal from "./components/article-modal";

// Config & Data
import { beritaData, pengumumanData, type ModalData } from "./page.config";

export default function LandingIndeksInovasiPage() {
  // --- States ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalData, setModalData] = useState<ModalData>(null);

  // --- Handlers ---
  const handleScroll = useCallback((id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 64;
      const pos = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  }, []);

  // --- Effects ---

  // Navbar scroll effect
  useEffect(() => {
    const updateNavbar = () => {
      const scrollPosition = Math.max(window.scrollY, document.documentElement.scrollTop);
      setScrolled(scrollPosition > 4);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    document.addEventListener("scroll", updateNavbar, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", updateNavbar);

    return () => {
      window.removeEventListener("scroll", updateNavbar);
      document.removeEventListener("scroll", updateNavbar, true);
      window.removeEventListener("resize", updateNavbar);
    };
  }, []);

  // Animation effect
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-landing-card]"));
    const animatedCards = new WeakSet<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleCards = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .filter((card) => !animatedCards.has(card));

        if (!visibleCards.length) return;

        visibleCards.forEach((card) => {
          animatedCards.add(card);
          observer.unobserve(card);
        });

        animate(visibleCards, {
          opacity: [0, 1],
          y: [30, 0],
          scale: [0.95, 1],
          duration: 800,
          delay: stagger(100),
          ease: "outCubic",
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#FACC15] selection:text-slate-950">
      <Navbar
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleScroll={handleScroll}
      />

      <main>
        <HeroSection handleScroll={handleScroll} />
        <SambutanSection setModalData={setModalData} />
        <BeritaSection items={beritaData} />
        <PengumumanSection pengumumanData={pengumumanData} setModalData={setModalData} />
        <PedomanSection setModalData={setModalData} />
        <GaleriSection />
        <FaqSection />
        <CtaSection />
      </main>

      <FooterSection handleScroll={handleScroll} />

      <ArticleModal modalData={modalData} setModalData={setModalData} />
    </div>
  );
}
