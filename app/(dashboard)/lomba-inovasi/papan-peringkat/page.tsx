"use client";
import { useEffect, useState } from "react";
import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import Podium from "./components/podium";
import type { RankingRow } from "./page.config";

export default function RankingPage() {
  const [data, setData] = useState<RankingRow[]>([]);
  useEffect(() => { fetch("/api/competitions/ranking").then((response) => response.json()).then((result) => setData(result.data || [])); }, []);
  return <AppSidebarLayout><main className="min-h-screen bg-[#f4f6f9] p-5 lg:p-8"><AppPageHeader title="Papan Peringkat" description="Lomba Inovasi Perangkat Daerah / Papan Peringkat" /><Podium items={data} /><section className="mt-5 overflow-x-auto rounded-xl bg-white p-5 shadow-sm"><table className="w-full text-left text-sm"><thead className="text-[#124579]"><tr><th className="p-3">Peringkat</th><th className="p-3">OPD</th><th className="p-3">Nama Inovasi</th><th className="p-3">Nilai Akhir</th><th className="p-3">Status</th></tr></thead><tbody>{data.map((item) => <tr key={item.id} className="border-t"><td className="p-3 font-bold">{item.rank}</td><td className="p-3">{item.organization}</td><td className="p-3">{item.innovationName}</td><td className="p-3 font-bold">{item.score.toFixed(2)}</td><td className="p-3">{item.status}</td></tr>)}</tbody></table>{!data.length ? <p className="p-8 text-center text-slate-500">Belum ada hasil penilaian.</p> : null}</section></main></AppSidebarLayout>;
}
