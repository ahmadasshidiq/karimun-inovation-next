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
  { step: 1, title: "Login ke Sistem", subtitle: "Akses Akun", description: "Pengaju masuk menggunakan akun yang diberikan administrator." },
  { step: 2, title: "Tambah Inovasi", subtitle: "Mulai Pengajuan", description: "Buka menu pengajuan inovasi dan mulai formulir baru." },
  { step: 3, title: "Isi Identitas Inovasi", subtitle: "Profil Inovasi", description: "Lengkapi nama, tahapan, inisiator, klasifikasi, jenis, bentuk, lokasi, dan urusan pemerintahan." },
  { step: 4, title: "Isi Kategori dan Periode", subtitle: "Kategori & Waktu", description: "Pilih Asta Cita, PKPN, tanggal uji coba, penerapan, serta pengembangan terbaru." },
  { step: 5, title: "Isi Deskripsi Inovasi", subtitle: "Rancang Bangun", description: "Lengkapi rancang bangun minimal 300 kata, tujuan, manfaat, dan hasil inovasi." },
  { step: 6, title: "Lengkapi Indikator", subtitle: "Bukti Pendukung", description: "Isi indikator SID dan unggah bukti pendukung. Data SPD dilengkapi pada tingkat pemerintah daerah." },
  { step: 7, title: "Periksa Dokumen", subtitle: "Pengecekan Mandiri", description: "Pastikan seluruh isian wajib dan bukti pendukung sesuai dengan indikator." },
  { step: 8, title: "Kirim untuk Verifikasi", subtitle: "Pengajuan", description: "Ajukan data untuk diperiksa sesuai alur persetujuan internal website." },
  { step: 9, title: "Tindak Lanjut", subtitle: "Revisi", description: "Perbaiki isian apabila ada catatan pemeriksa, kemudian ajukan kembali." },
];

export const checklistData: ChecklistItem[] = [
  { category: "Nama inovasi daerah", requirement: "Wajib", description: "Nama resmi inovasi yang dilaporkan.", format: "Profil inovasi" },
  { category: "Tahapan inovasi dan identitas inisiator", requirement: "Wajib", description: "Tahapan inovasi serta pihak yang menginisiasi.", format: "Profil inovasi" },
  { category: "Klasifikasi, jenis, dan bentuk inovasi", requirement: "Wajib", description: "Lengkapi klasifikasi, jenis, dan bentuk inovasi.", format: "Profil inovasi" },
  { category: "Titik koordinat lokasi pelaksanaan", requirement: "Wajib", description: "Lokasi pelaksanaan inovasi.", format: "Koordinat lokasi" },
  { category: "Kategori Asta Cita dan PKPN", requirement: "Wajib", description: "Pilih kategori Asta Cita dan PKPN yang sesuai.", format: "Profil inovasi" },
  { category: "Urusan pemerintahan utama", requirement: "Wajib", description: "Urusan pemerintahan yang terkait dengan inovasi.", format: "Profil inovasi" },
  { category: "Tanggal uji coba dan penerapan awal", requirement: "Wajib", description: "Tanggal uji coba dan penerapan awal inovasi.", format: "Profil inovasi" },
  { category: "Tanggal pengembangan terbaru", requirement: "Kondisional", description: "Diisi jika inovasi telah mengalami pengembangan.", format: "Profil inovasi" },
  { category: "Rancang bangun inovasi minimal 300 kata", requirement: "Wajib", description: "Jelaskan rancang bangun inovasi secara lengkap.", format: "Teks minimal 300 kata" },
  { category: "Tujuan, manfaat, dan hasil inovasi", requirement: "Wajib", description: "Lengkapi tujuan, manfaat, dan hasil inovasi.", format: "Profil inovasi" },
  { category: "Dokumen anggaran", requirement: "Jika tersedia", description: "Dokumen pembiayaan inovasi.", format: "Dokumen pendukung" },
  { category: "Dokumen profil bisnis", requirement: "Jika ada", description: "Profil bisnis inovasi jika tersedia.", format: "Dokumen pendukung" },
  { category: "Sertifikat HAKI", requirement: "Jika tersedia", description: "Sertifikat hak kekayaan intelektual.", format: "Dokumen pendukung" },
  { category: "Piagam atau SK penghargaan inovasi", requirement: "Jika tersedia", description: "Piagam atau SK penghargaan inovasi.", format: "Dokumen pendukung" },
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
