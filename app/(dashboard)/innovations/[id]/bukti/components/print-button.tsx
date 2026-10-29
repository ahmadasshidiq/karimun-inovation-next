"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <div className="mx-auto mb-4 flex w-full max-w-[210mm] items-center justify-between gap-3 print:hidden">
      <Button
        nativeButton={false}
        render={<Link href="/innovations" />}
        variant="outline"
        className="h-9 gap-2 rounded-md border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-100"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </Button>
      <Button
        type="button"
        onClick={() => window.print()}
        className="h-9 gap-2 rounded-md bg-[#2362ee] px-4 text-xs font-semibold text-white hover:bg-blue-700"
      >
        <Printer className="size-4" />
        Cetak / Simpan PDF
      </Button>
    </div>
  );
}
