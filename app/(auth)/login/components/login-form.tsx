"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { LoginFormValues } from "../page.config";

type LoginFormProps = {
  values: LoginFormValues;
  isSubmitting: boolean;
  onChange: (field: keyof LoginFormValues, value: string | boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function LoginForm({
  values,
  isSubmitting,
  onChange,
  onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[62vh] items-center justify-center bg-white px-6 py-12 sm:px-12 lg:min-h-screen lg:w-1/2 lg:px-16">
      <div className="w-full max-w-[460px]">
        <div className="mb-10 text-center lg:mb-10">
          <Image
            src="/images/logo-karimun.webp"
            alt="Lambang Provinsi Kepulauan Riau"
            width={112}
            height={130}
            priority
            className="mx-auto mb-7 h-auto w-[76px] sm:w-[92px] lg:w-[104px]"
          />
          <h1 className="text-[32px] font-bold leading-tight tracking-[-0.025em] text-black sm:text-[32px] lg:text-[32px]">
            Lomba Inovasi OPD Kabupaten Karimun
          </h1>
          <p className="mt-2 text-[16px] leading-relaxed text-neutral-800 sm:text-[16px] lg:text-[16px]">
            Masuk untuk mengelola proses lomba inovasi sesuai hak akses Anda.
          </p>
        </div>

        <form className="space-y-7" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="identifier"
              className="mb-2 block text-[14px] font-medium text-neutral-900"
            >
              Username atau Email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              value={values.identifier}
              onChange={(event) => onChange("identifier", event.target.value)}
              placeholder="Masukkan username atau email.."
              className="h-[46px] w-full rounded-[9px] border border-neutral-300 bg-[#f7f8fb] px-4 text-[14px] text-neutral-900 outline-none transition placeholder:text-neutral-300 focus:border-[#ffb437] focus:ring-3 focus:ring-[#ffb437]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[14px] font-medium text-neutral-900"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={values.password}
                onChange={(event) => onChange("password", event.target.value)}
                placeholder="Masukkan password.."
                className="h-[46px] w-full rounded-[9px] border border-neutral-300 bg-[#f7f8fb] px-4 pr-12 text-[14px] text-neutral-900 outline-none transition placeholder:text-neutral-300 focus:border-[#ffb437] focus:ring-3 focus:ring-[#ffb437]/20 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
              />
              <button
                type="button"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-neutral-400 transition hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#ffb437]"
              >
                {showPassword ? (
                  <EyeOff className="size-4.5" />
                ) : (
                  <Eye className="size-4.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
          <label className="flex w-fit cursor-pointer items-center gap-3 text-[14px] font-semibold text-neutral-900">
            <input
              type="checkbox"
              checked={values.rememberMe}
              onChange={(event) => onChange("rememberMe", event.target.checked)}
              className="h-5 w-5 cursor-pointer rounded-[3px] border-neutral-300 accent-[#ffb437] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb437]"
            />
            Ingat Saya
          </label>
          <a href="mailto:diskominfo@karimunkab.go.id?subject=Bantuan%20Password%20Lomba%20Inovasi%20OPD" className="text-[14px] font-semibold text-[#d98700] hover:underline">Lupa Password?</a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-[46px] w-full rounded-[10px] bg-[#ffb437] text-[16px] font-medium text-white transition hover:bg-[#f3a620] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb437] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
