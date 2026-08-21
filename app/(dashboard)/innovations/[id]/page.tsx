"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import { toast } from "@/components/ui/toast";

import InnovationForm from "../components/innovation-form";
import { getInitialDetail, type InnovationDetailValues } from "./page.config";

export default function InnovationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = use(params);
  const { mode } = use(searchParams);
  const router = useRouter();
  const editable = mode === "edit";
  const [values, setValues] = useState(() => getInitialDetail(id));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/innovations/${id}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(result.message || "Gagal mengambil detail inovasi.");
        setValues({
          ...getInitialDetail(id),
          ...result.data,
          latitude: result.data.latitude ?? "",
          longitude: result.data.longitude ?? "",
          initiatorType: result.data.initiatorType ?? "",
          initiatorName: result.data.initiatorName ?? "",
          type: result.data.type ?? "",
          stage: result.data.stage ?? "",
          classification: result.data.classification ?? "",
          innovationForm: result.data.innovationForm ?? "",
          thematic: result.data.thematic ?? "",
          pkpnCluster: result.data.pkpnCluster ?? "",
          pkpnSubCluster: result.data.pkpnSubCluster ?? "",
          governmentAffairs: result.data.governmentAffairs ?? "",
          trialPeriod: result.data.trialPeriod ?? "",
          implementationPeriod: result.data.implementationPeriod ?? "",
          description: result.data.description ?? "",
          purpose: result.data.purpose ?? "",
        });
      } catch (error) {
        toast.add({
          title: "Gagal memuat inovasi",
          description:
            error instanceof Error ? error.message : "Silakan coba kembali.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onChange = useCallback(
    <K extends keyof InnovationDetailValues>(
      field: K,
      value: InnovationDetailValues[K],
    ) => setValues((current) => ({ ...current, [field]: value })),
    [],
  );
  const save = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/innovations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.message || "Gagal memperbarui inovasi.");
      toast.add({
        title: "Berhasil",
        description: "Perubahan inovasi berhasil disimpan.",
        type: "success",
      });
      router.push("/innovations");
      router.refresh();
    } catch (error) {
      toast.add({
        title: "Gagal menyimpan perubahan",
        description:
          error instanceof Error ? error.message : "Silakan coba kembali.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppSidebarLayout>
      <main className="min-h-screen min-w-0 w-full overflow-x-clip bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <AppPageHeader
            title={editable ? "Edit Inovasi" : "Detail Inovasi"}
            description={
              editable
                ? "Ubah data inovasi pada form di bawah ini."
                : "Lihat detail data inovasi pada halaman ini."
            }
          />
          {loading ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
              Memuat data inovasi...
            </div>
          ) : (
            <InnovationForm
              values={values}
              submitting={saving}
              readOnly={!editable}
              submitLabel="Simpan Perubahan"
              onChange={onChange}
              onCancel={() => router.push("/innovations")}
              onSubmit={(event) => {
                event.preventDefault();
                void save();
              }}
            />
          )}
        </div>
      </main>
    </AppSidebarLayout>
  );
}
