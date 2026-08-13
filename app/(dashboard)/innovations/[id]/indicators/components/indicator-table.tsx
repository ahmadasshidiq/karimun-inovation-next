"use client";

import { FileUp } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { IndicatorDto } from "../page.config";

type Props = {
  items: IndicatorDto[];
  selections: Record<number, string>;
  files: Record<number, File | undefined>;
  onSelect: (id: number, value: string) => void;
  onFile: (id: number, file?: File) => void;
};

export default function IndicatorTable({
  items,
  selections,
  files,
  onSelect,
  onFile,
}: Props) {
  return (
    <div className="w-full overflow-x-auto" dir="ltr">
      <table className="w-full min-w-[1400px] table-fixed text-left text-xs text-slate-700 xl:min-w-full">
        <colgroup>
          <col className="w-[5%]" />
          <col className="w-[13%]" />
          <col className="w-[18%]" />
          <col className="w-[16%]" />
          <col className="w-[7%]" />
          <col className="w-[15%]" />
          <col className="w-[19%]" />
          <col className="w-[7%]" />
        </colgroup>
        <thead>
          <tr className="border-b-2 border-slate-200">
            {["No.", "Indikator", "Keterangan", "Informasi", "Bobot", "Parameter", "Data Pendukung", "Jenis"].map((title) => (
              <th key={title} className="px-3 py-5 text-[12px] font-semibold text-slate-700">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-200 align-top hover:bg-slate-50/70">
              <td className="px-3 py-6">{item.id}</td>
              <td className="px-3 py-6 font-semibold leading-5">{item.indicator}</td>
              <td className="px-3 py-6 leading-5">{item.description}</td>
              <td className="px-3 py-6 leading-5">{item.information}</td>
              <td className="px-3 py-6 font-semibold text-blue-600">{item.weight.toFixed(2)}</td>
              <td className="px-3 py-6">
                <Select
                  value={selections[item.id] || ""}
                  onValueChange={(value) => value && onSelect(item.id, value)}
                >
                  <SelectTrigger className="h-10! w-full bg-white text-xs">
                    <SelectValue placeholder="Pilih parameter" />
                  </SelectTrigger>
                  <SelectContent className="max-w-80 bg-white text-slate-900">
                    {item.parameters.map((parameter) => (
                      <SelectItem key={parameter} value={parameter}>
                        {parameter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-3 py-6">
                <p className="leading-5 text-slate-600">{item.supportingData}</p>
                <Label
                  htmlFor={`indicator-file-${item.id}`}
                  className="mt-3 inline-flex h-8 max-w-full cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 font-semibold text-blue-600 hover:bg-blue-100"
                >
                  <FileUp className="size-3.5 shrink-0" />
                  <span className="truncate">{files[item.id]?.name || "Upload"}</span>
                </Label>
                <Input
                  id={`indicator-file-${item.id}`}
                  type="file"
                  className="sr-only"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => onFile(item.id, event.currentTarget.files?.[0])}
                />
              </td>
              <td className="px-3 py-6">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600">
                  {item.fileTypes}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
