"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { animate, stagger } from "animejs";

// Data Berita Inovasi Daerah
const beritaData = [
  {
    id: "berita-1",
    title: "Sosialisasi Pengukuran dan Penilaian Indeks Inovasi Daerah Tahun 2026",
    date: "18 Oktober 2026",
    category: "Sosialisasi",
    image: "/images/hero-karimun-new.jpg",
    excerpt: "Pemerintah Kabupaten Karimun menyelenggarakan sosialisasi pedoman penilaian Indeks Inovasi Daerah (IID) kepada seluruh Organisasi Perangkat Daerah dan unit kerja.",
    content: "Dalam rangka meningkatkan kematangan ekosistem inovasi di daerah, Pemerintah Kabupaten Karimun melalui Bappelitbang menggelar agenda sosialisasi teknis pengukuran Indeks Inovasi Daerah (IID) tahun 2026. Kegiatan ini diikuti oleh perwakilan admin inovasi dari seluruh OPD, kecamatan, serta unit pelaksana teknis. Fokus utama pertemuan ini mencakup pemahaman indikator satuan inovasi, pemenuhan bukti dukung berbobot tinggi, dan penyelarasan jadwal pelaporan ke sistem nasional Badan Strategi Kebijakan Dalam Negeri (BSKDN) Kemendagri.",
    readTime: "4 menit baca",
  },
  {
    id: "berita-2",
    title: "Bimbingan Teknis Penginputan 36 Indikator Satuan Inovasi Berbasis Digital",
    date: "12 Oktober 2026",
    category: "Bimbingan Teknis",
    image: "/images/hero-karimun-new.jpg",
    excerpt: "Pelatihan intensif simulasi penginputan bukti dukung regulasi, kemanfaatan, dan dokumentasi penerapan inovasi pada sistem aplikasi pelaporan.",
    content: "Badan Perencanaan, Penelitian, dan Pengembangan Kabupaten Karimun memfasilitasi Bimbingan Teknis (Bimtek) penginputan 36 indikator satuan inovasi daerah. Peserta diajarkan teknik verifikasi mandiri terhadap kelengkapan surat keputusan kepala daerah, parameter kemanfaatan ekonomi/sosial, survei kepuasan masyarakat, hingga format video dokumentasi inovasi berdurasi 3-5 menit sesuai standar validasi BSKDN Kemendagri.",
    readTime: "5 menit baca",
  },
  {
    id: "berita-3",
    title: "Pendampingan Lapangan Validasi Dokumen Evidensi Inovasi Pelayanan Publik",
    date: "05 Oktober 2026",
    category: "Diseminasi",
    image: "/images/hero-karimun-new.jpg",
    excerpt: "Tim verifikator melakukan peninjauan langsung terhadap implementasi inovasi di loket pelayanan publik guna memastikan kesesuaian data lapangan.",
    content: "Memasuki tahapan pra-evaluasi, tim penilai inovasi daerah melaksanakan pendampingan langsung ke berbagai unit pelayanan publik di Kabupaten Karimun. Peninjauan ini bertujuan memastikan inovasi yang telah didaftarkan dalam sistem benar-benar telah diterapkan minimal 2 (dua) tahun berturut-turut, memiliki dampak efisiensi waktu layanan, serta didukung oleh testimoni kepuasan para pengguna layanan.",
    readTime: "3 menit baca",
  },
];

