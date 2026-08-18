"use client";

import { useCallback, useEffect, useState } from "react";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import { toast } from "@/components/ui/toast";
import { parseApiResponse } from "@/lib/helper/response-api";

import FormData from "./components/form-data";
import { initialConfiguration, type DashboardConfigurationResponse } from "./page.config";

const toLocalInput = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export default function DashboardConfigurationPage() {
  const [configuration, setConfiguration] = useState(initialConfiguration);
  const [saving, setSaving] = useState(false);
  const fetchConfiguration = useCallback(async () => { try { const payload = await parseApiResponse<DashboardConfigurationResponse>(await fetch("/api/dashboard-configuration", { cache: "no-store" }), "Gagal mengambil konfigurasi"); if (payload.data) setConfiguration({ ...payload.data, countdownTarget: toLocalInput(payload.data.countdownTarget) }); } catch (error) { toast.add({ type: "error", title: error instanceof Error ? error.message : "Gagal mengambil konfigurasi" }); } }, []);
  useEffect(() => { const timeout = window.setTimeout(() => { void fetchConfiguration(); }, 0); return () => window.clearTimeout(timeout); }, [fetchConfiguration]);
  const save = useCallback(async () => { try { setSaving(true); await parseApiResponse(await fetch("/api/dashboard-configuration", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...configuration, countdownTarget: new Date(configuration.countdownTarget).toISOString() }) }), "Gagal menyimpan konfigurasi"); toast.add({ type: "success", title: "Konfigurasi berhasil disimpan" }); await fetchConfiguration(); } catch (error) { toast.add({ type: "error", title: error instanceof Error ? error.message : "Gagal menyimpan konfigurasi" }); } finally { setSaving(false); } }, [configuration, fetchConfiguration]);
  return <AppSidebarLayout><main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-slate-900 lg:px-8 lg:py-7"><div className="mx-auto max-w-[1600px]"><AppPageHeader title="Konfigurasi Dashboard" description="Atur hitungan mundur pengisian indeks inovasi daerah."/><div className="mt-5 text-slate-900 [&_button]:text-slate-900 [&_input]:border-neutral-200 [&_input]:bg-white [&_input]:text-slate-900 [&_label]:text-slate-700"><FormData value={configuration} saving={saving} onChange={setConfiguration} onSubmit={save}/></div></div></main></AppSidebarLayout>;
}
