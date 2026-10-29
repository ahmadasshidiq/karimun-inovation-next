import { formatDateId } from "@/lib/helper/date";
import type { CertificateData } from "@/lib/innovation-certificate";

export const getVerificationRows = (certificate: CertificateData) => [
  { label: "Nomor Bukti", value: certificate.number },
  { label: "Nama Inovasi", value: certificate.name },
  { label: "Unit Inovasi", value: certificate.institution },
  { label: "Tahapan Inovasi", value: certificate.stage || "-" },
  {
    label: "Tanggal Verifikasi",
    value: formatDateId(certificate.approvedAt, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  },
];