// Data Pengumuman Kompetisi Inovasi
const pengumumanData = [
  {
    id: "ann-1",
    title: "Penerimaan Proposal Lomba Inovasi Daerah (LID) Kategori Pelayanan Publik & Tata Kelola",
    date: "10 Oktober 2026",
    deadline: "15 November 2026",
    status: "Dibuka",
    category: "Kompetisi Daerah",
    summary: "Pendaftaran proposal inovasi daerah untuk seluruh OPD, Kecamatan, Puskesmas, dan Unit Pelaksana Teknis resmi dibuka.",
    description: "Lomba Inovasi Daerah diselenggarakan sebagai bentuk apresiasi terhadap perangkat daerah yang berhasil menciptakan terobosan dalam perbaikan tata kelola pemerintahan dan pelayanan publik. Peserta diwajibkan menginput profil inovasi dan bukti implementasi melalui sistem aplikasi.",
    timeline: [
      { phase: "Pendaftaran & Input Proposal", period: "10 Okt - 15 Nov 2026" },
      { phase: "Desk Evaluation & Validasi Data", period: "16 Nov - 22 Nov 2026" },
      { phase: "Presentasi Nominator & Wawancara", period: "25 Nov - 28 Nov 2026" },
      { phase: "Pengumuman Pemenang & Penganugerahan", period: "10 Desember 2026" },
    ],
  },
  {
    id: "ann-2",
    title: "Kompetisi Karya Inovasi Teknologi Tepat Guna Masyarakat Tahun Anggaran 2027",
    date: "01 Oktober 2026",
    deadline: "20 Januari 2027",
    status: "Segera",
    category: "Inovasi Masyarakat",
    summary: "Penjaringan ide dan prototipe teknologi aplikatif dari masyarakat, perguruan tinggi, serta komunitas penggiat inovasi.",
    description: "Program ini bertujuan mendorong lahirnya teknologi ramah lingkungan dan tepat guna yang bermanfaat langsung bagi sektor perikanan, maritim, pariwisata, dan UMKM di Kabupaten Karimun.",
    timeline: [
      { phase: "Publikasi Juknis & Sosialisasi", period: "15 Des 2026 - 05 Jan 2027" },
      { phase: "Pembukaan Pendaftaran Online", period: "20 Januari 2027" },
      { phase: "Uji Fungsi & Penilaian Lapangan", period: "Februari 2027" },
    ],
  },
  {
    id: "ann-3",
    title: "Batas Akhir Pelaporan Mandiri Indeks Inovasi Daerah Tahap II Periode Berjalan",
    date: "20 September 2026",
    deadline: "30 September 2026",
    status: "Ditutup",
    category: "Pelaporan Tahunan",
    summary: "Masa input dan perbaikan berkas bukti dukung untuk pengiriman database nasional BSKDN telah resmi berakhir.",
    description: "Seluruh berkas pelaporan yang telah dikirimkan sedang dalam tahap verifikasi faktual dan sinkronisasi dengan pangkalan data Kementerian Dalam Negeri.",
    timeline: [
      { phase: "Masa Penginputan Berkas", period: "01 Agu - 30 Sep 2026" },
      { phase: "Verifikasi Nasional oleh BSKDN", period: "Oktober 2026" },
      { phase: "Rilis Hasil Penilaian Indeks", period: "Desember 2026" },
    ],
  },
];

// Data Pedoman
const stepsData = [
  {
    step: 1,
    title: "Aktivasi Akun Unit Kerja / OPD",
    subtitle: "Kredensial Resmi",
    description: "Admin inovasi unit kerja masuk menggunakan akun yang telah diverifikasi oleh Bappelitbang. Jika belum memiliki akses, lakukan permohonan melalui admin daerah.",
  },
  {
    step: 2,
    title: "Pengisian Profil Satuan Inovasi",
    subtitle: "Rancang Bangun & Latar Belakang",
    description: "Lengkapi identitas inovasi mencakup nama inovasi, tahapan penerapan (inisiatif, uji coba, atau penerapan), urusan pemerintahan terkait, serta deskripsi rancang bangun minimal 300 kata.",
  },
  {
    step: 3,
    title: "Penginputan 36 Indikator SPD & SPP",
    subtitle: "Pemenuhan Parameter Penilaian",
    description: "Isi setiap parameter penilaian mulai dari aspek regulasi, ketersediaan SDM, dukungan anggaran, kecepatan inovasi, hingga kemudahan proses layanan dengan memilih opsi yang sesuai fakta.",
  },
  {
    step: 4,
    title: "Pengunggahan Bukti Evidensi & Pengiriman",
    subtitle: "Validasi Berkas & Finalisasi",
    description: "Unggah seluruh dokumen pendukung bertipe PDF dan tautan video implementasi. Lakukan pengecekan mandiri sebelum menekan tombol kirim untuk diverifikasi tim penilai daerah.",
  },
];

