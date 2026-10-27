"use client";

// --- Types ---

export type BeritaItem = {
  id: string;
  slug?: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  readTime: string;
};

export type TimelineItem = {
  phase: string;
  period: string;
};

export type PengumumanItem = {
  id: string;
  title: string;
  date: string;
  deadline: string;
  status: string;
  category: string;
  summary: string;
  description: string;
  timeline: TimelineItem[];
};

export type StepItem = {
  step: number;
  title: string;
  subtitle: string;
  description: string;
};

export type ChecklistItem = {
  category: string;
  requirement: string;
  description: string;
  format: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ModalData = {
  title: string;
  meta: string;
  content: string;
  timeline?: TimelineItem[];
} | null;

// --- Data Constants ---

export const beritaData: BeritaItem[] = [
  {
    id: "berita-1",
    title: "Sosialisasi Pengukuran dan Penilaian Indeks Inovasi Daerah Tahun 2026",
    date: "18 Oktober 2026",
    category: "Sosialisasi",
    image: "/images/hero-karimun-new.jpg",
    excerpt: "Pemerintah Kabupaten Karimun menyelenggarakan sosialisasi pedoman penilaian Indeks Inovasi Daerah (IID) kepada seluruh Organisasi Perangkat Daerah dan unit kerja.",
    content: "Dalam rangka meningkatkan kematangan ekosistem inovasi di daerah, Pemerintah Kabupaten Karimun melalui Baperlitbang menggelar agenda sosialisasi teknis pengukuran Indeks Inovasi Daerah (IID) tahun 2026. Kegiatan ini diikuti oleh perwakilan admin inovasi dari seluruh OPD, kecamatan, serta unit pelaksana teknis. Fokus utama pertemuan ini mencakup pemahaman indikator satuan inovasi, pemenuhan bukti dukung berbobot tinggi, dan penyelarasan jadwal pelaporan ke sistem nasional Badan Strategi Kebijakan Dalam Negeri (BSKDN) Kemendagri.",
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

export const faqData: FaqItem[] = [
  {
    question: "Apa itu Indeks Inovasi Daerah (IID)?",
    answer: "Indeks Inovasi Daerah adalah sistem penilaian yang dikembangkan oleh Kemendagri untuk mengukur tingkat kematangan inovasi di tingkat pemerintah daerah, mencakup aspek regulasi, SDM, dan dampak kemanfaatan bagi masyarakat.",
  },
  {
    question: "Siapa saja yang wajib melaporkan inovasi?",
    answer: "Seluruh Organisasi Perangkat Daerah (OPD), Kecamatan, Kelurahan, Puskesmas, dan Unit Pelaksana Teknis (UPT) di lingkungan Pemerintah Kabupaten Karimun wajib melaporkan inovasi yang telah dilaksanakan.",
  },
  {
    question: "Apa saja kriteria inovasi yang dapat didaftarkan?",
    answer: "Inovasi harus memenuhi kriteria: mengandung unsur kebaruan, memberi manfaat bagi masyarakat, dapat direplikasi, dan telah diimplementasikan minimal 2 tahun (untuk kategori penerapan).",
  },
  {
    question: "Bagaimana cara mendapatkan akun pelaporan?",
    answer: "Akun pelaporan diberikan secara resmi oleh Baperlitbang Kabupaten Karimun melalui Admin Daerah. Unit kerja yang belum memiliki akses dapat mengajukan permohonan tertulis kepada Kepala Baperlitbang.",
  },
  {
    question: "Kapan batas waktu penginputan data tahunan?",
    answer: "Jadwal penginputan biasanya dibuka pada kuartal kedua setiap tahunnya. Detail jadwal spesifik dapat dilihat pada section Pengumuman di portal ini.",
  },
];

export const pengumumanData: PengumumanItem[] = [
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

export const stepsData: StepItem[] = [
  {
    step: 1,
    title: "Aktivasi Akun Unit Kerja / OPD",
    subtitle: "Kredensial Resmi",
    description: "Admin inovasi unit kerja masuk menggunakan akun yang telah diverifikasi oleh Baperlitbang. Jika belum memiliki akses, lakukan permohonan melalui admin daerah.",
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

export const checklistData: ChecklistItem[] = [
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

export const navLinks = [
  { id: "beranda", label: "Beranda" },
  { id: "sambutan", label: "Sambutan" },
  { id: "berita", label: "Berita" },
  { id: "pengumuman", label: "Pengumuman" },
  { id: "pedoman", label: "Pedoman" },
  { id: "galeri", label: "Galeri" },
  { id: "faq", label: "FAQ" },
];
