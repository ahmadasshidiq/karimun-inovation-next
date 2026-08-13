"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";
import LoginForm from "./components/login-form";
import { initialLoginForm, type LoginFormValues } from "./page.config";

export default function LoginPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<LoginFormValues>(initialLoginForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("reason") !== "session_expired") return;

    localStorage.removeItem("hr_user_data");
    toast.add({
      title: "Sesi Anda berakhir",
      description: "Akun Anda telah digunakan untuk login di perangkat lain.",
      type: "error",
      priority: "high",
    });

    window.history.replaceState({}, "", "/login");
  }, []);

  const handleChange = useCallback(
    (field: keyof LoginFormValues, value: string | boolean) => {
      setFormValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        setIsSubmitting(true);

        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        const result = (await response.json().catch(() => ({}))) as {
          message?: string;
          data?: Record<string, unknown>;
        };

        if (!response.ok) {
          throw new Error(result.message || "Login gagal.");
        }

        if (result.data) {
          localStorage.setItem("hr_user_data", JSON.stringify(result.data));
        }

        toast.add({
          title: "Login berhasil",
          description: "Selamat datang kembali.",
          type: "success",
        });
        router.replace("/dashboard");
        router.refresh();
      } catch (error) {
        toast.add({
          title: "Login gagal",
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat login.",
          type: "error",
          priority: "high",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, router],
  );

  return (
    <main className="min-h-screen bg-white lg:flex">
      <section className="relative min-h-[20vh] overflow-hidden bg-neutral-950 lg:min-h-screen lg:w-1/2">
        <div
          className="absolute inset-0 bg-cover bg-[position:center_42%] lg:bg-center"
          style={{ backgroundImage: "url('/images/login-lightbulb.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/75 lg:bg-gradient-to-b lg:from-transparent lg:via-transparent lg:to-black/80" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-7 text-white sm:px-10 sm:pb-10 lg:px-[7.8%] lg:pb-[11%]">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] sm:text-[24px] lg:text-[24px] xl:text-[24px]">
            Dari Setiap Inovasi, Tercipta Kemajuan Kabupaten Karimun.
          </h2>
          <p className="mt-3 max-w-[740px] text-[16px] leading-snug text-white/95 sm:text-[16px] lg:text-[16px]">
            Platform digital untuk mendukung pengelolaan, pelaporan, dan pengembangan
            inovasi daerah di Provinsi Kepulauan Riau secara efektif dan transparan.
          </p>
        </div>
      </section>

      <LoginForm
        values={formValues}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
