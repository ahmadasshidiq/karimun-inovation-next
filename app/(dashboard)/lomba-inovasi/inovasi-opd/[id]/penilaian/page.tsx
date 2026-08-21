"use client";

import { use, useEffect, useMemo, useState } from "react";
import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import ScoreCard from "./components/score-card";
import type { AssessmentIndicator, ScoreInput } from "./page.config";

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [participant, setParticipant] = useState<{ innovation: { name: string }; institution: { name: string } } | null>(null);
  const [indicators, setIndicators] = useState<AssessmentIndicator[]>([]);
  const [scores, setScores] = useState<ScoreInput[]>([]);
  useEffect(() => { fetch(`/api/competitions/participants/${id}/assessment`).then(async (response) => ({ response, result: await response.json() })).then(({ response, result }) => { if (!response.ok) return toast.add({ title: "Penilaian tidak tersedia", description: result.message, type: "error" }); setParticipant(result.data.participant); setIndicators(result.data.indicators); setScores(result.data.indicators.map((indicator: AssessmentIndicator) => { const existing = result.data.assessment?.scores.find((score: { indicatorId: string }) => score.indicatorId === indicator.id); return { indicatorId: indicator.id, score: Number(existing?.score || 0), notes: existing?.notes || "" }; })); }); }, [id]);
  const total = useMemo(() => indicators.reduce((sum, indicator) => sum + (scores.find((score) => score.indicatorId === indicator.id)?.score || 0) * Number(indicator.weight) / 100, 0), [indicators, scores]);
  const save = async (submit: boolean) => { const response = await fetch(`/api/competitions/participants/${id}/assessment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scores, submit }) }); const result = await response.json(); toast.add({ title: response.ok ? "Berhasil" : "Gagal", description: result.message, type: response.ok ? "success" : "error" }); };
  return <AppSidebarLayout><main className="min-h-screen bg-[#f4f6f9] p-5 lg:p-8"><AppPageHeader title="Penilaian Inovasi" description="Lomba Inovasi OPD / Penilaian" /><section className="mb-5 rounded-xl bg-[#124579] p-5 text-white"><h1 className="text-lg font-bold">{participant?.innovation.name || "Memuat..."}</h1><p className="text-white/70">{participant?.institution.name}</p></section><div className="space-y-4">{indicators.map((indicator) => { const value = scores.find((score) => score.indicatorId === indicator.id) || { indicatorId: indicator.id, score: 0, notes: "" }; return <ScoreCard key={indicator.id} indicator={indicator} value={value} onChange={(next) => setScores((current) => current.map((item) => item.indicatorId === next.indicatorId ? next : item))} />; })}</div><section className="mt-5 flex flex-wrap items-center justify-between rounded-xl bg-white p-5 shadow-sm"><p className="text-lg font-bold">Total Nilai: <span className="text-blue-700">{total.toFixed(2)}</span></p><div className="flex gap-2"><Button variant="outline" onClick={() => save(false)}>Simpan Draft</Button><Button onClick={() => save(true)} className="bg-[#124579] text-white">Submit Penilaian</Button></div></section></main></AppSidebarLayout>;
}

