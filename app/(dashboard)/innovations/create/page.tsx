"use client";

import { useCallback, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AppPageHeader, AppSidebarLayout } from "@/components/app-sidebar";
import { toast } from "@/components/ui/toast";

import InnovationForm from "../components/innovation-form";
import { initialFormValues, type InnovationFormValues } from "./page.config";

export default function CreateInnovationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState(() => ({
    ...initialFormValues,
    category: searchParams.get("category") || initialFormValues.category,
  }));
  const [submitting, setSubmitting] = useState(false);

  const onChange = useCallback(
    <K extends keyof InnovationFormValues>(
      field: K,
      value: InnovationFormValues[K],
    ) => setValues((current) => ({ ...current, [field]: value })),
    [],
  );
  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        setSubmitting(true);
        const body = new FormData();
        const { files, ...payload } = values;
        const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        payload.submissionStatus = (submitter?.value === "SUBMITTED" ? "SUBMITTED" : "DRAFT");
        body.set("payload", JSON.stringify(payload));
        files.forEach((file, index) => {
          if (file instanceof File) body.set(`file_${index}`, file);
        });

        const response = await fetch("/api/innovations", {
          method: "POST",
          body,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(result.message || "Gagal menyimpan inovasi.");

        toast.add({
          title: "Inovasi berhasil disimpan",
          description: "Data inovasi telah ditambahkan ke dalam daftar.",
          type: "success",
        });
        router.push(`/innovations?category=${encodeURIComponent(values.category)}`);
        router.refresh();
      } catch (error) {
        toast.add({
          title: "Gagal menyimpan inovasi",
          description:
            error instanceof Error ? error.message : "Silakan coba kembali.",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [router, values],
  );

  return (
    <AppSidebarLayout>
      <main className="min-h-screen min-w-0 w-full overflow-x-clip bg-[#f7f8fc] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto min-w-0 w-full max-w-[1600px]">
          <AppPageHeader
            title="Tambah Inovasi"
            description="Lengkapi data inovasi yang akan ditambahkan pada form di bawah ini."
          />
          <InnovationForm
            values={values}
            submitting={submitting}
            // Indikator wajib baru bisa diisi setelah inovasi tersimpan.
            canSend={false}
            onChange={onChange}
            onCancel={() => router.push(`/innovations?category=${encodeURIComponent(values.category)}`)}
            onSubmit={onSubmit}
          />
        </div>
      </main>
    </AppSidebarLayout>
  );
}
