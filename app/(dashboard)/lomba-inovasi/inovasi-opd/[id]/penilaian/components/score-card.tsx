import type { AssessmentIndicator, ScoreInput } from "../page.config";

export default function ScoreCard({ indicator, value, onChange }: { indicator: AssessmentIndicator; value: ScoreInput; onChange: (value: ScoreInput) => void }) {
  const weighted = value.score * Number(indicator.weight) / 100;
  return <article className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex justify-between gap-3"><div><h2 className="font-bold text-[#124579]">{indicator.name}</h2><p className="mt-1 text-xs text-slate-500">{indicator.description}</p></div><span className="text-xs font-bold">Bobot {indicator.weight}%</span></div><div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr_100px]"><input type="number" min={indicator.minScore} max={indicator.maxScore} value={value.score} onChange={(event) => onChange({ ...value, score: Number(event.target.value) })} className="h-10 rounded-lg border px-3" /><input value={value.notes} onChange={(event) => onChange({ ...value, notes: event.target.value })} placeholder="Catatan juri" className="h-10 rounded-lg border px-3" /><div className="rounded-lg bg-blue-50 p-3 text-center font-bold text-blue-700">{weighted.toFixed(2)}</div></div></article>;
}

