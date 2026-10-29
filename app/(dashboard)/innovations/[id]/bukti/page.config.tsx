import { formatDateId } from "@/lib/helper/date";
import type { CertificateData } from "@/lib/innovation-certificate";

export const formatCertificateScore = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatCertificateDate = (value: string) =>
  formatDateId(value, { day: "numeric", month: "long", year: "numeric" });

export const getCertificateRows = (certificate: CertificateData) => [
  { label: "Nama Inovasi", value: certificate.name },
  { label: "Unit Inovasi", value: certificate.institution },
  { label: "Tahapan Inovasi", value: certificate.stage || "-" },
  { label: "Bentuk Inovasi", value: certificate.innovationForm || "-" },
  {
    label: "Urusan Pemerintahan",
    value: certificate.governmentAffairs || "-",
  },
  { label: "Inisiator", value: certificate.initiatorName || "-" },
  {
    label: "Skor Kematangan",
    value: formatCertificateScore(certificate.score),
  },
  {
    label: "Tanggal Verifikasi",
    value: formatCertificateDate(certificate.approvedAt),
  },
  { label: "Verifikator", value: certificate.approvedBy || "-" },
];
