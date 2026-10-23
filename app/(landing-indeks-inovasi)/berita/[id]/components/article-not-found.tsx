import Link from "next/link";

export default function ArticleNotFound() {
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-4"><div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="text-sm font-semibold text-emerald-700">Berita tidak ditemukan</p><Link href="/" className="mt-5 inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Kembali ke Beranda</Link></div></main>;
}
