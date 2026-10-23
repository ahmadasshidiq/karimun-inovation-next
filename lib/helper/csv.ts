const escapeCsvCell = (value: unknown) =>
  `"${String(value ?? "").replaceAll('"', '""')}"`;

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: unknown[][],
) {
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