const checklistData = [
  {
    category: "Regulasi & Dasar Hukum Inovasi",
    requirement: "Wajib",
    description: "Salinan Peraturan Kepala Daerah (Perbup) atau Surat Keputusan Kepala Perangkat Daerah terkait penetapan inisiatif/penerapan inovasi.",
    format: "PDF maks. 5 MB (Stempel & Tanda Tangan Basah/Elektronik)",
  },
  {
    category: "Ketersediaan SDM & Anggaran Pelaksana",
    requirement: "Wajib",
    description: "SK Penetapan Tim Pelaksana Inovasi dan petikan Dokumen Pelaksanaan Anggaran (DPA/RKA) yang memuat pembiayaan terkait operasional inovasi.",
    format: "PDF maks. 5 MB",
  },
  {
    category: "Pedoman Teknis / Standar Operasional Prosedur (SOP)",
    requirement: "Wajib",
    description: "Buku petunjuk operasional atau SOP tertulis yang memandu alur implementasi inovasi secara baku dan dapat dipelajari secara berkelanjutan.",
    format: "PDF maks. 10 MB",
  },
  {
    category: "Hasil Pengukuran Kemanfaatan & Efisiensi",
    requirement: "Wajib",
    description: "Laporan komparasi data sebelum dan sesudah implementasi inovasi (contoh: pemangkasan durasi layanan dari 3 hari menjadi 15 menit, atau efisiensi anggaran belanja).",
    format: "PDF tabel & grafik analitis maks. 5 MB",
  },
  {
    category: "Laporan Survei Kepuasan Masyarakat (SKM)",
    requirement: "Wajib",
    description: "Hasil survei kepuasan penerima manfaat minimal 1 (satu) semester terakhir yang diolah menggunakan metodologi Permenpan RB yang berlaku.",
    format: "PDF laporan rekapitulasi nilai SKM",
  },
  {
    category: "Tautan Video Dokumentasi Penerapan (3-5 Menit)",
    requirement: "Wajib",
    description: "Video visualisasi alur layanan inovasi, testimoni masyarakat pengguna, dan kondisi nyata di lapangan dengan audio jernih dan resolusi minimal 720p HD.",
    format: "Tautan YouTube (Unlisted/Public) atau Google Drive publik",
  },
];

