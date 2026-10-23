import Image from "next/image";
import Link from "next/link";

import ArticleNotFound from "./components/article-not-found";
import { getBeritaArticle } from "./page.config";

export default async function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = getBeritaArticle(id);

  if (!article) return <ArticleNotFound />;

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-800">
      <header className="border-b border-white/10 bg-slate-950 text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-green-400 group-hover:bg-green-500 group-hover:text-slate-950">
              <svg aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>

          <Link href="/" className="group flex items-center gap-3" aria-label="Beranda Karimun">
            <div className="relative h-11 w-11">
              <Image src="/images/logo-karimun.webp" alt="Kabupaten Karimun" width={44} height={44} className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(250,204,21,0.35)] transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-[8px] font-semibold uppercase tracking-[0.35em] text-[#FACC15]">Pemkab</span>
              <span className="text-sm font-bold uppercase tracking-tight text-white">Karimun</span>
            </div>
          </Link>
        </div>
      </header>

      <section className="relative border-b border-slate-200 bg-white">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-green-500" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#FACC15]">Informasi Terkini</span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Berita &amp; Agenda</p>
        </div>
      </section>

      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.2)] sm:rounded-[2.5rem]">
          <div className="p-6 sm:p-10 lg:p-14">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.18em]">
              <span className="rounded-full bg-slate-950 px-4 py-2 text-white">{article.category}</span>
              <span className="text-slate-400">{article.date}</span>
              <span className="hidden h-3 w-px bg-slate-200 sm:block" />
              <span className="text-slate-400">{article.readTime}</span>
            </div>

            <h1 className="mt-7 max-w-4xl text-3xl font-bold uppercase leading-[1.04] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">{article.title}</h1>

            <div className="relative mt-9 aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-slate-100 sm:rounded-[2rem]">
              <Image src={article.image} alt={article.title} fill priority className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
            </div>

            <div className="mt-9 max-w-3xl space-y-5 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              <p>{article.content}</p>
              <p>Informasi ini merupakan bagian dari komitmen Pemerintah Kabupaten Karimun untuk memperkuat budaya inovasi dan meningkatkan kualitas pelayanan publik bagi masyarakat.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-t border-slate-200 bg-slate-50 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Baperlitbang Karimun</p>
            <Link href="/berita" className="group inline-flex items-center gap-4 self-start text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-950 transition-colors hover:text-green-700 sm:self-auto">
              Semua Berita
              <span className="h-px w-10 bg-[#FACC15] transition-all duration-300 group-hover:w-16 group-hover:bg-green-500" />
            </Link>
          </div>
        </div>
      </article>

      <footer className="border-t border-white/10 bg-slate-950 px-4 py-8 text-center sm:px-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-500">Baperlitbang Karimun · Bumi Berazam — Negeri Berinovasi</p>
        <div className="mx-auto mt-8 h-1 w-24 bg-green-600" />
      </footer>
    </main>
  );
}
