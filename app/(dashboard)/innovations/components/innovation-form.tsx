"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  ExternalLink,
  FileUp,
  Loader2,
  LocateFixed,
  MapPin,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ChoiceCards,
  Field,
  FormSection,
  LongText,
} from "@/components/form-elements";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

import {
  innovationClassificationOptions,
  innovationInputClass,
  innovationThematicOptions,
  innovationTypeOptions,
  initiatorOptions,
  MAX_SUPPORTING_FILE_SIZE,
  pkpnClusterOptions,
  type InnovationEditorValues,
  innovationStageOptions,
} from "../page.config";

type Props = {
  values: InnovationEditorValues;
  submitting: boolean;
  readOnly?: boolean;
  canSend?: boolean;
  submitLabel?: string;
  indicatorHref?: string;
  onChange: <K extends keyof InnovationEditorValues>(
    field: K,
    value: InnovationEditorValues[K],
  ) => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function InnovationForm({
  values,
  submitting,
  readOnly = false,
  canSend = true,
  indicatorHref,
  onChange,
  onCancel,
  onSubmit,
}: Props) {
  const [locating, setLocating] = useState(false);
  const submitted = values.submissionStatus === "SUBMITTED";
  const selectedPkpnCluster = pkpnClusterOptions.find(
    (option) => option.name === values.pkpnCluster,
  );

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.add({
        title: "Lokasi tidak tersedia",
        description: "Browser Anda tidak mendukung fitur lokasi.",
        type: "error",
      });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onChange("latitude", coords.latitude.toFixed(8));
        onChange("longitude", coords.longitude.toFixed(8));
        setLocating(false);
        toast.add({
          title: "Koordinat ditemukan",
          description: "Latitude dan longitude berhasil diisi.",
          type: "success",
        });
      },
      (error) => {
        setLocating(false);
        const description =
          error.code === error.PERMISSION_DENIED
            ? "Izinkan akses lokasi pada browser, lalu coba kembali."
            : "Lokasi tidak dapat ditemukan. Silakan coba kembali.";

        toast.add({
          title: "Gagal mendapatkan lokasi",
          description,
          type: "error",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 0,
      },
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 pb-2">
      <fieldset
        disabled={readOnly}
        className="min-w-0 space-y-5 border-0 p-0 [&_button:disabled]:opacity-100 [&_input:disabled]:opacity-100 [&_textarea:disabled]:opacity-100"
      >
        <FormSection number="I" title="Identitas Inovasi">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nama Inovasi" required wide>
              <Input
                required
                placeholder="Ketik nama inovasi di sini..."
                value={values.name}
                onChange={(e) => onChange("name", e.target.value)}
                className={innovationInputClass}
              />
            </Field>
            <Field label="Tahapan Inovasi" required wide>
              <ChoiceCards
                value={values.stage}
                options={innovationStageOptions}
                onChange={(value) => onChange("stage", value)}
                columns="grid-cols-3"
              />
            </Field>
            <Field label="Jenis Inovasi" required>
              <ChoiceCards
                value={values.type}
                options={innovationTypeOptions}
                onChange={(value) => onChange("type", value)}
                columns="grid-cols-2"
              />
            </Field>
            <Field label="Koordinat">
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 size-4 text-neutral-400" />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={values.latitude}
                    onChange={(e) => onChange("latitude", e.target.value)}
                    className={`${innovationInputClass} pl-9`}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 size-4 text-neutral-400" />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={values.longitude}
                    onChange={(e) => onChange("longitude", e.target.value)}
                    className={`${innovationInputClass} pl-9`}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={locating}
                  onClick={getCurrentLocation}
                  className="h-11 gap-2 border-[#2362ee] bg-white px-4 text-xs font-semibold text-[#2362ee] hover:bg-blue-50 hover:text-blue-700"
                >
                  {locating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LocateFixed className="size-4" />
                  )}
                  {locating ? "Mencari..." : "Dapatkan Lokasi Saat Ini"}
                </Button>
              </div>
            </Field>
            <Field label="Inisiator Inovasi Daerah" required wide>
              <ChoiceCards
                value={values.initiatorType}
                options={initiatorOptions}
                onChange={(value) => onChange("initiatorType", value)}
                columns="md:grid-cols-5"
              />
            </Field>
            <Field label="Nama Inisiator" required wide>
              <Input
                required
                value={values.initiatorName}
                onChange={(e) => onChange("initiatorName", e.target.value)}
                className={innovationInputClass}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection number="II" title="Klasifikasi & Urusan">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Klasifikasi Inovasi" required wide>
              <ChoiceCards
                value={values.classification}
                options={innovationClassificationOptions}
                onChange={(value) => onChange("classification", value)}
                columns="md:grid-cols-3"
              />
            </Field>
            <Field label="Bentuk Inovasi Daerah" required>
              <Input
                required
                value={values.innovationForm}
                onChange={(e) => onChange("innovationForm", e.target.value)}
                className={innovationInputClass}
              />
            </Field>
            <Field label="Urusan Pemerintahan Utama" required>
              <Input
                required
                value={values.governmentAffairs}
                onChange={(e) => onChange("governmentAffairs", e.target.value)}
                className={innovationInputClass}
              />
            </Field>
            <Field label="Asta Cita (Tematik)" required wide>
              <ChoiceCards
                value={values.thematic}
                options={innovationThematicOptions}
                onChange={(value) => onChange("thematic", value)}
                columns="grid-cols-1"
              />
            </Field>
            <Field label="Klaster PKPN">
              <Select
                value={values.pkpnCluster}
                onValueChange={(value) => {
                  onChange("pkpnCluster", value ?? "");
                  onChange("pkpnSubCluster", "");
                }}
              >
                <SelectTrigger
                  className="h-11! w-full rounded-lg border-neutral-300 bg-white px-3 text-xs text-neutral-900 dark:bg-white"
                >
                  <SelectValue placeholder="Pilih klaster PKPN" />
                </SelectTrigger>
                <SelectContent className="bg-white text-neutral-900">
                  {pkpnClusterOptions.map((option) => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {selectedPkpnCluster && (
              <Field label="Subklaster PKPN">
                <Select
                  value={values.pkpnSubCluster}
                  onValueChange={(value) =>
                    onChange("pkpnSubCluster", value ?? "")
                  }
                >
                  <SelectTrigger
                    className="h-11! w-full rounded-lg border-neutral-300 bg-white px-3 text-xs text-neutral-900 dark:bg-white"
                  >
                    <SelectValue placeholder="Pilih subklaster PKPN" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-neutral-900">
                    {selectedPkpnCluster.sub.map((subCluster) => (
                      <SelectItem key={subCluster} value={subCluster}>
                        {subCluster}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
            <Field label="Proyek Strategis Nasional (PSN)">
              <Input
                value={values.psn}
                onChange={(e) => onChange("psn", e.target.value)}
                className={innovationInputClass}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection number="III" title="Waktu Pelaksanaan">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Waktu Uji Coba Inovasi Daerah" required>
              <Input
                required
                type="date"
                value={values.trialPeriod}
                onChange={(e) => onChange("trialPeriod", e.target.value)}
                className={innovationInputClass}
              />
            </Field>
            <Field label="Waktu Penerapan Inovasi Daerah" required>
              <Input
                required
                type="date"
                value={values.implementationPeriod}
                onChange={(e) =>
                  onChange("implementationPeriod", e.target.value)
                }
                className={innovationInputClass}
              />
            </Field>
            <Field label="Apakah Sudah Ada Pengembangan Inovasi?" required wide>
              <ChoiceCards
                value={values.isDevelopment ? "Ya" : "Tidak"}
                options={["Ya", "Tidak"]}
                onChange={(value) => onChange("isDevelopment", value === "Ya")}
                columns="grid-cols-2 md:max-w-sm"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection number="IV" title="Deskripsi Substansi">
          <div className="space-y-5">
            <LongText
              label="Rancang Bangun / Deskripsi"
              value={values.description}
              onChange={(value) => onChange("description", value)}
            />
            <LongText
              label="Tujuan Inovasi Daerah"
              value={values.purpose}
              minimumWords={2}
              onChange={(value) => onChange("purpose", value)}
            />
          </div>
        </FormSection>

        <FormSection number="V" title="Dokumen Pendukung">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Anggaran (Jika Diperlukan)",
              "Profil Bisnis (BPT) Jika Ada",
              "Dokumen HAKI",
              "Penghargaan",
            ].map((label, index) => {
              const inputId = `supporting-document-${index}`;
              const selectedFile = values.files[index];
              const storedFileUrl =
                selectedFile &&
                "url" in selectedFile &&
                typeof selectedFile.url === "string"
                  ? selectedFile.url
                  : null;

              return (
                <div
                  key={label}
                  className="flex min-h-24 items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-blue-300"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-neutral-800">
                      {label}
                    </p>
                    {selectedFile ? (
                      storedFileUrl ? (
                        <a
                          href={storedFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={`Lihat ${selectedFile.name}`}
                          className="mt-1 flex max-w-72 items-center gap-1 text-[11px] font-medium text-emerald-700 underline underline-offset-2 hover:text-blue-700"
                        >
                          <span className="truncate">{selectedFile.name}</span>
                          <ExternalLink className="size-3 shrink-0" />
                          <span>· {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        </a>
                      ) : (
                        <p
                          title={selectedFile.name}
                          className="mt-1 max-w-64 truncate text-[11px] font-medium text-emerald-700"
                        >
                          {selectedFile.name} ·{" "}
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )
                    ) : (
                      <p className="mt-1 text-[10px] text-blue-600">
                        Dokumen PDF, maksimal 2 MB
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {selectedFile && !readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Hapus ${selectedFile.name}`}
                        className="size-9 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => {
                          const next = [...values.files];
                          next[index] = null;
                          onChange("files", next);
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    )}

                    {!readOnly && <Label
                      htmlFor={inputId}
                      className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <FileUp className="size-4" />
                      {selectedFile ? "Ganti File" : "Pilih File"}
                    </Label>}
                    {!readOnly && <Input
                      id={inputId}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (!file) return;

                        const isPdf =
                          file.type === "application/pdf" ||
                          file.name.toLowerCase().endsWith(".pdf");

                        if (!isPdf) {
                          toast.add({
                            title: "Format file tidak sesuai",
                            description:
                              "Dokumen harus menggunakan format PDF.",
                            type: "error",
                          });
                          event.currentTarget.value = "";
                          return;
                        }

                        if (file.size > MAX_SUPPORTING_FILE_SIZE) {
                          toast.add({
                            title: "Ukuran file terlalu besar",
                            description: "Ukuran maksimal dokumen adalah 2 MB.",
                            type: "error",
                          });
                          event.currentTarget.value = "";
                          return;
                        }

                        const next = [...values.files];
                        next[index] = file;
                        onChange("files", next);
                        event.currentTarget.value = "";
                      }}
                    />}
                  </div>
                </div>
              );
            })}
          </div>
        </FormSection>
      </fieldset>

      <div className="sticky bottom-4 z-30 flex items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-slate-50/95 p-3 mx-2 ring-1 ring-white/80 backdrop-blur-xl sm:p-4">
        <p className="hidden text-xs font-medium text-slate-500 sm:block">
          {readOnly
            ? "Data inovasi ditampilkan dalam mode lihat."
            : "Pastikan seluruh data telah diisi dengan benar."}
        </p>
        <div className="ml-auto flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-9 min-w-36 gap-2 rounded-md border-[#2362ee] bg-white px-5 text-xs font-semibold text-[#2362ee] hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowLeft className="size-4" />
            Kembali
          </Button>
          {indicatorHref ? (
            <Button
              nativeButton={false}
              render={<Link href={indicatorHref} />}
              className="h-9 min-w-36 gap-2 rounded-md bg-[#2362ee] px-5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <ClipboardList className="size-4" />
              Indikator
            </Button>
          ) : null}
          {!readOnly && (
            <>
              {/* Data yang sudah terkirim langsung diperbarui tanpa kembali ke draft. */}
              {submitted ? null : (
                <Button type="submit" name="submissionStatus" value="DRAFT" formNoValidate disabled={submitting} variant="outline" className="h-9 rounded-md border-amber-500 px-4 text-xs font-semibold text-amber-600 hover:bg-amber-50">
                  Simpan Draft
                </Button>
              )}
              {canSend ? (
                <Button type="submit" name="submissionStatus" value="SUBMITTED" disabled={submitting} className="h-9 min-w-36 rounded-md bg-[#2362ee] px-5 text-xs font-semibold text-white hover:bg-blue-700">
                  {submitting
                    ? "Menyimpan..."
                    : submitted
                      ? "Simpan Perubahan"
                      : "Kirim Data"}
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </form>
  );
}
