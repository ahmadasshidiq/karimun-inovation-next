import type { Metadata } from "next";

import { findCertificate } from "@/lib/innovation-certificate";

import VerificationResult from "./components/verification-result";

export const metadata: Metadata = {
  title: "Verifikasi Bukti Inovasi Daerah",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Halaman publik tujuan QR pada bukti verifikasi; dapat dibuka tanpa login.
export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certificate = UUID_PATTERN.test(id) ? await findCertificate(id) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-4 py-10">
      <VerificationResult certificate={certificate} />
    </main>
  );
}
