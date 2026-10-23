"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Pencil } from "lucide-react";
import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import type { InstitutionDetail } from "./page.config";

export default function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<InstitutionDetail>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/institutions/${id}`);
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Gagal mengambil detail instansi.");
        setData(result.data);
      } catch (error) {
        toast.add({
          type: "error",
          title:
            error instanceof Error
              ? error.message
              : "Gagal mengambil detail instansi",
        });
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);
  return (
    <AppSidebarLayout>
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title="Detail Instansi"
            description="Kelola dan lihat informasi instansi yang tersedia."
          />
          {loading ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Memuat data instansi...
            </div>
          ) : data ? (
            <div className="mt-5 space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm [&_button]:hidden">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Building2 className="size-7" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Instansi
                      </p>
                      <h1 className="mt-1 text-2xl font-bold text-slate-900">
                        {data.name}
                      </h1>
                      <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Aktif
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      router.push(`/settings/institutions?mode=edit&id=${id}`)
                    }
                    className="gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil className="size-4" /> Edit
                  </Button>
                </div>
              </section>
              <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-base font-bold text-slate-900">
                    Informasi Instansi
                  </h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Tipe Instansi
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {data.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Nomenklatur
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {data.nomenclature?.name || "-"}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-slate-500">
                        Alamat
                      </p>
                      <p className="mt-1 flex gap-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        <MapPin className="mt-1 size-4 shrink-0 text-slate-400" />
                        {data.address || "Belum ada alamat instansi."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Relasi Data
                  </p>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-slate-900">
                      {data._count?.users || 0}
                    </p>
                    <p className="text-sm text-slate-500">Akun pengguna</p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="text-2xl font-bold text-slate-900">
                      {data._count?.childInstitutions || 0}
                    </p>
                    <p className="text-sm text-slate-500">Instansi turunan</p>
                  </div>
                </div>
              </section>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2 text-slate-600"
              >
                <ArrowLeft className="size-4" /> Kembali
              </Button>
            </div>
          ) : null}
        </div>
      </main>
    </AppSidebarLayout>
  );
}
