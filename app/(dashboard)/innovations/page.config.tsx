"use client";

import {
  Eye,
  ExternalLink,
  FilePenLine,
  Flame,
  FolderInput,
  Ribbon,
  Rocket,
  Send,
  Sparkles,
  SquarePen,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  ActionMenu,
  DeleteAction,
  type ActionMenuItem,
  FilterPanel,
  FilterSearch,
  FilterSelect,
  TableActions,
  TableToolbar,
  type FilterOption,
} from "@/components/table-elements";
import { formatDateId } from "@/lib/helper/date";

export type InnovationStage = "Inisiatif" | "Uji Coba" | "Penerapan";

export type InnovationDto = {
  id: string;
  name: string;
  latitude: string | null;
  longitude: string | null;
  status: "ACTIVE" | "INACTIVE";
  submissionStatus: "INCOMPLETE" | "DRAFT" | "SUBMITTED";
  approvalStatus: "PENDING_REVIEW" | "APPROVED" | "REVISION_REQUIRED";
  approvalNote: string | null;
  initiatorType: string | null;
  initiatorName: string | null;
  type: string | null;
  stage: string | null;
  classification: string | null;
  category: string | null;
  innovationForm: string | null;
  thematic: string | null;
  pkpnCluster: string | null;
  pkpnSubCluster: string | null;
  governmentAffairs: string | null;
  psn: string | null;
  trialPeriod: string | null;
  implementationPeriod: string | null;
  isDevelopment: boolean;
  description: string | null;
  purpose: string | null;
  files: unknown[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy?: {
    id: string;
    username: string;
    fullname: string;
    email: string | null;
  };
};

export type InnovationFileValue =
  | File
  | { name: string; size: number; url?: string; category?: string }
  | null;

export type InnovationEditorValues = {
  id?: string;
  name: string;
  latitude: string;
  longitude: string;
  status: "ACTIVE" | "INACTIVE";
  submissionStatus: "INCOMPLETE" | "DRAFT" | "SUBMITTED";
  initiatorType: string;
  initiatorName: string;
  type: string;
  stage: string;
  classification: string;
  category: string;
  innovationForm: string;
  thematic: string;
  pkpnCluster: string;
  pkpnSubCluster: string;
  governmentAffairs: string;
  psn: string;
  trialPeriod: string;
  implementationPeriod: string;
  isDevelopment: boolean;
  description: string;
  purpose: string;
  files: InnovationFileValue[];
};

export const initialInnovationEditorValues: InnovationEditorValues = {
  name: "",
  latitude: "",
  longitude: "",
  status: "ACTIVE",
  submissionStatus: "INCOMPLETE",
  initiatorType: "OPD",
  initiatorName: "",
  type: "Digital",
  stage: "Inisiatif",
  classification: "Inovasi Perangkat Daerah",
  category: "perangkat-daerah",
  innovationForm: "Digital",
  thematic: "",
  pkpnCluster: "",
  pkpnSubCluster: "",
  governmentAffairs: "",
  psn: "",
  trialPeriod: "",
  implementationPeriod: "",
  isDevelopment: false,
  description: "",
  purpose: "",
  files: [null, null, null, null],
};

export const innovationInputClass =
  "h-11 border-neutral-200 bg-neutral-50 text-[12px] text-neutral-900 placeholder:text-[12px] focus-visible:border-blue-500 focus-visible:ring-blue-100";

export const initiatorOptions = [
  "Kepala Daerah",
  "Anggota DPRD",
  "OPD",
  "ASN",
  "Masyarakat",
];

export const innovationTypeOptions = ["Digital", "Non Digital"];

export const innovationClassificationOptions = [
  "Inovasi Perangkat Daerah",
  "Inovasi Desa dan Kelurahan",
  "Inovasi Masyarakat",
];

export const innovationCategoryOptions = [
  { value: "perangkat-daerah", label: "Perangkat Daerah" },
  { value: "kecamatan", label: "Kecamatan" },
  { value: "kelurahan", label: "Kelurahan" },
  { value: "upt-puskesmas", label: "UPT Puskesmas" },
  { value: "satuan-pendidikan", label: "Satuan Pendidikan" },
] as const;

export type InnovationCategory = (typeof innovationCategoryOptions)[number]["value"];

export const innovationThematicOptions = [
  "Memperkokoh ideologi Pancasila, demokrasi, dan hak asasi manusia",
  "Memantapkan sistem pertahanan keamanan negara dan mendorong kemandirian bangsa melalui swasembada pangan, energi, air, ekonomi kreatif, ekonomi hijau, dan ekonomi biru",
  "Meningkatkan lapangan kerja yang berkualitas, mendorong kewirausahaan, mengembangkan industri kreatif, dan melanjutkan pengembangan infrastruktur",
  "Memperkuat pembangunan sumber daya manusia (SDM), sains, teknologi, pendidikan, kesehatan, prestasi olahraga, kesetaraan gender, serta penguatan peran perempuan, pemuda, dan penyandang disabilitas",
  "Melanjutkan hilirisasi dan industrialisasi untuk meningkatkan nilai tambah di dalam negeri",
  "Membangun dari desa dan dari bawah untuk pemerataan ekonomi dan pemberantasan kemiskinan",
  "Memperkuat reformasi politik, hukum, dan birokrasi, serta memperkuat pencegahan dan pemberantasan korupsi dan narkoba",
  "Memperkuat penyelarasan kehidupan yang harmonis dengan lingkungan, alam, dan budaya, serta peningkatan toleransi antarumat beragama untuk mencapai masyarakat yang adil dan makmur",
];

export const pkpnClusterOptions = [
  {
    name: "Kedaulatan Pangan",
    sub: [
      "5.000 kampung nelayan merah putih",
      "4.582 kapal ikan modern",
      "40.000 lokasi budi daya ikan darat tematik",
      "Revitalisasi tambak nila Salin 14.090 ha di pantura",
      "Modeling dan replikasi 2.000 ha tambak udang terintegrasi",
      "2.000 ha kawasan Sentra industri garam nasional",
      "Pengembangan kawasan pangan terintegrasi",
      "Pengembangan kawasan perkebunan (sawit, tebu, kakao, kelapa, kopi, jambu mete, rempah)",
      "Peningkatan produksi daging, susu, dan telur",
    ],
  },
  {
    name: "Kemandirian Energi dan Air",
    sub: [
      "Mandatori Biodiesel 50 (B50)",
      "Mandatori Bioetanol 20 (E20)",
      "Program Pembangkit Listrik Tenaga Surya (PLTS) 100 GW",
      "Implementasi Standar Kinerja Energi Minimum (SKEM)",
      "Konversi 6 Juta Unit Motor BBM ke Motor Listrik",
      "Pembangunan Jaringan Gas Kota (Jargas) untuk 1 Juta Sambungan Rumah (SR)",
      "Peningkatan Lifting Minyak dan Gas Bumi",
      "10 Smal Scale Green Modular Refinery and 6 Storage (Deployable Mass Model)",
      "Eksplorasi 10 Ladang Migas Baru Listrik Pedesaan",
      "Pengelolaan Sampah menjadi Energi Listrik (PSEL)",
      "PLTA Skala Besar Terintegrasi",
      "Kompor Listrik untuk 2-5 Juta Rumah Tangga",
      "Optimalisasi 45.000 Sumur Minyak Masyarakat",
      "Optimalisasi 13.000 Sumur Minyak Tua Swasembada Air",
    ],
  },
  {
    name: "Pendidikan",
    sub: [
      "Makan Bergizi Gratis Anak Sekolah",
      "Revitalisasi Sarana dan Prasarana Sekolah/Madrasah",
      "Bantuan Perlengkapan Sekolah",
      "500 Sekolah Nasional Terintegrasi (SNT)",
      "Studio Guru",
      "Digitalisasi Pendidikan (2 Juta Papan Interaktif Digital)",
      "20 Sekolah Garuda Baru, 80 Sekolah Garuda Transformasi",
      "514 Sekolah Rakyat",
      "10 Universitas Baru: Medical University berbasis STEMM",
      "SMK Go Global",
      "Peningkatan Kesejahteraan Guru, Transfer Langsung Tunjangan",
    ],
  },
  {
    name: "Kesehatan",
    sub: [
      "Makan Bergizi Gratis Ibu Hamil, Ibu Menyusui, dan Balita",
      "66 Rumah Sakit Upgrade",
      "Pemeriksaan Kesehatan Gratis",
      "Penuntasan Tuberkulosis",
    ],
  },
  {
    name: "Hilirisasi dan Industrialisasi",
    sub: [
      "Hilirisasi Industri Strategis",
      "Mobil Nasional",
      "Motor Nasional",
      "Ekosistem Industri Kedirgantaraan",
      "Pengembangan Industri Semikonduktor",
    ],
  },
  {
    name: "Infrastruktur Perumahan, dan Ketahanan Bencana",
    sub: [
      "Giant Sea Wall",
      "Rehabilitasi dan Rekonstruksi Pasca Bencana Sumatera",
      "Gerakan ASRI (Gentengisasi, Pengendalian Sampah, Penghijauan)",
      "3 Juta Rumah: 1 Juta Rumah Baru & 2 Juta Renovasi Rumah",
      "Pengembangan Jaringan Kereta Api Nasional",
    ],
  },
  {
    name: "Ekonomi Kerakyatan dan Desa",
    sub: [
      "80.000 Koperasi Desa/Kelurahan Merah Putih",
      "Percepatan Pembangunan Daerah 3T",
    ],
  },
  {
    name: "Penurunan Kemiskinan",
    sub: [
      "PRO-KESRA Bantuan Sosial Terintegrasi",
      "PRO-KESRA 10 Juta Penduduk Berusaha dan Bekerja",
    ],
  },
  { name: "NON PKPN", sub: [] },
];

export const innovationStageOptions = ["Inisiatif", "Uji Coba", "Penerapan"];

export const MAX_SUPPORTING_FILE_SIZE = 2 * 1024 * 1024;

export type InnovationTableDto = {
  id: string;
  submissionStatus: "INCOMPLETE" | "DRAFT" | "SUBMITTED";
  number: number;
  organization: string;
  innovationName: string;
  innovationForm: string;
  governmentAffair: string;
  initiator: string;
  stage: string;
  trialDate: string;
  ImplementationDate: string;
  DevelopmentDate: string;
  latitude: string;
  longitude: string;
  awardFileUrl: string;
  awarded: boolean;
  skor: number;
  contractSubmitted: boolean;
  competitionSubmitted: boolean;
};

export type SubmissionTrack = "CONTRACT" | "COMPETITION";

export type SubmissionAccess = {
  contract: boolean;
  competition: boolean;
};

export type ActiveCompetitionPeriod = {
  id: string;
  name: string;
  endDate: string;
};

export type InnovationFormValues = Omit<
  InnovationTableDto,
  "id" | "number" | "awarded" | "contractSubmitted" | "competitionSubmitted"
>;
export type InnovationFilters = {
  search: string;
  submissionStatus: string;
  innovationForm: string;
  governmentAffair: string;
  initiator: string;
  stage: string;
};
export type InnovationFilterOptions = {
  governmentAffairs: string[];
  initiators: string[];
};
export type SummaryKey =
  | "total"
  | "initiative"
  | "trial"
  | "implementation"
  | "award";
export type SummaryCard = {
  key: SummaryKey;
  title: string;
  color: string;
  icon: LucideIcon;
};

export const ITEMS_PER_PAGE = 10;
export const initialFilters: InnovationFilters = {
  search: "",
  submissionStatus: "all",
  innovationForm: "all",
  governmentAffair: "all",
  initiator: "all",
  stage: "all",
};
export const initialFormValues: InnovationFormValues = {
  submissionStatus: "INCOMPLETE",
  organization: "Badan Pendapatan Daerah",
  innovationName: "",
  innovationForm: "Digital",
  governmentAffair: "Keuangan",
  initiator: "",
  stage: "Inisiatif",
  trialDate: "2026-08-10",
  ImplementationDate: "2026-08-10",
  DevelopmentDate: "2026-08-10",
  latitude: "",
  longitude: "",
  awardFileUrl: "",
  skor: 0,
};

export const summaryCards: SummaryCard[] = [
  {
    key: "total",
    title: "Total Inovasi",
    color: "bg-[#2362ee]",
    icon: Sparkles,
  },
  {
    key: "initiative",
    title: "Inisiatif",
    color: "bg-[#ff9d09]",
    icon: Ribbon,
  },
  { key: "trial", title: "Uji Coba", color: "bg-[#ff2455]", icon: Flame },
  {
    key: "implementation",
    title: "Penerapan",
    color: "bg-[#08bb7d]",
    icon: Rocket,
  },
  { key: "award", title: "Penghargaan", color: "bg-[#a97800]", icon: Trophy },
];

export const columnFormats: DefaultColumnFormat<InnovationTableDto>[] = [
  {
    key: "submissionStatus",
    title: "",
    formatter: (value) => {
      const colors = { SUBMITTED: "bg-emerald-500", DRAFT: "bg-amber-400", INCOMPLETE: "bg-red-500" };
      const status = String(value) as keyof typeof colors;
      return (
        <span
          title={status === "SUBMITTED" ? "Sudah lengkap dan terkirim" : status === "DRAFT" ? "Sudah lengkap tetapi belum terkirim" : "Belum lengkap"}
          className={`-my-5 -ml-4 block h-[calc(100%+2.5rem)] min-h-16 w-2.5 rounded-l-full ${colors[status] || colors.INCOMPLETE}`}
        />
      );
    },
  },
  { key: "number", title: "#", formatter: (value) => String(value) },
  { key: "organization", title: "Nama Akun" },
  { key: "innovationName", title: "Nama Inovasi" },
  {
    key: "stage",
    title: "Tahapan Inovasi",
    formatter: (value) => {
      const stage = String(value) as InnovationStage;

      const stageStyles: Record<InnovationStage, string> = {
        Inisiatif: "bg-orange-100 text-orange-700",
        "Uji Coba": "bg-rose-100 text-rose-700",
        Penerapan: "bg-emerald-100 text-emerald-700",
      };

      return (
        <span
          className={`inline-flex min-w-32 justify-center rounded-full px-4 py-1 text-xs font-medium ${
            stageStyles[stage] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {stage}
        </span>
      );
    },
  },
  { key: "initiator", title: "Nama Inisiator" },
  { key: "governmentAffair", title: "Urusan Pemerintahan Utama" },
  { key: "psn", title: "Proyek Strategis Nasional (PSN)" },
  {
    key: "trialDate",
    title: "Waktu Uji Coba Inovasi",
    formatter: (value) => formatDateId(value),
  },
  {
    key: "ImplementationDate",
    title: "Waktu Penerapan Inovasi",
    formatter: (value) => formatDateId(value),
  },
  {
    key: "DevelopmentDate",
    title: "Waktu Pengembangan Inovasi",
    formatter: (value) => formatDateId(value),
  },
  {
    key: "skor",
    title: "Estimasi Skor Kematangan",
    formatter: (value) => Number(value || 0).toFixed(2),
  },
  {
    key: "awardFileUrl",
    title: "File Penghargaan",
    formatter: (value) =>
      typeof value === "string" && value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Lihat Dokumen
          <ExternalLink className="size-3.5" />
        </a>
      ) : (
        <span className="text-slate-400">-</span>
      ),
  },
  {
    key: "latitude",
    title: "Koordinat",
    formatter: (_value, row) =>
      row.latitude && row.longitude ? (
        <a
          href={`https://www.google.com/maps?q=${encodeURIComponent(`${row.latitude},${row.longitude}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Lihat Koordinat
          <ExternalLink className="size-3.5" />
        </a>
      ) : (
        <span className="text-slate-400">-</span>
      ),
  },
];

type RenderActionsProps = {
  row: InnovationTableDto;
  submissionAccess: SubmissionAccess;
  activeCompetitionPeriod: ActiveCompetitionPeriod | null;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onIndicators: (id: string) => void;
  onSubmitTrack: (id: string, track: SubmissionTrack) => void;
  onDelete: (id: string) => void | Promise<void>;
};

const INCOMPLETE_HINT = "Lengkapi dan kirim data inovasi terlebih dahulu.";

const getContractHint = (row: InnovationTableDto) => {
  if (row.submissionStatus !== "SUBMITTED") return INCOMPLETE_HINT;
  if (row.contractSubmitted) return "Sudah dikirim sebagai Perjanjian Kinerja.";
  return undefined;
};

const getCompetitionHint = (
  row: InnovationTableDto,
  period: ActiveCompetitionPeriod | null,
) => {
  if (row.submissionStatus !== "SUBMITTED") return INCOMPLETE_HINT;
  if (!period) return "Periode lomba belum dibuka.";
  if (row.competitionSubmitted) return `Sudah dikirim ke ${period.name}.`;
  return `${period.name}, ditutup ${formatDateId(period.endDate)}.`;
};

const getSubmissionItems = (
  row: InnovationTableDto,
  access: SubmissionAccess,
  period: ActiveCompetitionPeriod | null,
  onSubmitTrack: (id: string, track: SubmissionTrack) => void,
): ActionMenuItem[] => [
  ...(access.contract
    ? [
        {
          label: "Kirim Sebagai Perjanjian Kinerja",
          icon: FilePenLine,
          disabled: Boolean(getContractHint(row)),
          hint: getContractHint(row),
          onClick: () => onSubmitTrack(row.id, "CONTRACT"),
        },
      ]
    : []),
  ...(access.competition
    ? [
        {
          label: "Kirim Sebagai Lomba Inovasi",
          icon: Trophy,
          disabled:
            row.submissionStatus !== "SUBMITTED" ||
            !period ||
            row.competitionSubmitted,
          hint: getCompetitionHint(row, period),
          onClick: () => onSubmitTrack(row.id, "COMPETITION"),
        },
      ]
    : []),
];

export const renderActions = ({
  row,
  submissionAccess,
  activeCompetitionPeriod,
  deleteId,
  setDeleteId,
  onView,
  onEdit,
  onIndicators,
  onSubmitTrack,
  onDelete,
}: RenderActionsProps) => (
  <TableActions>
    <ActionButton
      label="Lihat"
      icon={Eye}
      tone="blue"
      onClick={() => onView(row.id)}
    />
    <ActionButton
      label="Edit"
      icon={SquarePen}
      tone="yellow"
      onClick={() => onEdit(row.id)}
    />
    <ActionButton
      label="Indikator"
      icon={FolderInput}
      tone="green"
      onClick={() => onIndicators(row.id)}
    />
    {submissionAccess.contract || submissionAccess.competition ? (
      <ActionMenu
        label="Kirim"
        icon={Send}
        tone="indigo"
        items={getSubmissionItems(
          row,
          submissionAccess,
          activeCompetitionPeriod,
          onSubmitTrack,
        )}
      />
    ) : null}
    <DeleteAction
      open={deleteId === row.id}
      onOpenChange={(open) => setDeleteId(open ? row.id : null)}
      onConfirm={() => onDelete(row.id)}
    />
  </TableActions>
);

type HeaderToolbarProps = {
  onAdd: () => void;
  onExport: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <TableToolbar addLabel="Tambah Inovasi" {...props} />
);

const toOptions = (values: string[]): FilterOption[] =>
  values.map((value) => ({ value, label: value }));

const submissionStatusOptions: FilterOption[] = [
  { value: "INCOMPLETE", label: "Belum Lengkap" },
  { value: "DRAFT", label: "Lengkap, Belum Terkirim" },
  { value: "SUBMITTED", label: "Lengkap dan Terkirim" },
];

type FilterPanelProps = {
  filters: InnovationFilters;
  options: InnovationFilterOptions;
  setFilter: (key: keyof InnovationFilters, value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
};

export const filterPanel = ({
  filters,
  options,
  setFilter,
  applyFilters,
  clearFilters,
}: FilterPanelProps) => (
  <FilterPanel
    title="Filter Inovasi Perangkat Daerah"
    onApply={applyFilters}
    onReset={clearFilters}
    className="xl:grid-cols-3"
  >
    <FilterSearch
      value={filters.search}
      onChange={(value) => setFilter("search", value)}
      placeholder="Cari nama inovasi..."
    />
    <FilterSelect
      label="Status Pengiriman"
      allLabel="Semua Status"
      value={filters.submissionStatus}
      options={submissionStatusOptions}
      onChange={(value) => setFilter("submissionStatus", value)}
    />
    <FilterSelect
      label="Bentuk Inovasi"
      allLabel="Semua Bentuk Inovasi"
      value={filters.innovationForm}
      options={toOptions(innovationTypeOptions)}
      onChange={(value) => setFilter("innovationForm", value)}
    />
    <FilterSelect
      label="Jenis Urusan"
      allLabel="Semua Jenis Urusan"
      value={filters.governmentAffair}
      options={toOptions(options.governmentAffairs)}
      onChange={(value) => setFilter("governmentAffair", value)}
    />
    <FilterSelect
      label="Inisiator"
      allLabel="Semua Inisiator"
      value={filters.initiator}
      options={toOptions(options.initiators)}
      onChange={(value) => setFilter("initiator", value)}
    />
    <FilterSelect
      label="Tahapan Inovasi"
      allLabel="Semua Tahapan Inovasi"
      value={filters.stage}
      options={toOptions(innovationStageOptions)}
      onChange={(value) => setFilter("stage", value)}
    />
  </FilterPanel>
);
