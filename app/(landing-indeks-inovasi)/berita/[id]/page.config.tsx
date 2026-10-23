export type BeritaArticle = {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
  readTime: string;
};

export const beritaArticles: BeritaArticle[] = [
  { id: "berita-1", title: "Sosialisasi Pengukuran dan Penilaian Indeks Inovasi Daerah Tahun 2026", date: "18 Oktober 2026", category: "Sosialisasi", image: "/images/hero-karimun-new.jpg", content: "Dalam rangka meningkatkan kematangan ekosistem inovasi di daerah, Pemerintah Kabupaten Karimun melalui Baperlitbang menggelar agenda sosialisasi teknis pengukuran Indeks Inovasi Daerah tahun 2026. Kegiatan ini diikuti oleh perwakilan admin inovasi dari seluruh OPD, kecamatan, serta unit pelaksana teknis. Fokus utama pertemuan mencakup pemahaman indikator satuan inovasi, pemenuhan bukti dukung berbobot tinggi, dan penyelarasan jadwal pelaporan ke sistem nasional.", readTime: "4 menit baca" },
  { id: "berita-2", title: "Bimbingan Teknis Penginputan 36 Indikator Satuan Inovasi Berbasis Digital", date: "12 Oktober 2026", category: "Bimbingan Teknis", image: "/images/hero-karimun-new.jpg", content: "Badan Perencanaan, Penelitian, dan Pengembangan Kabupaten Karimun memfasilitasi Bimbingan Teknis penginputan 36 indikator satuan inovasi daerah. Peserta diajarkan teknik verifikasi mandiri terhadap kelengkapan dokumen, parameter kemanfaatan ekonomi dan sosial, survei kepuasan masyarakat, hingga format video dokumentasi inovasi sesuai standar validasi.", readTime: "5 menit baca" },
  { id: "berita-3", title: "Pendampingan Lapangan Validasi Dokumen Evidensi Inovasi Pelayanan Publik", date: "05 Oktober 2026", category: "Diseminasi", image: "/images/hero-karimun-new.jpg", content: "Memasuki tahapan pra-evaluasi, tim penilai inovasi daerah melaksanakan pendampingan langsung ke berbagai unit pelayanan publik di Kabupaten Karimun. Peninjauan ini memastikan inovasi yang telah didaftarkan benar-benar diterapkan, memiliki dampak efisiensi waktu layanan, serta didukung testimoni kepuasan pengguna layanan.", readTime: "3 menit baca" },
];

export const getBeritaArticle = (id: string) => beritaArticles.find((article) => article.id === id);
