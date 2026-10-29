import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationOwnerScope } from "@/lib/innovation-access";
import { findCertificate } from "@/lib/innovation-certificate";

import CertificateSheet from "./components/certificate-sheet";
import PrintButton from "./components/print-button";

export default async function InnovationCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthenticatedUser();
  if (!user) notFound();

  const certificate = await findCertificate(id, innovationOwnerScope(user));
  if (!certificate?.eligible) notFound();

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const verifyUrl = `${protocol}://${host}/verifikasi/${certificate.id}`;
  const qrSvg = await QRCode.toString(verifyUrl, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
  });

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-6 print:bg-white print:p-0">
      <PrintButton />
      <CertificateSheet
        certificate={certificate}
        qrSvg={qrSvg}
        verifyUrl={verifyUrl}
      />
    </main>
  );
}
