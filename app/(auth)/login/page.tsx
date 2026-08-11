"use client";

import { useCallback, useState, type FormEvent } from "react";

import LoginForm from "./components/login-form";
import { initialLoginForm, type LoginFormValues } from "./page.config";

export default function LoginPage() {
  const [formValues, setFormValues] = useState<LoginFormValues>(initialLoginForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (field: keyof LoginFormValues, value: string | boolean) => {
      setFormValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => setIsSubmitting(false), 700);
  }, []);

  return (
    <main className="min-h-screen bg-white lg:flex">
      <section className="relative min-h-[38vh] overflow-hidden bg-neutral-950 lg:min-h-screen lg:w-1/2">
        <div
          className="absolute inset-0 bg-cover bg-[position:center_42%] lg:bg-center"
          style={{ backgroundImage: "url('/images/login-lightbulb.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/75 lg:bg-gradient-to-b lg:from-transparent lg:via-transparent lg:to-black/80" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-7 text-white sm:px-10 sm:pb-10 lg:px-[7.8%] lg:pb-[11%]">
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.015em] sm:text-[28px] lg:text-[28px] xl:text-[28px]">
            Dari Setiap Inovasi, Tercipta Kemajuan Kepri.
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

