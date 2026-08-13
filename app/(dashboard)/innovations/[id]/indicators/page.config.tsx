"use client";

import type React from "react";
import { FileUp } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type IndicatorDto = {
  id: number;
  indicator: string;
  description: string;
  information: string;
  weight: number;
  parameters: string[];
  supportingData: string;
  fileTypes: string;
};

export const indicators: IndicatorDto[] = [
  {
    id: 1,
    indicator: "Regulasi Inovasi Daerah",
    description:
      "Regulasi yang menetapkan nama-nama inovasi daerah yang menjadi landasan operasional penerapan Inovasi Daerah.",
    information: 
      "Pilih jenis regulasi inovasi daerah yang ditetapkan. Dibuktikan dengan halaman depan Perda atau Perkada atau SK Kepala Daerah serta halaman yang memuat nama inovasi yang sah dan valid serta sesuai pada tahun penerapan (pdf). Catatan: a. Perkada/SK Kepala Daerah/SK Kepala Perangkat Daerah atas nama Kepala Daerah harus memuat nama inovasi (bisa dalam lampiran). b. Perda yang menjadi landasan inovasi daerah tidak perlu melampirkan nama inovasi daerah namun disertai dengan dokumen Perkada/SK Kepala Daerah/SK Kepala Perangkat Daerah atas nama Kepala Daerah yang memuat daftar inovasi dan juncto (berkenaan/berhubungan) dengan perda tersebut. c. Perda dan Perkada masih berlaku dan diatur sebelum tahun 2026. d. SK Kepala Daerah/SK Kepala Perangkat Daerah atas nama Kepala Daerah ditetapkan sesuai dengan tahun penerapan inovasi. e. Pengaturan teknis terkait bentuk dokumen regulasi yang ditetapkan dapat merujuk pada Permendagri No. 1 Tahun 2023 tentang Tata Naskah di Lingkungan Pemerintah daerah.",
    weight: 3,
    parameters: [
      "SK Kepala Daerah atau Keputusan yang ditandatangani oleh Kepala Perangkat Daerah atas nama Kepala Daerah",
      "Peraturan Kepala Daerah",
      "Peraturan Daerah",
    ],
    supportingData:
      "Halaman depan Perda atau Perkada atau SK Kepala Daerah serta halaman yang memuat nama inovasi yang sah dan valid serta sesuai pada tahun penerapan.",
    fileTypes: "PDF",
  },
  {
    id: 2,
    indicator: "Ketersediaan dan peran SDM terhadap inovasi daerah",
    description:
      "Jumlah SDM yang mengelola suatu inovasi daerah (dalam dua tahun terakhir) dan peran masing-masing dalam inovasi.",
    information:
      "Pilih jumlah SDM yang mengelola inovasi daerah atau jumlah tim efektif yang dibentuk untuk menangani suatu inovasi dan peran masing-masing personil dalam inovasi (T-2,T-1, T-0). Dibuktikan dengan SK yang ditetapkan oleh Kepala Daerah atau Surat Penugasan/Surat Perintah yang telah disahkan/ditandatangani baik elektronik maupun ttd basah (pdf). Apabila dokumen T-2 dan T-1 belum memuat peran masing-masing SDM, maka dapat melampirkan tambahan Surat Keputusan atau Surat Penugasan yang mencantumkan peran masing-masing SDM dan dikeluarkan pada tahun T-0.",
    weight: 2,
    parameters: ["1-10 SDM", "11-30 SDM", "Lebih dari 30"],
    supportingData:
      "SK yang ditetapkan oleh Kepala Daerah atau Surat Penugasan/Surat Perintah yang telah disahkan/ditandatangani baik elektronik maupun ttd basah.",
    fileTypes: "PDF",
  },
  {
    id: 3,
    indicator: "Dukungan anggaran",
    description:
      "Anggaran inovasi daerah dalam APBD dengan tahapan penerapan (penyediaan sarana prasarana, sumber daya manusia dan layanan, bimtek, urusan jenis layanan). Penerapan inovasi yang dilakukan sudah menjadi bagian dari kegiatan yang mendapatkan alokasi anggaran.",
    information:
      "Pilih tahun anggaran yang memuat mata anggaran penerapan inovasi daerah. Dibuktikan dengan bab, bagian, dan halaman dokumen anggaran yang memuat program dan kegiatan inovasi daerah sesuai dengan tahun anggaran (pdf). Wajib melakukan highlight/tanda pada mata item belanja yang digunakan untuk mendukung pelaksanaan inovasi. Keterangan tambahan: Sektor pendidikan (sekolah) dapat menggunakan anggaran yang berasal dari Bantuan Operasional Satuan Pendidikan (BOSP); Sektor kesehatan (puskesmas, rumah sakit, klinik) dapat menggunakan anggaran yang bersumber dari Bantuan Operasional Kesehatan (BOK)/Jaminan Kesehatan Nasional (JKN).",
    weight: 2,
    parameters: [
      "Anggaran dialokasikan pada kegiatan penerapan inovasi pada salah satu tahun anggaran (T-2/T-1/T-0)",
      "Anggaran dialokasikan pada kegiatan penerapan inovasi pada dua tahun berturut-turut (T-1 dan T-0 atau T-1 dan T-2)",
      "Anggaran dialokasikan pada kegiatan penerapan inovasi di T-0, T-1 dan T-2",
    ],
    supportingData:
      "Bab, bagian, dan halaman dokumen anggaran yang memuat program dan kegiatan inovasi daerah sesuai dengan tahun anggaran. Wajib melakukan highlight/tanda pada mata item belanja yang digunakan untuk mendukung pelaksanaan inovasi.",
    fileTypes: "PDF",
  },
  {
    id: 4,
    indicator: "Alat Kerja",
    description:
      "Alat kerja yang digunakan dalam pelaksanaan inovasi yang mudah diakses oleh pengguna misalnya pemanfaatan platform digital untuk media sosialisasi, pemberian layanan inovasi, dan perolehan data/informasi dan lain-lain. Contoh manual/non elektronik: tatap muka/jemput bola/noken. Contoh perangkat elektronik: mesin edc, telp. Sistem informasi online/daring: pemanfaatan platform media sosial, AI, IoT, superApp, dll.",
    information:
      "Dibuktikan Foto Kegiatan/Gambar Screenshot layar (pdf/jpeg/jpg/png).",
    weight: 2,
    parameters: [
      "Pelaksanaan kerja secara manual/non elektronik",
      "Pelaksanaan kerja didukung dengan perangkat elektronik",
      "Pelaksanaan kerja sudah didukung sistem informasi online/daring/Artificial Intelligence",
    ],
    supportingData: "Foto Kegiatan/Gambar Screenshot layar.",
    fileTypes: "PDF/JPEG/JPG/PNG",
  },
  {
    id: 5,
    indicator: "Bimtek",
    description:
      "Peningkatan kapasitas dan kompetensi pelaksana inovasi daerah baik sebagai penyedia atau penerima bimtek.",
    information:
      "Pilih frekuensi kegiatan bimtek atau kegiatan transfer pengetahuan terkait substansi urusan inovasi. Dibuktikan dengan SK Kegiatan/Surat Tugas/Undangan yang disertai dengan Daftar Hadir dan Sertifikat pada kegiatan bimtek atau kegiatan transfer pengetahuan (pdf). Sertakan bukti dukung sejumlah frekuensi pelaksanaan bimtek (Sertifikat minimal satu).",
    weight: 1,
    parameters: [
      "Dalam 3 tahun (T-2,T-1,T-0) terakhir pernah 1 kali bimtek (bimtek/training/TOT)",
      "Dalam 3 tahun (T-2,T-1,T-0) terakhir pernah 2 kali bimtek (bimtek/training/TOT)",
      "Dalam 3 tahun (T-2,T-1,T-0) terakhir pernah 3 kali atau lebih bimtek (bimtek/training/TOT)",
    ],
    supportingData:
      "SK Kegiatan/Surat Tugas/Undangan yang disertai dengan Daftar Hadir dan Sertifikat pada kegiatan bimtek atau kegiatan transfer pengetahuan.",
    fileTypes: "PDF",
  },
  {
    id: 6,
    indicator: "Integrasi Program Dan Kegiatan Inovasi Dalam RKPD",
    description:
      "Inovasi Perangkat Daerah telah dituangkan dalam program pembangunan daerah.",
    information:
      "Pilih tahun RKPD yang memuat program kegiatan inovasi daerah. Dibuktikan dengan Bab, Bagian, dan Halaman Dokumen RKPD yang memuat program dan kegiatan inovasi daerah (pdf). Wajib melakukan highlight/tanda pada bagian yang memuat program/kegiatan inovasi dimaksud. Keterangan tambahan: penyesuaian dokumen perencanaan sejenis untuk masing-masing instansi, antara lain: Sekolah dapat menggunakan Rencana Kegiatan dan Anggaran Sekolah (RKAS); Puskesmas dapat menggunakan Rencana Usulan Kegiatan (RUK)/Rencana Pelaksanaan Kegiatan (RPK); BLUD menggunakan Rencana Bisnis dan Anggaran (RBA); BUMD menggunakan Rencana Kerja dan Anggaran (RKA)/Rencana Bisnis Anggaran (RBA); Desa menggunakan Rencana Kerja Pemerintah Desa.",
    weight: 2,
    parameters: [
      "Pemerintah daerah sudah menuangkan program inovasi daerah dalam RKPD T-1 atau T-2",
      "Pemerintah daerah sudah menuangkan program inovasi daerah dalam RKPD T-1 dan T-2",
      "Pemerintah daerah sudah menuangkan program inovasi daerah dalam RKPD T-1, T-2 dan T0 (T0 adalah tahun berjalan)",
    ],
    supportingData:
      "Bab, Bagian, dan Halaman Dokumen RKPD yang memuat program dan kegiatan inovasi daerah.",
    fileTypes: "PDF",
  },
  {
    id: 7,
    indicator: "Keterlibatan aktor inovasi",
    description:
      "Keikutsertaan unsur stakeholder dalam pelaksanaan inovasi daerah (T-1 dan/atau T-2).",
    information:
      "Pilih jumlah unsur stakeholder yang terlibat dalam pelaksanaan inovasi daerah yang terdiri atas unsur-unsur seperti akademisi, bisnis, komunitas, pemerintah, dan media. Untuk Tahun dokumen/berkas saat ini dapat dikeluarkan di tahun T-0, T-1,T-2. Dokumen dapat berupa SK, Dokumen Kerjasama, Dokumen Hibah, CSR, Publikasi Berita Media, terkhusus aktor masyarakat dapat berbentuk FGD/Rembug Warga/Musrenbang/Sarasehan/Noken/dll (Undangan/Foto kegiatan).",
    weight: 1,
    parameters: [
      "Inovasi melibatkan 3 Aktor (Termasuk pelaksana)",
      "Inovasi melibatkan 4 Aktor",
      "Inovasi melibatkan 5 Aktor atau lebih",
    ],
    supportingData:
      "SK, Dokumen Kerjasama, Dokumen Hibah, CSR, Publikasi Berita Media, Undangan/Foto kegiatan FGD/Rembug Warga/Musrenbang/Sarasehan/Noken/dll.",
    fileTypes: "PDF/JPEG/JPG/PNG",
  },
  {
    id: 8,
    indicator: "Pelaksana inovasi daerah",
    description: "Penetapan tim pelaksana inovasi daerah.",
    information:
      "Pilih tingkatan penetapan tim pelaksana inovasi daerah. Dibuktikan dengan SK/Surat Penugasan/Surat Perintah oleh Kepala Daerah atau Surat Penugasan/Surat Perintah dari Kepala Perangkat Daerah atau bukan Kepala Perangkat Daerah seperti Kepala Puskesmas, Kepala Sekolah dan sebagainya (pdf).",
    weight: 1,
    parameters: [
      "Ada pelaksana namun tidak ditetapkan dengan Surat Penugasan Kepala Perangkat Daerah atau SK Kepala Daerah",
      "Ada pelaksana dan ditetapkan dengan Surat Penugasan atau Surat Perintah Kepala Perangkat Daerah atau yang setara",
      "Ada pelaksana dan ditetapkan dengan SK/Surat Penugasan/Surat Perintah Kepala Daerah dan/atau SK Kepala Perangkat Daerah atas nama Kepala Daerah",
    ],
    supportingData:
      "SK/Surat Penugasan/Surat Perintah oleh Kepala Daerah atau Surat Penugasan/Surat Perintah dari Kepala Perangkat Daerah atau bukan Kepala Perangkat Daerah seperti Kepala Puskesmas, Kepala Sekolah dan sebagainya.",
    fileTypes: "PDF",
  },
  {
    id: 9,
    indicator: "Jejaring inovasi",
    description:
      "Jumlah Perangkat Daerah yang terlibat dalam penerapan inovasi (dalam 2 tahun terakhir).",
    information:
      "Pilih jumlah perangkat daerah yang terlibat dalam penerapan masing-masing inovasi daerah. Dibuktikan dengan Surat Keputusan/Surat Penugasan/Surat Perintah dari Kepala Daerah atau Surat Penugasan/Surat Perintah dari Kepala Perangkat Daerah (pdf).",
    weight: 1,
    parameters: [
      "Inovasi melibatkan 2 Perangkat Daerah",
      "Inovasi melibatkan 3-4 Perangkat Daerah",
      "Inovasi melibatkan 5 Perangkat Daerah atau lebih",
    ],
    supportingData:
      "Surat Keputusan/Surat Penugasan/Surat Perintah dari Kepala Daerah atau Surat Penugasan/Surat Perintah dari Kepala Perangkat Daerah.",
    fileTypes: "PDF",
  },
  {
    id: 10,
    indicator: "Sosialisasi Inovasi Daerah",
    description: "Penyebarluasan informasi kebijakan inovasi daerah.",
    information:
      "Pilih bukti kegiatan penyebarluasan informasi kebijakan inovasi daerah. Dibuktikan dengan dokumentasi dan publikasi (Foto kegiatan/seminar/display pameran inovasi atau screenshot konten pada media sosial/website atau pemberitaan media massa cetak/elektronik) (jpeg/jpg/png) serta Dokumen diperkenankan dikeluarkan pada T-0.",
    weight: 1,
    parameters: [
      "Foto kegiatan yang berlatar belakang spanduk kegiatan inovasi",
      "Konten melalui Media Sosial atau pemberitaan yang Media Berita (Bukan milik pemerintah daerah)",
    ],
    supportingData:
      "Dokumentasi dan publikasi (Foto kegiatan/seminar/display pameran inovasi atau screenshot konten pada media sosial/website atau pemberitaan media massa cetak/elektronik).",
    fileTypes: "JPEG/JPG/PNG",
  },
  {
    id: 11,
    indicator: "Pedoman teknis",
    description:
      "Ketentuan dasar penggunaan inovasi daerah berupa buku petunjuk/manual book.",
    information:
      "Pilih jenis pedoman teknis yang tersedia. Dibuktikan dengan dokumen manual book/Buku petunjuk (pdf) atau screenshot penggunaan inovasi daerah dan link publikasi pedoman teknis inovasi dimaksud (jpg/jpeg/png).",
    weight: 1,
    parameters: [
      "Telah terdapat Pedoman teknis berupa buku manual",
      "Telah terdapat Pedoman teknis berupa buku dalam bentuk elektronik",
      "Telah terdapat Pedoman teknis berupa buku yang dapat diakses secara online",
    ],
    supportingData:
      "Dokumen manual book/Buku petunjuk atau screenshot penggunaan inovasi daerah dan link publikasi pedoman teknis inovasi dimaksud.",
    fileTypes: "PDF/JPG/JPEG/PNG",
  },
  {
    id: 12,
    indicator: "Kemudahan informasi layanan",
    description:
      "Kemudahan mendapatkan informasi layanan, melalui metode sebagai berikut: 1. Manual, seperti: tatap muka/jemput bola/noken/unit pelayanan administrasi 2. Hotline, seperti: layanan email/telp 3. Media Sosial, seperti: instagram/facebook/whatsapp, dsb 4. Layanan Online melalui website/webaplikasi/aplikasi mobile (android atau ios)/Artificial Intelligence (seperti: chatbot) berbagai segmentasi pengguna.",
    information:
      "Contoh: layanan perbankan dilakukan melalui tatap muka/langsung, call center dan digital banking (internet banking, phone banking, sms banking, mobile banking) yang mengakomodir berbagai segmentasi pengguna. Pilih jumlah metode yang digunakan untuk memberikan informasi layanan yang tersedia. Dibuktikan dengan screenshot pada masing-masing metode dan dilampirkan secara terpisah (jpeg/jpg/png).",
    weight: 1,
    parameters: [
      "Informasi layanan diperoleh melalui 1 dari 4 metode",
      "Informasi layanan diperoleh melalui 2 dari 4 metode",
      "Informasi layanan diperoleh melalui 3 atau lebih metode",
    ],
    supportingData:
      "Screenshot pada masing-masing metode dan dilampirkan secara terpisah.",
    fileTypes: "JPEG/JPG/PNG",
  },
  {
    id: 13,
    indicator: "Kemudahan proses inovasi yang dihasilkan",
    description:
      "Indikator ini ditujukan untuk mengukur kecepatan layanan inovasi yang diperoleh oleh pengguna.",
    information:
      "Pilih waktu yang diperlukan untuk memperoleh proses penggunaan hasil inovasi. Dibuktikan dengan SOP pelaksanaan inovasi daerah yang memuat tahapan pelaksanaan dan durasi waktu layanan (hari kalender) dan dokumen yang disahkan oleh pejabat atau pihak yang berwenang (pdf).",
    weight: 2,
    parameters: [
      "Hasil inovasi diperoleh dalam waktu 6 hari atau lebih",
      "Hasil inovasi diperoleh dalam waktu 2-5 hari",
      "Hasil inovasi diperoleh dalam waktu 1 hari",
    ],
    supportingData:
      "SOP pelaksanaan inovasi daerah yang memuat tahapan pelaksanaan dan durasi waktu layanan (hari kalender) dan dokumen yang disahkan oleh pejabat atau pihak yang berwenang.",
    fileTypes: "PDF",
  },
  {
    id: 14,
    indicator: "Penyelesaian layanan pengaduan",
    description:
      "Rasio pengaduan yang tertangani dalam tahun terakhir, meliputi keluhan, kritik konstruktif, saran, dan pengaduan lainnya terkait layanan inovasi.",
    information:
      "Pilih rentang rasio penyelesaian pengaduan dalam 2 (dua) tahun terakhir. Dibuktikan dengan dokumen Foto Kegiatan penyelesaian pengaduan/screenshot media layanan pengaduan yang disertai dengan rekapitulasi pengaduan dan persentase rasio penyelesaian pengaduan.",
    weight: 1,
    parameters: ["≤ 50% atau Tidak ada pengaduan", "51% s.d. 90%", "≥ 91%"],
    supportingData:
      "Foto Kegiatan penyelesaian pengaduan/screenshot media layanan pengaduan yang disertai dengan rekapitulasi pengaduan dan persentase rasio penyelesaian pengaduan.",
    fileTypes: "JPG/JPEG/PNG",
  },
  {
    id: 15,
    indicator: "Layanan Terintegrasi",
    description:
      "Inovasi dibangun secara terpadu dengan mengedepankan prinsip integrasi dan interoperabilitas layanan. Prinsip integrasi bermaksud menggabungkan beberapa layanan terpisah kedalam satu platform atau dalam satu siklus berkelanjutan, sedangkan interoperabilitas bermakna menghubungkan data antar layanan.",
    information:
      "Pilih sub indikator yang sesuai dengan jenis inovasi (digital dan nondigital). a. Sub indikator digital: dibuktikan dengan screenshot dan/atau tautan web aplikasi/aplikasi mobile/superApps layanan inovasi pada bagian beranda/halaman depan dan bagian proses layanan atau layanan lainnya yang terintegrasi (jpg/jpeg/png). Contoh: Tergabung dalam superApps layanan publik. b. Sub indikator nondigital: dibuktikan dengan dokumen/foto kegiatan yang menggambarkan integrasi layanan. Contoh: Tergabung dalam mal pelayanan publik. Contoh: Peningkatan layanan melalui kegiatan jemput bola (sebelumnya pelayanan dilakukan secara terpusat dan belum bisa menjangkau keseluruhan wilayah/sasaran). Contoh: Inovasi dinas kesehatan menggunakan aplikasi milik kemenkes dalam salah satu tahapannya. Contoh: Lebih dari satu inovasi dari satu dinas yang sama dilaksanakan secara terintegrasi. Contoh: Inovasi penanganan stunting kerja sama antara dinas kesehatan, dinas pmd, dan dinas sosial. Ketiga perangkat daerah tersebut tergabung dalam satu koordinasi.",
    weight: 2,
    parameters: [
      "Ada dukungan melalui informasi website/sosial media/web aplikasi/aplikasi mobile (android atau ios) yang berjalan secara terpisah. Layanan inovasi berjalan secara tersendiri (independen).",
      "Ada dukungan melalui informasi website, sosial media, web aplikasi atau aplikasi mobile (android atau ios) yang telah terintegrasi dalam satu portal pada unit organisasi bersangkutan. Layanan telah terintegrasi dengan layanan lain pada program atau kegiatan lain pada satu unit organisasi atau dalam satu urusan pemerintahan.",
      "Ada dukungan melalui web aplikasi atau aplikasi mobile (android atau ios) yang layanan sudah terintegrasi dengan unit organisasi lain. Layanan telah terintegrasi dengan layanan lain pada program atau kegiatan pada unit organisasi lain atau dalam lebih dari satu urusan pemerintahan.",
    ],
    supportingData:
      "Sub indikator digital dibuktikan dengan screenshot dan/atau tautan web aplikasi/aplikasi mobile/superApps layanan inovasi pada bagian beranda/halaman depan dan bagian proses layanan atau layanan lainnya yang terintegrasi. Sub indikator nondigital dibuktikan dengan dokumen/foto kegiatan yang menggambarkan integrasi layanan.",
    fileTypes: "JPG/JPEG/PNG",
  },
  {
    id: 16,
    indicator: "Replikasi",
    description: "Inovasi Daerah telah direplikasi oleh daerah lain.",
    information:
      "Pilih frekuensi replikasi inovasi daerah oleh daerah lain. Dokumen Perjanjian kerjasama (PKS)/MoU/dokumen replikasi/surat korespondensi atau surat pernyataan telah mereplikasi (pdf).",
    weight: 3,
    parameters: [
      "Pernah 1 Kali direplikasi di daerah lain",
      "Pernah 2 Kali direplikasi di daerah lain yang berbeda",
      "Pernah 3 Kali direplikasi di daerah lain yang berbeda",
    ],
    supportingData:
      "Dokumen Perjanjian kerjasama (PKS)/MoU/dokumen replikasi/surat korespondensi atau surat pernyataan telah mereplikasi.",
    fileTypes: "PDF",
  },
  {
    id: 17,
    indicator: "Kecepatan penciptaan inovasi",
    description:
      "Satuan waktu yang digunakan untuk menciptakan inovasi daerah yang kompleks.",
    information:
      "Pilih rentang waktu yang digunakan untuk menciptakan inovasi daerah. Dibuktikan dengan dokumen/laporan/proposal inovasi daerah (Tahapan proses penciptaan inovasi daerah dan/atau tahapan pengembangan inovasi daerah) (pdf).",
    weight: 2,
    parameters: [
      "Inovasi dapat diciptakan dalam waktu 9 bulan atau lebih",
      "Inovasi dapat diciptakan dalam waktu 5-8 bulan",
      "Inovasi dapat diciptakan dalam waktu 1-4 bulan",
    ],
    supportingData:
      "Dokumen/laporan/proposal inovasi daerah yang memuat tahapan proses penciptaan inovasi daerah dan/atau tahapan pengembangan inovasi daerah.",
    fileTypes: "PDF",
  },
  {
    id: 18,
    indicator: "Kemanfaatan inovasi",
    description: "Kemanfaatan inovasi.",
    information:
      "Pilih satuan ukur dan rentang sesuai dengan satuan yang ukur yang telah dipilih manfaat inovasi daerah. Teruntuk inovasi nondigital, evidence berupa rekapitulasi harus melampirkan TTD/bukti tanda tangan dari penerima manfaat inovasi daerah (pdf). Perbandingan rekapitulasi jumlah unit sebelum dan sesudah yang menerima manfaat inovasi. Perbandingan rekapitulasi jumlah unit sebelum dan sesudah yang menerima manfaat inovasi. Teruntuk inovasi nondigital, evidence harus melampirkan TTD/Testimoni dari penerima unit atau perwakilan dari kelompok/unit terkait (pdf). Laporan belanja yang memuat perbandingan biaya pengeluaran yang dibebankan sebelum dan sesudah penerapan inovasi. Laporan Keuangan yang memuat pendapatan sebelum dan sesudah penerapan inovasi (laporan pembukuan, laporan kas, neraca, saldo, dsb). Contoh: a. Inovasi diterapkan tahun 2025 maka peningkatan diukur dari pendapatan tahun 2025 dibandingkan tahun 2024. b. Inovasi di terapkan sejak tahun 2024 sampai saat ini masih diterapkan maka peningkatan diukur dari pendapatan tahun 2025 dibanding 2024. c. Inovasi di terapkan sejak tahun 2023 dan dikembangkan di tahun 2024 serta sampai saat ini masih diterapkan maka peningkatan diukur dari pendapatan tahun 2025 dibanding tahun 2024. d. Inovasi yang diterapkan di tahun 2024 namun tidak lagi diterapkan di tahun 2025 maka peningkatan diukur dari pendapatan pada tahun 2024 dibanding tahun 2023. Perbandingan rekapitulasi jumlah produk yang dihasilkan atau diperjualbelikan. Digunakan terhadap pengukuran inovasi daerah berbasis kinerja pertumbuhan secara eksponensial dihitung berdasarkan basis waktu tertentu (bulan/triwulan/trimester/semester/tahun) sesuai dengan konteks masing-masing inovasi daerah. Contoh: 1. Nilai rata-rata siswa kelas 9 SMP N X mengalami peningkatan antar semester. 2. Perkembangan rata-rata tinggi badan anak usia 5-10 tahun di desa Y dari waktu ke waktu. Indikator ini hanya dibatasi pada konteks unit penerima manfaat dimana inovasi daerah tersebut dilaksanakan (tidak secara otomatis menggunakan data makro daerah).",
    weight: 3,
    parameters: [
      "Cakupan penerima manfaat 1-200 orang",
      "Cakupan penerima manfaat 201-500 orang",
      "Cakupan penerima manfaat 501 orang atau lebih",
      "Cakupan unit penerima manfaat 5,00% s.d 20,00% total dari unit sasaran",
      "Cakupan unit penerima manfaat 20,01% s.d 50,00% total dari unit sasaran",
      "Cakupan unit penerima manfaat diatas 50,00% total dari unit sasaran",
      "Efisiensi belanja sebesar 0,01%-10,00%",
      "Efisiensi belanja sebesar 10,01%-20,00%",
      "Efisiensi belanja sebesar 20,01%-30%",
      "Penambahan pendapatan bagi pemda atau perangkat daerah atau unit kerja yang menerapkan inovasi 0,01%-9,99%",
      "Penambahan pendapatan bagi pemda atau perangkat daerah atau unit kerja yang menerapkan inovasi 10,00%-19,99%",
      "Penambahan pendapatan bagi pemda atau perangkat daerah atau unit kerja yang menerapkan inovasi ≥20%",
      "Jumlah produk yang dihasilkan atau diperjualbelikan 1-100 barang",
      "Jumlah produk yang dihasilkan atau diperjualbelikan 101-200 barang",
      "Jumlah produk yang dihasilkan atau diperjualbelikan lebih dari 200 barang",
      "Dampak Inovasi telah menunjukkan tren kinerja positif dalam 1 (satu) periode waktu pengukuran",
      "Dampak Inovasi telah menunjukkan tren kinerja positif dalam 2 (dua) periode waktu pengukuran",
      "Dampak Inovasi telah menunjukkan tren kinerja positif dalam 3 (tiga) periode waktu pengukuran",
    ],
    supportingData:
      "a. Daftar penerima manfaat inovasi (untuk layanan luring) dalam format pdf atau screenshoot jumlah pengguna/penerima manfaat inovasi daerah (untuk layanan daring) dalam format jpg/jpeg/png. b. Perbandingan rekapitulasi jumlah unit sebelum dan sesudah yang menerima manfaat inovasi. c. Laporan belanja yang memuat perbandingan biaya pengeluaran yang dibebankan sebelum dan sesudah penerapan inovasi. d. Laporan Keuangan yang memuat pendapatan sebelum dan sesudah penerapan inovasi (laporan pembukuan, laporan kas, neraca, saldo, dsb). e. Perbandingan rekapitulasi jumlah produk yang dihasilkan atau diperjualbelikan. f. Hasil Analisis/Kajian/Riset/Laporan/Dokumen yang dikeluarkan oleh instansi pelaksana inovasi atau lembaga terkait (pdf).",
    fileTypes: "PDF/JPG/JPEG/PNG",
  },
  {
    id: 19,
    indicator: "Monitoring dan Evaluasi Inovasi Daerah",
    description:
      "Instrumen yang digunakan untuk mengukur keberhasilan penerapan inovasi daerah.",
    information: "Pilih bentuk evaluasi inovasi daerah yang telah dilakukan.",
    weight: 2,
    parameters: [
      "Hasil laporan monev internal pemerintah daerah",
      "Laporan hasil pengukuran kepuasaan pengguna dari evaluasi Survei Kepuasan Masyarakat",
      "Hasil laporan monev eksternal berdasarkan hasil penelitian/kajian/analisis",
    ],
    supportingData:
      "Laporan kegiatan monev internal pemerintah daerah atau screenshot testimoni pengguna (jpeg/jpg/png) atau laporan survei kepuasan masyarakat/laporan hasil penelitian (pdf).",
    fileTypes: "JPEG/JPG/PNG/PDF",
  },
  {
    id: 20,
    indicator: "Video inovasi daerah",
    description:
      "Video inovasi daerah dapat dibuktikan dengan video penerapan inovasi daerah.",
    information:
      "Pilih jumlah substansi yang dipenuhi dalam video. Mengunggah video penerapan inovasi dengan durasi maksimal 5 menit (mp4) atau tautan google drive/youtube, dengan ketentuan video memvisualisasikan 5 substansi: 1. Latar belakang inovasi; 2. Penjaringan ide; 3. Pemilihan ide; 4. Manfaat inovasi; dan 5. Dampak inovasi. Video inovasi dilengkapi dengan cover thumbnail dan ada logo kemendagri dengan format jpg/jpeg/png dan pemerintah daerah dapat memanfaatkan hasil video dari unggahan media sosial (tiktok, instagram, dll).",
    weight: 4,
    parameters: [
      "Memenuhi 1 atau 2 unsur substansi",
      "Memenuhi 3 atau 4 unsur substansi",
      "Memenuhi 5 unsur substansi",
    ],
    supportingData:
      "Video penerapan inovasi dengan durasi maksimal 5 menit atau tautan google drive/youtube. Video memvisualisasikan latar belakang inovasi, penjaringan ide, pemilihan ide, manfaat inovasi, dan dampak inovasi. Video dilengkapi dengan cover thumbnail dan ada logo kemendagri.",
    fileTypes: "MP4/JPG/JPEG/PNG",
  },
];

