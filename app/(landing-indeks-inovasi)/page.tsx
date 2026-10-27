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
import { type BeritaItem, type ModalData, type PengumumanItem } from "./page.config";

type PublicAnnouncement = {
  id: string;
  title: string;
  summary: string;
  content: string;
  announcementDate: string;
};

type PublicNews = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  publishedAt: string | null;
  readingTime: number;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));

const toPlainText = (content: string) =>
  content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export default function LandingIndeksInovasiPage() {
  // --- States ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalData, setModalData] = useState<ModalData>(null);
  const [announcements, setAnnouncements] = useState<PengumumanItem[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState("");
  const [news, setNews] = useState<BeritaItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");

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

  useEffect(() => {
    const controller = new AbortController();
    const apiBaseUrl = (process.env.NEXT_PUBLIC_PUBLIC_API_URL || window.location.origin).replace(/\/$/, "");
    const loadNews = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/public/news?limit=3`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Gagal mengambil berita.");
        const payload = await response.json() as { success?: boolean; data?: PublicNews[] };
        if (!payload.success || !Array.isArray(payload.data)) throw new Error("Respons berita tidak valid.");
        setNews(payload.data.map((item) => ({ id: item.id, slug: item.slug, title: item.title, date: item.publishedAt ? formatDate(item.publishedAt.slice(0, 10)) : "", category: item.category, image: item.coverImage || "/images/hero-karimun-new.jpg", excerpt: item.excerpt, content: item.content, readTime: `${item.readingTime} menit baca` })));
      } catch (error) {
        if (!controller.signal.aborted) setNewsError(error instanceof Error ? error.message : "Gagal mengambil berita.");
      } finally {
        if (!controller.signal.aborted) setNewsLoading(false);
      }
    };
    void loadNews();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const apiBaseUrl = (
      process.env.NEXT_PUBLIC_PUBLIC_API_URL || window.location.origin
    ).replace(/\/$/, "");

    const loadAnnouncements = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/public/announcements?limit=3`,
          { cache: "no-store", signal: controller.signal },
        );
        if (!response.ok) throw new Error("Gagal mengambil pengumuman.");

        const payload = (await response.json()) as {
          success?: boolean;
          data?: PublicAnnouncement[];
        };
        if (!payload.success || !Array.isArray(payload.data)) {
          throw new Error("Respons pengumuman tidak valid.");
        }

        setAnnouncements(
          payload.data.map((item) => {
            const date = formatDate(item.announcementDate);

            return {
              id: item.id,
              title: item.title,
              date,
              deadline: date,
              status: "Dibuka",
              category: "Pengumuman Resmi",
              summary: item.summary,
              description: toPlainText(item.content),
              timeline: [],
            };
          }),
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          setAnnouncementsError(
            error instanceof Error
              ? error.message
              : "Gagal mengambil pengumuman.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setAnnouncementsLoading(false);
      }
    };

    void loadAnnouncements();
    return () => controller.abort();
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
        <BeritaSection items={news} loading={newsLoading} error={newsError} />
        <PengumumanSection
          pengumumanData={announcements}
          loading={announcementsLoading}
          error={announcementsError}
          setModalData={setModalData}
        />
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
