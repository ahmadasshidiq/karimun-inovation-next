"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FormSectionProps = {
  number?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function FormSection({
  number,
  title,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7",
        className,
      )}
    >
      <h2 className="mb-6 border-b border-neutral-200 pb-4 text-sm font-extrabold uppercase tracking-wide text-[#064c80]">
        {number ? `${number}. ` : ""}
        {title}
      </h2>
      {children}
    </section>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  wide?: boolean;
  children: ReactNode;
  className?: string;
};

export function Field({
  label,
  required = false,
  wide = false,
  children,
  className,
}: FieldProps) {
  return (
    <div
      className={cn("space-y-2", wide && "md:col-span-2", className)}
    >
      <Label className="text-[11px] font-bold uppercase tracking-wide text-neutral-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      {children}
    </div>
  );
}

type ChoiceCardsProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  columns?: string;
};

export function ChoiceCards({
  value,
  options,
  onChange,
  columns = "grid-cols-1",
}: ChoiceCardsProps) {
  return (
    <div className={cn("grid min-w-0 gap-2", columns)}>
      {options.map((option) => {
        const active = value === option;
        return (
          <Button
            key={option}
            type="button"
            variant="outline"
            onClick={() => onChange(option)}
            className={cn(
              "h-auto min-h-11 min-w-0 justify-between whitespace-normal px-3 py-2 text-left text-[10px] font-bold uppercase",
              active
                ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500 hover:border-blue-600 hover:bg-blue-100 hover:text-blue-800"
                : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700",
            )}
          >
            <span className="min-w-0 break-words">{option}</span>
            <span
              className={cn(
                "size-3.5 shrink-0 rounded-full border",
                active
                  ? "border-4 border-blue-500"
                  : "border-neutral-300",
              )}
            />
          </Button>
        );
      })}
    </div>
  );
}

type LongTextProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minimumWords?: number;
  placeholder?: string;
};

export function LongText({
  label,
  value,
  onChange,
  minimumWords = 300,
  placeholder = "Tuliskan di sini...",
}: LongTextProps) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const valid = words >= minimumWords;

  return (
    <Field label={label} required>
      <Textarea
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 field-sizing-fixed resize-y border-neutral-200 bg-neutral-50 text-neutral-900"
      />
      <div
        className={cn(
          "flex justify-between rounded-lg px-3 py-2 text-[10px] font-semibold",
          valid
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-600",
        )}
      >
        <span>Minimal {minimumWords} kata</span>
        <span>Jumlah kata: {words}</span>
      </div>
    </Field>
  );
}
