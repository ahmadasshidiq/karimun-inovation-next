import type { ReactNode } from "react";

export default function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-800"><h2 className="mb-4 text-sm font-bold text-[#124579]">{title}</h2>{children}</section>;
}
