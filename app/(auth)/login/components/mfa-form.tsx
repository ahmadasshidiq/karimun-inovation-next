"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AppCredit } from "@/components/app-credit";

type MfaFormProps = {
  code: string;
  isSubmitting: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
};

export default function MfaForm({
  code,
  isSubmitting,
  onChange,
  onSubmit,
  onBack,
}: MfaFormProps) {
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const toggleMode = () => {
    setUseRecoveryCode((current) => !current);
    onChange("");
  };

  return (
    <div className="flex min-h-[62vh] items-center justify-center bg-white px-6 py-12 sm:px-12 lg:min-h-screen lg:w-1/2 lg:px-16">
      <div className="w-full max-w-[460px]">
        <div className="mb-10 text-center">
          <Image
            src="/images/logo-karimun.webp"
            alt="Lambang Provinsi Kepulauan Riau"
            width={112}
            height={130}
            priority
            className="mx-auto mb-7 h-auto w-[76px] sm:w-[92px] lg:w-[104px]"
          />
          <h1 className="flex items-center justify-center gap-2 text-[28px] font-bold leading-tight tracking-[-0.025em] text-black">
            <ShieldCheck className="size-7 text-[#ffb437]" />
            Verifikasi Dua Langkah
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-neutral-800">
            {useRecoveryCode
              ? "Masukkan salah satu kode pemulihan yang Anda simpan."
              : "Masukkan 6 digit kode dari aplikasi autentikator Anda."}
          </p>
        </div>

        <form className="space-y-7" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="mfa-code"
              className="mb-2 block text-[14px] font-medium text-neutral-900"
            >
              {useRecoveryCode ? "Kode Pemulihan" : "Kode Autentikasi"}
            </label>
            <input
              id="mfa-code"
              name="code"
              type="text"
              inputMode={useRecoveryCode ? "text" : "numeric"}
              autoComplete="one-time-code"
              autoFocus
              required
              maxLength={useRecoveryCode ? 9 : 6}
              value={code}
              onChange={(event) =>
                onChange(
                  useRecoveryCode
                    ? event.target.value.toUpperCase()
                    : event.target.value.replace(/\D/g, ""),
                )
              }
              placeholder={useRecoveryCode ? "XXXX-XXXX" : "000000"}
              className="h-[46px] w-full rounded-[9px] border border-neutral-300 bg-[#f7f8fb] px-4 text-center text-[18px] tracking-[0.4em] text-neutral-900 outline-none transition placeholder:text-neutral-300 focus:border-[#ffb437] focus:ring-3 focus:ring-[#ffb437]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!useRecoveryCode && code.length !== 6)}
            className="h-[46px] w-full rounded-[10px] bg-[#ffb437] text-[16px] font-medium text-white transition hover:bg-[#f3a620] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb437] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Memverifikasi..." : "Verifikasi"}
          </button>

          <div className="flex items-center justify-between text-[14px] font-semibold">
            <button
              type="button"
              onClick={onBack}
              className="text-neutral-500 transition hover:text-neutral-900"
            >
              ← Kembali
            </button>
            <button
              type="button"
              onClick={toggleMode}
              className="text-[#e09a1f] transition hover:text-[#b87a10]"
            >
              {useRecoveryCode
                ? "Gunakan kode autentikator"
                : "Gunakan kode pemulihan"}
            </button>
          </div>
        </form>

        <AppCredit className="mt-8" align="center" />
      </div>
    </div>
  );
}