type ColumnOptions = {
  selections: Record<number, string>;
  files: Record<number, File | undefined>;
  onSelect: (id: number, value: string) => void;
  onFile: (id: number, file?: File) => void;
};

export const getIndicatorColumns = ({
  selections,
  files,
  onSelect,
  onFile,
}: ColumnOptions): DefaultColumnFormat<IndicatorDto>[] => [
  { key: "id", title: "No.", textClassName: "w-16" },
  {
    key: "indicator",
    title: "Indikator",
    textClassName: "w-52 whitespace-normal! font-semibold",
  },
  {
    key: "description",
    title: "Keterangan",
    textClassName: "w-72 whitespace-normal! align-top",
  },
  {
    key: "information",
    title: "Informasi",
    textClassName: "w-64 whitespace-normal! align-top",
  },
  {
    key: "weight",
    title: "Bobot",
    textClassName: "w-20",
    formatter: (value) => Number(value).toFixed(2),
  },
  {
    key: "parameters",
    title: "Parameter",
    textClassName: "w-60",
    formatter: (_value, row) => (
      <Select
        value={selections[row.id] || ""}
        onValueChange={(value) => value && onSelect(row.id, value)}
      >
        <SelectTrigger className="h-10! w-full bg-white text-xs">
          <SelectValue placeholder="Pilih parameter" />
        </SelectTrigger>
        <SelectContent className="max-w-80 bg-white text-slate-900">
          {row.parameters.map((parameter) => (
            <SelectItem key={parameter} value={parameter}>
              {parameter}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  },
  {
    key: "supportingData",
    title: "Data Pendukung",
    textClassName: "w-80 whitespace-normal! align-top",
    formatter: (value, row) => (
      <div className="space-y-3">
        <p className="text-xs leading-5 text-slate-600">{String(value)}</p>
        <Label
          htmlFor={`indicator-file-${row.id}`}
          className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-600 hover:bg-blue-100"
        >
          <FileUp className="size-3.5" />
          {files[row.id]?.name || "Upload"}
        </Label>
        <Input
          id={`indicator-file-${row.id}`}
          type="file"
          className="sr-only"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) => onFile(row.id, event.currentTarget.files?.[0])}
        />
      </div>
    ),
  },
  {
    key: "fileTypes",
    title: "Jenis",
    textClassName: "w-32",
    formatter: (value) => (
      <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600">
        {String(value)}
      </span>
    ),
  },
];
