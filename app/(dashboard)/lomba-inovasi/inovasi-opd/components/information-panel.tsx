import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function InformationPanel() {
  return (
    <section className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <span className="mt-0.5 h-8 w-1 rounded-full bg-[#315bea]" />
        <div>
          <h2 className="text-sm font-extrabold uppercase text-[#124579]">Indeks Inovasi Daerah 2025</h2>
          <p className="mt-2 max-w-4xl text-[11px] leading-5 text-slate-500">Sistem ini digunakan untuk mengumpulkan seluruh Inovasi Daerah baik bidang Digital maupun Non Digital yang kemudian dilakukan pengukuran dan penilaian terhadap masing-masing inovasi yang dikirimkan ke Kemendagri.</p>
        </div>
      </div>
      <Button className="h-10 shrink-0 gap-2 bg-[#124579] px-5 text-[11px] font-bold uppercase text-white hover:bg-[#0d365f]">
        <BookOpen className="size-3.5" /> Petunjuk Teknis
      </Button>
    </section>
  );
}

