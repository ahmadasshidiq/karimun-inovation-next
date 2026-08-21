"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AppPageHeader, AppSidebarLayout, useSessionUser } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import DetailSection from "./components/detail-section";
import { detailTabs, verificationItems, type CompetitionDetail } from "./page.config";

const tabMap: Record<string, (typeof detailTabs)[number]> = {
  dokumen: "Dokumen Pendukung",
  verifikasi: "Verifikasi",
  penilaian: "Penilaian",
  riwayat: "Riwayat",
};

export default function CompetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSessionUser();
  const [data, setData] = useState<CompetitionDetail | null>(null);
  const [tab, setTab] = useState<(typeof detailTabs)[number]>(
    tabMap[searchParams.get("tab") || ""] || "Informasi Inovasi",
  );
  const [notes, setNotes] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    const response = await fetch(`/api/competitions/participants/${id}`);
    const result = await response.json();
    if (response.ok) setData(result.data);
  }, [id]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  const updateStatus = async (payload: object) => {
    const response = await fetch(`/api/competitions/participants/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({}));
    toast.add({ title: response.ok ? "Berhasil" : "Gagal", description: result.message, type: response.ok ? "success" : "error" });
    if (response.ok) void load();
  };
  if (!data) return <AppSidebarLayout><main className="p-8">Memuat data lomba...</main></AppSidebarLayout>;
  const isAdmin = user?.role === "Super Admin";

  return (
    <AppSidebarLayout><main className="min-h-screen bg-[#f4f6f9] p-5 text-slate-900 lg:p-8"><AppPageHeader title="Detail Inovasi Lomba" description="Lomba Inovasi Perangkat Daerah / Inovasi OPD / Detail" />
      <section className="rounded-xl bg-[#124579] p-6 text-white"><h1 className="text-xl font-extrabold">{data.innovation.name}</h1><p className="mt-1 text-sm text-white/80">{data.institution.name}</p><div className="mt-4 flex flex-wrap gap-3 text-xs"><span className="rounded-full bg-white/15 px-3 py-1.5">{data.status}</span><span className="rounded-full bg-white/15 px-3 py-1.5">Nilai Akhir: {Number(data.finalScore || 0).toFixed(2)}</span></div></section>
      <nav className="my-5 flex gap-1 overflow-x-auto">{detailTabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold ${tab === item ? "bg-[#124579] text-white" : "bg-white text-slate-500"}`}>{item}</button>)}</nav>
      {tab === "Informasi Inovasi" ? <DetailSection title="Informasi Inovasi"><dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-slate-400">Jenis Inovasi</dt><dd>{data.innovation.innovationForm || "-"}</dd></div><div><dt className="text-slate-400">Urusan Pemerintahan</dt><dd>{data.innovation.governmentAffairs || "-"}</dd></div><div><dt className="text-slate-400">Waktu Uji Coba</dt><dd>{data.innovation.trialPeriod ? new Date(data.innovation.trialPeriod).toLocaleDateString("id-ID") : "-"}</dd></div><div><dt className="text-slate-400">Waktu Penerapan</dt><dd>{data.innovation.implementationPeriod ? new Date(data.innovation.implementationPeriod).toLocaleDateString("id-ID") : "-"}</dd></div></dl></DetailSection> : null}
      {tab === "Substansi Inovasi" ? <DetailSection title="Substansi Inovasi"><div className="space-y-4 text-sm"><div><b>Tujuan</b><p className="mt-1 text-slate-600">{data.innovation.purpose || "-"}</p></div><div><b>Deskripsi</b><p className="mt-1 text-slate-600">{data.innovation.description || "-"}</p></div></div></DetailSection> : null}
      {tab === "Dokumen Pendukung" ? <DetailSection title="Dokumen Khusus Lomba"><div className="space-y-2">{data.documents.map((document) => <a key={document.id} href={document.fileUrl} target="_blank" className="flex justify-between rounded-lg border p-3 text-sm"><span>{document.name}</span><span>{document.status}</span></a>)}{!data.documents.length ? <p className="text-sm text-slate-500">Belum ada dokumen khusus lomba.</p> : null}</div></DetailSection> : null}
      {tab === "Verifikasi" ? <DetailSection title="Verifikasi Peserta"><div className="grid gap-6 lg:grid-cols-2"><div className="space-y-2">{verificationItems.map((item) => <label key={item} className="flex gap-2 text-sm text-slate-700"><input type="checkbox" checked={Boolean(checks[item])} onChange={(event) => setChecks((current) => ({ ...current, [item]: event.target.checked }))} />{item}</label>)}</div><div><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Catatan Verifikasi" className="min-h-28 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400" />{isAdmin ? <div className="mt-3 flex flex-wrap gap-2"><Button onClick={() => updateStatus({ action: "verify", decision: "VERIFIED", checklist: checks, notes })}>Lolos Verifikasi</Button><Button variant="outline" onClick={() => updateStatus({ action: "verify", decision: "NEEDS_REVISION", checklist: checks, notes })}>Perlu Perbaikan</Button><Button variant="destructive" onClick={() => updateStatus({ action: "verify", decision: "REJECTED", checklist: checks, notes })}>Tidak Lolos</Button></div> : null}</div></div></DetailSection> : null}
      {tab === "Penilaian" ? <DetailSection title="Penilaian Juri"><p className="text-sm text-slate-600">{data.assessments.length} penilaian tersimpan dari {data.judgeAssignments.length} juri.</p><Button className="mt-4" onClick={() => router.push(`/lomba-inovasi/inovasi-opd/${id}/penilaian`)}>Buka Penilaian</Button></DetailSection> : null}
      {tab === "Riwayat" ? <DetailSection title="Riwayat Lomba"><div className="space-y-4">{data.activityLogs.map((log) => <div key={log.id} className="border-l-2 border-blue-500 pl-4 text-sm"><b>{log.activity}</b><p className="text-slate-500">{new Date(log.createdAt).toLocaleString("id-ID")} · {log.user.fullname}</p><p>{log.description}</p></div>)}</div></DetailSection> : null}
      {["DRAFT", "NEEDS_REVISION"].includes(data.status) ? <div className="mt-5 flex justify-end"><Button onClick={() => updateStatus({ action: "submit" })} className="bg-[#124579] text-white">Ajukan Inovasi ke Lomba</Button></div> : null}
    </main></AppSidebarLayout>
  );
}
