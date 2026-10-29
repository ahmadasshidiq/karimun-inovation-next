import Image from "next/image";

import type { CertificateData } from "@/lib/innovation-certificate";

import { getCertificateRows } from "../page.config";

type CertificateSheetProps = {
  certificate: CertificateData;
  qrSvg: string;
  verifyUrl: string;
};

export default function CertificateSheet({
  certificate,
  qrSvg,
  verifyUrl,
}: CertificateSheetProps) {
  return (
    <article className="mx-auto flex min-h-[297mm] w-full max-w-[210mm] flex-col bg-white px-[18mm] py-[16mm] text-slate-900 shadow-sm print:min-h-0 print:max-w-none print:shadow-none">
      <header className="flex items-center gap-4 border-b-2 border-slate-900 pb-4">
        <Image
          src="/images/logo-karimun.webp"
          alt="Lambang Kabupaten Karimun"
          width={64}
          height={76}
          className="h-auto w-16"
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            Pemerintah Kabupaten Karimun
          </p>
          <p className="text-lg font-bold">Sistem Inovasi Daerah</p>
        </div>
      </header>

      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          Bukti Verifikasi Inovasi Daerah
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Nomor: {certificate.number}
        </p>
      </div>

      <p className="mt-10 text-sm leading-7">
        Dengan ini menerangkan bahwa inovasi daerah berikut telah melengkapi
        seluruh data dan indikator wajib, serta telah diverifikasi dan
        disetujui oleh verifikator.
      </p>

      <table className="mt-6 w-full text-sm">
        <tbody>
          {getCertificateRows(certificate).map((row) => (
            <tr key={row.label} className="border-b border-slate-200">
              <td className="w-52 py-3 align-top text-slate-600">
                {row.label}
              </td>
              <td className="py-3 align-top font-semibold">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="mt-auto flex items-end justify-between gap-6 pt-12">
        <p className="max-w-sm text-xs leading-5 text-slate-500">
          Keaslian dokumen ini dapat diperiksa dengan memindai kode QR atau
          membuka tautan berikut:
          <br />
          <span className="break-all font-medium text-slate-700">
            {verifyUrl}
          </span>
        </p>
        <div
          className="size-32 shrink-0 [&_svg]:size-full"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
      </footer>
    </article>
  );
}
