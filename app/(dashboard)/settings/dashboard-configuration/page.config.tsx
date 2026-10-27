"use client";

import { SquarePen } from "lucide-react";

import type { DefaultColumnFormat } from "@/components/dynamic-page";
import {
  ActionButton,
  DeleteAction,
  TableActions,
  TableToolbar,
} from "@/components/table-elements";

export type DashboardConfigurationDto = {
  id?: string;
  countdownTarget: string;
  countdownActive: boolean;
};

export type DashboardConfigurationResponse = {
  data?: DashboardConfigurationDto | null;
};

export const initialConfiguration: DashboardConfigurationDto = {
  countdownTarget: "",
  countdownActive: true,
};

export type InnovationIndexDto = {
  id: string;
  year: number;
  score: number;
  predicate: string | null;
};

export type InnovationIndexFormValues = {
  year: string;
  score: string;
  predicate: string;
};

export type InnovationIndexListResponse = {
  data?: InnovationIndexDto[];
  total?: number;
  message?: string;
};

export const ITEMS_PER_PAGE = 10;

export const predicateOptions = [
  "Sangat Inovatif",
  "Inovatif",
  "Kurang Inovatif",
  "Tidak Dapat Dinilai",
];

export const columnFormats: DefaultColumnFormat<InnovationIndexDto>[] = [
  {
    key: "year",
    title: "Tahun",
    textClassName: "font-semibold text-slate-900!",
  },
  {
    key: "score",
    title: "Nilai Indeks",
    formatter: (value) =>
      new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value || 0)),
  },
  {
    key: "predicate",
    title: "Predikat",
    formatter: (value) => String(value || "-"),
  },
];

type HeaderToolbarProps = {
  onAdd: () => void;
};

export const headerToolbar = (props: HeaderToolbarProps) => (
  <div className="space-y-4">
    <div>
      <h2 className="font-bold text-neutral-900">
        Nilai Indeks Inovasi Daerah
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Nilai Indeks Inovasi Daerah Kabupaten Karimun dari Kemendagri per
        tahun. Data ini ditampilkan sebagai grafik di dashboard.
      </p>
    </div>
    <TableToolbar addLabel="Tambah Nilai Indeks" {...props} />
  </div>
);

type RenderActionsProps = {
  row: InnovationIndexDto;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onEdit: (index: InnovationIndexDto) => void;
  onDelete: (id: string) => void | Promise<void>;
};

export const renderActions = ({
  row,
  deleteId,
  setDeleteId,
  onEdit,
  onDelete,
}: RenderActionsProps) => (
  <TableActions>
    <ActionButton
      label="Edit"
      icon={SquarePen}
      tone="yellow"
      onClick={() => onEdit(row)}
    />
    <DeleteAction
      open={deleteId === row.id}
      onOpenChange={(open) => setDeleteId(open ? row.id : null)}
      onConfirm={() => onDelete(row.id)}
    />
  </TableActions>
);
