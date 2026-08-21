"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import DynamicPage from "@/components/dynamic-page";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import InformationPanel from "./components/information-panel";
import AddParticipantModal from "./components/add-participant-modal";
import { columnFormats, headerToolbar, ITEMS_PER_PAGE, renderActions, type OpdInnovationDto } from "./page.config";

export default function OpdInnovationPage() {
  const router = useRouter();
  const [data, setData] = useState<OpdInnovationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stage, setStage] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [period, setPeriod] = useState<{ name: string; status: string; registrationStart: string; registrationEnd: string; assessmentStart: string; assessmentEnd: string; announcementDate: string } | null>(null);
  const [summary, setSummary] = useState({ total: 0, waiting: 0, revision: 0, verified: 0, assessing: 0, assessed: 0 });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/competitions?page=1&limit=100");
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Gagal mengambil data inovasi.");
      setData(result.data || []);
      setPeriod(result.period || null);
      setSummary(result.summary || { total: 0, waiting: 0, revision: 0, verified: 0, assessing: 0, assessed: 0 });
    } catch (error) {
      toast.add({ title: "Gagal memuat inovasi", description: error instanceof Error ? error.message : "Silakan coba kembali.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Pengambilan data awal dilakukan saat halaman tersedia di browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase("id-ID");
    return data.filter((item) => (stage === "all" || item.stage === stage) && (status === "all" || item.status === status) && [item.innovationName, item.organization, item.governmentAffair].some((value) => value.toLocaleLowerCase("id-ID").includes(search)));
  }, [data, searchTerm, stage, status]);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const visibleData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const deleteInnovation = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus data inovasi ini?")) return;
    const response = await fetch(`/api/competitions/participants/${id}`, { method: "DELETE" });
    if (response.ok) void fetchData();
  };

  const exportData = () => {
    const rows = filteredData.map((item) => [item.number, "Kabupaten Karimun", item.innovationName, item.organization, item.stage, item.governmentAffair]);
    const table = `<table>${[["No", "Nama Pemda", "Nama Inovasi", "Nama Akun", "Tahapan", "Urusan"], ...rows].map((row) => `<tr>${row.map((value) => `<td>${String(value).replaceAll("<", "&lt;")}</td>`).join("")}</tr>`).join("")}</table>`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([table], { type: "application/vnd.ms-excel" }));
    link.download = "inovasi-opd.xls";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const toolbar = headerToolbar({ searchTerm, setSearchTerm: (value) => { setSearchTerm(value); setCurrentPage(1); }, onAdd: () => setShowAdd(true) });
  const stages = [["all", "Semua"], ["DRAFT", "Draft"], ["WAITING_VERIFICATION", "Menunggu Verifikasi"], ["NEEDS_REVISION", "Perlu Perbaikan"], ["VERIFIED", "Lolos Verifikasi"], ["UNDER_ASSESSMENT", "Sedang Dinilai"], ["ASSESSED", "Selesai Dinilai"]];
  const statCards = [["Total Inovasi Terdaftar", summary.total], ["Menunggu Verifikasi", summary.waiting], ["Perlu Perbaikan", summary.revision], ["Lolos Verifikasi", summary.verified], ["Sedang Dinilai", summary.assessing], ["Selesai Dinilai", summary.assessed]];

  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f4f6f9] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader title="Lomba Inovasi Pemerintah Daerah" description="Dashboard / Lomba Inovasi Perangkat Daerah / Inovasi OPD" />
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-extrabold text-[#124579]">{period?.name || "Lomba Inovasi OPD Kabupaten Karimun"}</h2><span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">{period?.status === "REGISTRATION" ? "Sedang Berlangsung" : period?.status || "Belum Ada Periode Aktif"}</span></div><Button onClick={() => setShowAdd(true)} className="bg-[#124579] text-white">+ Tambah Inovasi Lomba</Button></div>
            {period ? <div className="mt-5 grid gap-3 text-xs text-slate-600 sm:grid-cols-3"><p><b>Periode Pendaftaran</b><br />{new Date(period.registrationStart).toLocaleDateString("id-ID")} – {new Date(period.registrationEnd).toLocaleDateString("id-ID")}</p><p><b>Periode Penilaian</b><br />{new Date(period.assessmentStart).toLocaleDateString("id-ID")} – {new Date(period.assessmentEnd).toLocaleDateString("id-ID")}</p><p><b>Pengumuman</b><br />{new Date(period.announcementDate).toLocaleDateString("id-ID")}</p></div> : null}
          </section>
          <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{statCards.map(([label, value]) => <article key={String(label)} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-[11px] font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-extrabold text-[#124579]">{value}</p></article>)}</section>
          <div className="mt-5 flex justify-end"><Button onClick={exportData} className="h-9 gap-2 bg-[#4357e8] px-5 text-[11px] font-bold uppercase text-white"><Download className="size-3.5" /> Unduh Data (XLS)</Button></div>
          <nav className="mt-4 flex flex-wrap gap-1">{stages.map(([value, label]) => <button key={value} onClick={() => { setStatus(value); setCurrentPage(1); }} className={`rounded-lg px-4 py-2 text-[10px] font-bold uppercase ${status === value ? "bg-white text-[#315bea] shadow-sm" : "text-slate-400"}`}>{label}</button>)}</nav>
          <div className="mt-3 flex flex-wrap gap-3 rounded-xl bg-white p-3"><select value={stage} onChange={(event) => setStage(event.target.value)} className="h-9 rounded-md border border-slate-200 px-3 text-xs"><option value="all">Semua Tahapan</option><option>Inisiatif</option><option>Uji Coba</option><option>Penerapan</option></select><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded-md border border-slate-200 px-3 text-xs"><option value="all">Semua Status</option><option value="DRAFT">Draft</option><option value="WAITING_VERIFICATION">Menunggu Verifikasi</option><option value="NEEDS_REVISION">Perlu Perbaikan</option><option value="VERIFIED">Lolos Verifikasi</option><option value="UNDER_ASSESSMENT">Sedang Dinilai</option><option value="ASSESSED">Selesai Dinilai</option></select><button onClick={() => { setStage("all"); setStatus("all"); setSearchTerm(""); }} className="text-xs font-bold text-blue-600">Reset Filter</button></div>
          <div className="mt-4 [&>div]:!bg-white [&>div]:!p-4 [&_th]:!text-[11px] [&_th]:!font-bold [&_th]:!text-[#124579] [&_td]:!text-[11px] [&_td]:!text-slate-600">
            <DynamicPage className="border! border-slate-100! shadow-md!" toolbar={toolbar} columns={columnFormats} items={visibleData} total={filteredData.length} currentPage={currentPage} totalPages={totalPages} loading={loading} onPageChange={setCurrentPage} getRowId={(row) => row.id} renderActions={(row) => renderActions({ row, onView: (id) => router.push(`/lomba-inovasi/inovasi-opd/${id}`), onEdit: (id) => router.push(`/lomba-inovasi/inovasi-opd/${id}?mode=edit`), onIndicators: (id) => router.push(`/lomba-inovasi/inovasi-opd/${id}/penilaian`), onDelete: deleteInnovation })} />
          </div>
          <InformationPanel />
          <AddParticipantModal open={showAdd} onOpenChange={setShowAdd} onSuccess={fetchData} />
        </div>
      </main>
    </AppSidebarLayout>
  );
}
