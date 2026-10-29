import Image from "next/image";
import { BadgeCheck, CircleAlert } from "lucide-react";

import type { CertificateData } from "@/lib/innovation-certificate";

import { getVerificationRows } from "../page.config";

export default function VerificationResult({
  certificate,
}: {
  certificate: CertificateData | null;
}) {
  const valid = Boolean(certificate?.eligible);

  return (
    <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo-karimun.webp"
          alt="Lambang Kabupaten Karimun"
          width={40}
          height={48}
          className="h-auto w-10"
        />
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Pemerintah Kabupaten Karimun
          </p>
          <p className="text-sm font-bold text-slate-900">
            Verifikasi Bukti Inovasi Daerah
          </p>
        </div>
      </div>

      {valid && certificate ? (
        <>
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700">
            <BadgeCheck className="size-6 shrink-0" />
            <p className="text-sm font-semibold">
              Bukti valid. Inovasi ini telah diverifikasi dan disetujui.
            </p>
          </div>
          <dl className="mt-5 divide-y divide-slate-100 text-sm">
            {getVerificationRows(certificate).map((row) => (
              <div key={row.label} className="grid grid-cols-[9rem_1fr] gap-3 py-3">
                <dt className="text-slate-500">{row.label}</dt>
                <dd className="font-semibold text-slate-900">{row.value}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700">
          <CircleAlert className="size-6 shrink-0" />
          <p className="text-sm font-semibold">
            Bukti tidak valid atau inovasi sudah tidak berstatus terverifikasi.
          </p>
        </div>
      )}
    </section>
  );
}
