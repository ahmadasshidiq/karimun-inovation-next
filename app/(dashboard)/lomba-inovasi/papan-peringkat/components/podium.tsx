import { Medal } from "lucide-react";
import type { RankingRow } from "../page.config";

export default function Podium({ items }: { items: RankingRow[] }) {
  return <section className="grid gap-4 md:grid-cols-3">{items.slice(0, 3).map((item) => <article key={item.id} className="rounded-xl bg-white p-6 text-center shadow-sm"><Medal className={`mx-auto size-9 ${item.rank === 1 ? "text-yellow-500" : item.rank === 2 ? "text-slate-400" : "text-amber-700"}`} /><p className="mt-3 text-xs font-bold uppercase text-slate-400">Juara {item.rank}</p><h2 className="mt-1 font-extrabold text-[#124579]">{item.innovationName}</h2><p className="text-xs text-slate-500">{item.organization}</p><p className="mt-3 text-2xl font-black">{item.score.toFixed(2)}</p></article>)}</section>;
}

