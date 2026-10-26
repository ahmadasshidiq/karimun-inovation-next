"use client";

import { memo, type ReactNode } from "react";
import { BarChart3, LineChart as LineChartIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatScore,
  type InnovationIndexPoint,
  type InnovationYearPoint,
} from "../page.config";

const SERIES_COLOR = "#146be8";
const GRID_COLOR = "#e5e7eb";
const SURFACE_COLOR = "#ffffff";
const AXIS_TICK = { fill: "#64748b", fontSize: 11 };

function ChartPanel({
  title,
  icon: Icon,
  headline,
  children,
}: {
  title: string;
  icon: typeof BarChart3;
  headline?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="size-5" />
          {title}
        </h2>
        {headline}
      </div>
      <div className="h-64 min-w-0 w-full">{children}</div>
    </section>
  );
}

function ChartTooltip({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-slate-900">{title}</p>
      {rows.map((row) => (
        <p key={row.label} className="flex items-center gap-2 text-slate-600">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: SERIES_COLOR }}
          />
          {row.label}:{" "}
          <span className="font-semibold text-slate-900">{row.value}</span>
        </p>
      ))}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex size-full items-center justify-center rounded-lg bg-slate-50 px-6 text-center text-xs text-slate-500">
      {message}
    </div>
  );
}

export const InnovationIndexChart = memo(function InnovationIndexChart({
  data,
}: {
  data: InnovationIndexPoint[];
}) {
  const latest = data.at(-1);

  return (
    <ChartPanel
      title="Indeks Inovasi Daerah Kabupaten Karimun"
      icon={LineChartIcon}
      headline={
        latest ? (
          <p className="text-right text-xs text-slate-500">
            {latest.year}:{" "}
            <span className="text-base font-bold text-slate-900">
              {formatScore(latest.score)}
            </span>
            {latest.predicate ? ` · ${latest.predicate}` : ""}
          </p>
        ) : null
      }
    >
      {data.length === 0 ? (
        <EmptyChart message="Belum ada nilai indeks dari Kemendagri. Tambahkan di Pengaturan > Konfigurasi Dashboard." />
      ) : (
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 480, height: 256 }}
        >
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="year"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: GRID_COLOR }}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={40}
              domain={[0, "auto"]}
            />
            <Tooltip
              cursor={{ stroke: "#94a3b8", strokeWidth: 1 }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as
                  | InnovationIndexPoint
                  | undefined;
                if (!active || !point) return null;
                return (
                  <ChartTooltip
                    title={`Tahun ${point.year}`}
                    rows={[
                      { label: "Nilai indeks", value: formatScore(point.score) },
                      ...(point.predicate
                        ? [{ label: "Predikat", value: point.predicate }]
                        : []),
                    ]}
                  />
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={SERIES_COLOR}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={{ r: 4, fill: SERIES_COLOR, stroke: SURFACE_COLOR, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: SERIES_COLOR, stroke: SURFACE_COLOR, strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartPanel>
  );
});

export const InnovationYearChart = memo(function InnovationYearChart({
  data,
}: {
  data: InnovationYearPoint[];
}) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <ChartPanel
      title="Jumlah Inovasi Kabupaten Karimun per Tahun"
      icon={BarChart3}
      headline={
        data.length > 0 ? (
          <p className="text-right text-xs text-slate-500">
            Total:{" "}
            <span className="text-base font-bold text-slate-900">{total}</span>{" "}
            inovasi
          </p>
        ) : null
      }
    >
      {data.length === 0 ? (
        <EmptyChart message="Belum ada data inovasi." />
      ) : (
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 480, height: 256 }}
        >
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="year"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: GRID_COLOR }}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={40}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "#f1f5f9" }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as
                  | InnovationYearPoint
                  | undefined;
                if (!active || !point) return null;
                return (
                  <ChartTooltip
                    title={`Tahun ${point.year}`}
                    rows={[{ label: "Jumlah inovasi", value: String(point.total) }]}
                  />
                );
              }}
            />
            <Bar
              dataKey="total"
              fill={SERIES_COLOR}
              maxBarSize={24}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartPanel>
  );
});