export default function LandingIndeksInovasi() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [modalData, setModalData] = useState<{
    title: string;
    meta: string;
    content: string;
    timeline?: { phase: string; period: string }[];
  } | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  useEffect(() => {
    const updateNavbar = () => {
      const scrollPosition = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
      );
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-landing-card]"),
    );
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
          y: [28, 0],
          scale: [0.98, 1],
          duration: 560,
          delay: stagger(75),
          ease: "outCubic",
        });
      },
      { threshold: 0.12 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const pos = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Navbar menyatu dengan hero, lalu menjadi gelap ketika halaman digulir. */}
      <header
        className={`fixed top-0 z-40 w-full border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? "border-slate-800 bg-slate-950/95 shadow-lg shadow-slate-950/20 backdrop-blur-md"
            : "border-transparent bg-transparent max-lg:border-slate-800/80 max-lg:bg-slate-950/95 max-lg:shadow-lg max-lg:shadow-slate-950/20 max-lg:backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Lambang Kabupaten Karimun */}
            <div 
              onClick={() => handleScroll("beranda")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 relative flex-shrink-0">
                <Image 
                  src="/images/logo-karimun.svg" 
                  alt="Lambang Kabupaten Karimun" 
                  width={44}
                  height={44}
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-200/85 group-hover:text-white transition duration-150">
                  Kabupaten Karimun
                </span>
                <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight -mt-0.5">
                  Indeks Inovasi Daerah
                </span>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-7" aria-label="Navigasi Utama">
              <button 
                onClick={() => handleScroll("beranda")} 
                className="text-sm font-semibold text-slate-100 hover:text-emerald-300 transition duration-150"
              >
                Beranda
              </button>
              <button 
                onClick={() => handleScroll("sambutan")} 
                className="text-sm font-semibold text-slate-100 hover:text-emerald-300 transition duration-150"
              >
                Sambutan
              </button>
              <button 
                onClick={() => handleScroll("berita")} 
                className="text-sm font-semibold text-slate-100 hover:text-emerald-300 transition duration-150"
              >
                Berita
              </button>
              <button 
                onClick={() => handleScroll("pengumuman")} 
                className="text-sm font-semibold text-slate-100 hover:text-emerald-300 transition duration-150"
              >
                Pengumuman
              </button>
              <button 
                onClick={() => handleScroll("pedoman")} 
                className="text-sm font-semibold text-slate-100 hover:text-emerald-300 transition duration-150"
              >
                Pedoman
              </button>
              <button 
                onClick={() => handleScroll("galeri")} 
                className="text-sm font-semibold text-slate-100 hover:text-emerald-300 transition duration-150"
              >
                Galeri
              </button>
            </nav>

            {/* Desktop Log in Button (Pill Button Sesuai Sitemandesa mengarah ke /login) */}
            <div className="hidden sm:flex items-center gap-3">
              <Link 
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/75 px-6 py-1.5 text-sm font-semibold text-white hover:border-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all duration-200"
              >
                Log in
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none"
                aria-label="Toggle Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="flex flex-col space-y-1">
              <button onClick={() => handleScroll("beranda")} className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50">Beranda</button>
              <button onClick={() => handleScroll("sambutan")} className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50">Sambutan</button>
              <button onClick={() => handleScroll("berita")} className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50">Berita</button>
              <button onClick={() => handleScroll("pengumuman")} className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50">Pengumuman</button>
              <button onClick={() => handleScroll("pedoman")} className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50">Pedoman</button>
              <button onClick={() => handleScroll("galeri")} className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50">Galeri</button>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <Link 
                href="/login"
                className="w-full block text-center px-4 py-2.5 border border-slate-700 rounded-full text-sm font-semibold text-slate-800 hover:bg-slate-800 hover:text-white transition"
              >
                Log in ke Sistem
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION FULL PAGE DENGAN FOTO KARIMUN HD */}
      <section 
        id="beranda"
        className="relative min-h-screen w-full flex flex-col justify-between bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(11, 31, 75, 0.60), rgba(7, 21, 54, 0.65)), url('/images/hero-karimun-new.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 pointer-events-none"></div>
        <div className="w-full h-12 sm:h-20"></div>

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5 my-auto py-8">
          <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.25em] text-slate-200 font-semibold drop-shadow">
            SISTEM INFORMASI INDEKS INOVASI DAERAH
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight uppercase">
            KABUPATEN KARIMUN
          </h1>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base md:text-lg text-slate-200 drop-shadow font-normal max-w-3xl mx-auto">
            <span>Perluas Jangkauan, Tingkatkan Daya Saing Daerah Dengan</span>
            <span className="inline-block bg-emerald-600 text-white font-bold px-3 py-1 rounded-md text-xs sm:text-sm tracking-wide shadow-sm">
              smart system terintegrasi
            </span>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition duration-200"
            >
              <span>Masuk ke Sistem Pelaporan</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* 3 Circular Shortcut Icons (Format Sitemandesa) */}
        <div className="relative z-10 pb-10 sm:pb-14 pt-6">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-8 sm:gap-16">
            
            <button onClick={() => handleScroll("berita")} className="group flex flex-col items-center focus:outline-none">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 text-slate-900 border-2 border-amber-300 shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-300 transition-all duration-200">
                <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <span className="mt-2.5 text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 drop-shadow transition duration-150">
                Berita & Agenda
              </span>
            </button>

            <button onClick={() => handleScroll("pengumuman")} className="group flex flex-col items-center focus:outline-none">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 text-slate-900 border-2 border-amber-300 shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-300 transition-all duration-200">
                <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <span className="mt-2.5 text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 drop-shadow transition duration-150">
                Pengumuman Lomba
              </span>
            </button>

            <button onClick={() => handleScroll("pedoman")} className="group flex flex-col items-center focus:outline-none">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 text-slate-900 border-2 border-amber-300 shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-300 transition-all duration-200">
                <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="mt-2.5 text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 drop-shadow transition duration-150">
                Pedoman & Regulasi
              </span>
            </button>

          </div>
        </div>
      </section>

      {/* 3. SAMBUTAN KEPALA BAPPELITBANG (Selamat Datang) */}
      <section id="sambutan" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight">
              Selamat Datang
            </h2>
            <div className="w-12 h-1 bg-amber-400 mx-auto mt-2 rounded-full"></div>
          </div>

          <div data-landing-card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8 lg:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
              <div className="flex-shrink-0 text-center">
                <div className="w-48 h-56 sm:w-56 sm:h-64 rounded-xl overflow-hidden border-4 border-slate-100 shadow-md bg-slate-200 mx-auto relative">
                  <Image 
                    src="/images/kepala-bappelitbang.jpg" 
                    alt="Kepala Bappelitbang Kabupaten Karimun"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <span className="inline-block mt-3 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Pejabat Pimpinan Tinggi Pratama
                </span>
              </div>

              <div className="space-y-4 text-center md:text-left flex-grow">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight uppercase">
                    SAMBUTAN KEPALA BAPPELITBANG KABUPATEN KARIMUN
                  </h3>
                  <div className="w-20 h-1 bg-amber-400 mt-2 mb-4 mx-auto md:mx-0"></div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify md:text-left">
                  Puji syukur ke hadirat Tuhan Yang Maha Esa atas hadirnya portal resmi <strong>Indeks Inovasi Daerah (IID) Kabupaten Karimun</strong>. Portal ini dikembangkan sebagai wujud komitmen Pemerintah Daerah dalam mempercepat transformasi pelayanan publik, memetakan potensi keunggulan lokal, serta menumbuhkembangkan budaya berinovasi di seluruh Organisasi Perangkat Daerah dan unit kerja Bumi Berazam.
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify md:text-left">
                  Melalui pemenuhan 36 indikator kematangan inovasi dan integrasi pelaporan ke Badan Strategi Kebijakan Dalam Negeri (BSKDN) Kemendagri, mari kita wujudkan tata kelola pemerintahan yang adaptif, berintegritas, dan memberikan manfaat nyata bagi kesejahteraan masyarakat.
                </p>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-base font-bold text-slate-900">
                    DR. H. ADE SUMARDI, M.Si
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Kepala Badan Perencanaan, Penelitian dan Pengembangan Kabupaten Karimun
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BERITA & AGENDA TERKINI */}
      <section id="berita" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <span>Kanal Informasi Daerah</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Berita & Agenda Terkini
              </h2>
              <div className="w-14 h-1 bg-amber-400 mt-2 rounded-full"></div>
            </div>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {beritaData.map((item) => (
              <article key={item.id} data-landing-card className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-grow flex-col justify-between gap-5 p-5 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>

                    <h3 className="min-h-12 text-base font-bold text-slate-900 transition hover:text-emerald-700 sm:text-lg line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="min-h-[60px] text-xs leading-relaxed text-slate-600 sm:text-sm line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setModalData({
                        title: item.title,
                        meta: `${item.category} • ${item.date}`,
                        content: item.content,
                      })}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
                    >
                      <span>Baca selengkapnya</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PENGUMUMAN LOMBA INOVASI */}
      <section id="pengumuman" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <span>Agenda & Kompetisi Inovasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pengumuman Lomba Inovasi
            </h2>
            <div className="w-14 h-1 bg-amber-400 mt-2 rounded-full"></div>
          </div>

          <div className="space-y-5">
            {pengumumanData.map((item) => (
              <article key={item.id} data-landing-card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-6">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div className="flex items-start gap-4 sm:items-center">
                    <div className="w-20 flex-shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-center">
                      <span className="block text-xs font-semibold text-slate-500 uppercase">{item.date.split(" ")[1]}</span>
                      <span className="block text-xl font-extrabold text-slate-900">{item.date.split(" ")[0]}</span>
                      <span className="block text-[10px] text-slate-400 font-medium">{item.date.split(" ")[2]}</span>
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.status === "Dibuka" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            {item.status}
                          </span>
                        )}
                        {item.status === "Segera" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {item.status}
                          </span>
                        )}
                        {item.status === "Ditutup" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {item.status}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-medium">{item.category}</span>
                        <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                        <span className="text-xs text-slate-500 hidden sm:inline">Batas: <strong>{item.deadline}</strong></span>
                      </div>

                      <h3 className="text-base font-bold leading-snug text-slate-900 sm:text-lg">{item.title}</h3>
                      <p className="max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm">{item.summary}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 md:justify-end">
                    <button
                      type="button"
                      onClick={() => setModalData({
                        title: item.title,
                        meta: `Status: ${item.status} • Rilis: ${item.date}`,
                        content: item.description,
                        timeline: item.timeline,
                      })}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition hover:border-slate-800 hover:bg-slate-800 hover:text-white md:w-auto"
                    >
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PEDOMAN PENGINPUTAN & CHECKLIST DOKUMEN */}
      <section id="pedoman" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <span>Standarisasi Pelaporan IID</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pedoman Penginputan & Kelengkapan Dokumen
              </h2>
              <div className="w-14 h-1 bg-amber-400 mt-2 rounded-full"></div>
            </div>

            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => setModalData({
                  title: "Unduh Pedoman Teknis Indeks Inovasi Daerah",
                  meta: "Format: PDF • Ukuran: 3.8 MB • Edisi Revisi 2026",
                  content: "Buku Pedoman Teknis memuat seluruh petunjuk pengisian 36 indikator Satuan Inovasi Daerah (SPD & SPP) serta checklist kelengkapan dokumen sesuai standar Kementerian Dalam Negeri. Anda dapat mengunduh berkas lengkap melalui sistem aplikasi pelaporan.",
                })}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition"
              >
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-left">
                  <span className="block text-xs text-slate-300 font-normal">Unduh Pedoman Teknis</span>
                  <span className="block text-sm font-bold leading-tight">Pedoman (PDF) • 3.8 MB</span>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* 4 Steps */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Alur 4 Langkah Penginputan</h3>
                <p className="text-xs text-slate-500">Panduan teknis bagi operator inovasi perangkat daerah Kabupaten Karimun.</p>
              </div>

              <div className="space-y-4">
                {stepsData.map((s) => (
                  <article key={s.step} data-landing-card className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-md">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900">{s.title}</h4>
                      <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {s.subtitle}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">{s.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Checklist Accordion */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Checklist Kelengkapan Dokumen</h3>
                  <p className="text-xs text-slate-500">Format dan parameter bukti dukung yang wajib dilampirkan.</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">6 Kategori Utama</span>
              </div>

              <div className="space-y-3">
                {checklistData.map((item, index) => (
                  <article key={index} data-landing-card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:border-emerald-200 hover:shadow-md">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.requirement}
                        </span>
                        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeAccordion === index ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {activeAccordion === index && (
                      <div className="p-4 pt-0 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                        <p className="leading-relaxed text-slate-700 font-medium pt-2">{item.description}</p>
                        <p className="text-slate-500 pt-1">Ketentuan Format: <strong>{item.format}</strong></p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GALERI DOKUMENTASI (Sitemandesa Style) */}
      <section id="galeri" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight">Galeri</h2>
            <div className="w-12 h-1 bg-amber-400 mx-auto mt-2 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">Dokumentasi visual penerapan inisiatif inovasi di lingkungan Pemerintah Kabupaten Karimun.</p>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3">
            <article data-landing-card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
              <div className="relative aspect-video w-full bg-slate-900">
                <Image src="/images/hero-karimun-new.jpg" alt="Video Dokumentasi Inovasi" fill className="object-cover opacity-85" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h4 className="min-h-10 text-sm font-bold leading-snug text-slate-800 line-clamp-2">Visualisasi Inovasi Pelayanan Pesisir & Pulau Terluar</h4>
                <p className="text-xs text-slate-500 mt-1">Pemerintah Kabupaten Karimun</p>
              </div>
            </article>

            <article data-landing-card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
              <div className="relative aspect-video w-full bg-slate-100">
                <Image src="/images/hero-karimun-new.jpg" alt="Monitoring Lapangan" fill className="object-cover" />
              </div>
              <div className="p-5">
                <h4 className="min-h-10 text-sm font-bold leading-snug text-slate-800 line-clamp-2">Monitoring Lapangan Verifikasi Berkas Evidensi Inovasi</h4>
                <p className="text-xs text-slate-500 mt-1">Bappelitbang Kabupaten Karimun</p>
              </div>
            </article>

            <article data-landing-card className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
              <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center p-6">
                <Image src="/images/logo-karimun.svg" alt="Kabupaten Karimun" width={90} height={90} className="drop-shadow-md" />
              </div>
              <div className="p-5">
                <h4 className="min-h-10 text-sm font-bold leading-snug text-slate-800 line-clamp-2">Katalog Profil Inovasi Daerah Bumi Berazam</h4>
                <p className="text-xs text-slate-500 mt-1">Kementerian Dalam Negeri Republik Indonesia</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 8. CTA BANNER (Akses ke Login) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden px-6 py-12 sm:px-12 sm:py-16 shadow-xl border border-slate-800 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 shadow-sm">
              Akses Aplikasi Pelaporan IID
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Siap Melaporkan dan Mengembangkan Inovasi Daerah Anda?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Pastikan seluruh satuan inovasi perangkat daerah, kecamatan, dan unit kerja di Kabupaten Karimun terdata secara tepat waktu sebelum batas akhir penilaian periode tahun ini.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg transition"
              >
                <span>Masuk ke Sistem Aplikasi</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER KUNING KHAS SITEMANDESA */}
      <footer className="bg-amber-400 text-slate-900 pt-16 pb-10 border-t border-amber-500 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-amber-600/30">
            <div className="space-y-4">
              <div className="w-16 h-16 relative">
                <Image src="/images/logo-karimun.svg" alt="Lambang Kabupaten Karimun" width={64} height={64} className="drop-shadow" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">Pemerintah Kabupaten Karimun</h3>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">Badan Perencanaan, Penelitian dan Pengembangan (Bappelitbang)</p>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">Pusat Informasi & Pelaporan Indeks Inovasi Daerah (IID) untuk mewujudkan kemandirian dan daya saing daerah Bumi Berazam.</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">About</h4>
              <div className="space-y-2.5 text-xs text-slate-800 font-medium">
                <p>Jl. Jend. Sudirman Poros No. 1, Komplek Perkantoran Pemkab Karimun, Kepulauan Riau</p>
                <p>(0777) 7366-012 / 0812-7000-8890</p>
                <p>bappelitbang@karimunkab.go.id</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Link</h4>
              <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                <li><button onClick={() => handleScroll("beranda")} className="hover:text-white transition">Beranda</button></li>
                <li><button onClick={() => handleScroll("sambutan")} className="hover:text-white transition">Sambutan Kepala Bappelitbang</button></li>
                <li><button onClick={() => handleScroll("berita")} className="hover:text-white transition">Berita & Agenda Terkini</button></li>
                <li><button onClick={() => handleScroll("pengumuman")} className="hover:text-white transition">Pengumuman Lomba Inovasi</button></li>
                <li><button onClick={() => handleScroll("pedoman")} className="hover:text-white transition">Pedoman & Regulasi IID</button></li>
                <li><button onClick={() => handleScroll("galeri")} className="hover:text-white transition">Galeri Dokumentasi</button></li>
                <li><Link href="/login" className="font-bold underline hover:text-white transition">Log in Sistem</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Media Sosial</h4>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-900 font-medium gap-3">
            <p>Kabupaten Karimun &mdash; Negeri Berazam</p>
            <p>&copy; Copyrights. All rights reserved. Bappelitbang Karimun &mdash; Indeks Inovasi Daerah {new Date().getFullYear()}.</p>
          </div>
        </div>
      </footer>

      {/* 10. MODAL DIALOG INTERAKTIF */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
              <div className="space-y-1">
                <span className="inline-block text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {modalData.meta}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {modalData.title}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setModalData(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>{modalData.content}</p>
              {modalData.timeline && modalData.timeline.length > 0 && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h4 className="font-semibold text-slate-900 text-sm mb-3">Jadwal & Tahapan Pelaksanaan:</h4>
                  <div className="space-y-2">
                    {modalData.timeline.map((t, idx) => (
                      <div key={idx} className="flex items-start justify-between text-sm py-1.5 px-3 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-800 font-medium">{t.phase}</span>
                        <span className="text-slate-500 font-mono text-xs">{t.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button 
                type="button" 
                onClick={() => setModalData(null)}
                className="px-5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
