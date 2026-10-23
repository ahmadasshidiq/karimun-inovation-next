"use client";

import type { ReactNode } from "react";
import {
  Download,
  Filter,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TableToolbarProps = {
  addLabel?: string;
  onAdd?: () => void;
  onToggleFilter?: () => void;
  activeFilterCount?: number;
  onExport?: () => void;
};

export function TableToolbar({
  addLabel,
  onAdd,
  onToggleFilter,
  activeFilterCount = 0,
  onExport,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {onAdd ? (
        <Button
          type="button"
          onClick={onAdd}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[#2362ee] px-4 text-xs font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="size-4" />
          {addLabel}
        </Button>
      ) : (
        <span />
      )}
      <div className="flex flex-wrap gap-2">
        {onToggleFilter ? (
          <Button
            type="button"
            variant="outline"
            onClick={onToggleFilter}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-300! bg-white! px-4 text-xs font-semibold text-neutral-800! hover:bg-neutral-100! hover:text-neutral-900!"
          >
            <Filter className="size-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-[#ffb437] px-1.5 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        ) : null}
        {onExport ? (
          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-500! bg-white! px-4 text-xs font-semibold text-emerald-600! hover:bg-emerald-50! hover:text-emerald-700!"
          >
            <Download className="size-4" />
            Export Excel
          </Button>
        ) : null}
      </div>
    </div>
  );
}

type FilterPanelProps = {
  title: string;
  onApply: () => void;
  onReset: () => void;
  children: ReactNode;
  className?: string;
};

export function FilterPanel({
  title,
  onApply,
  onReset,
  children,
  className,
}: FilterPanelProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
      className="rounded-xl border border-neutral-200 bg-[#fafbfc] p-5"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-neutral-900">{title}</h2>
        <Button
          type="button"
          variant="link"
          onClick={onReset}
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Reset Filter
        </Button>
      </div>
      <div
        className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}
      >
        {children}
      </div>
      <div className="mt-5 flex justify-end">
        <Button
          type="submit"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[#2362ee] px-4 text-xs font-semibold text-white hover:bg-blue-700"
        >
          <Search className="size-4" />
          Terapkan Filter
        </Button>
      </div>
    </form>
  );
}

type FilterFieldProps = {
  label: string;
  children: ReactNode;
};

export function FilterField({ label, children }: FilterFieldProps) {
  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-slate-600">
        {label}
      </span>
      {children}
    </div>
  );
}

type FilterSearchProps = {
  label?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export function FilterSearch({
  label = "Pencarian",
  value,
  placeholder,
  onChange,
}: FilterSearchProps) {
  return (
    <FilterField label={label}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-11 border-neutral-300 bg-white pl-9 text-xs text-neutral-900 placeholder:text-slate-400"
        />
      </div>
    </FilterField>
  );
}

export type FilterOption = { value: string; label: string };

type FilterSelectProps = {
  label: string;
  value: string;
  allLabel: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

export function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: FilterSelectProps) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? allLabel;

  return (
    <FilterField label={label}>
      <Select
        value={value}
        onValueChange={(nextValue) => nextValue && onChange(nextValue)}
      >
        <SelectTrigger className="h-11! w-full rounded-lg border-neutral-300 bg-white px-3 text-xs text-neutral-900">
          <SelectValue>{value === "all" ? allLabel : selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white text-neutral-900">
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterField>
  );
}

export function TableActions({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delay={250}>
      <div className="flex justify-end gap-2">{children}</div>
    </TooltipProvider>
  );
}

const actionToneClass = {
  blue: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
  yellow: "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700",
  green: "text-green-600 hover:bg-green-50 hover:text-green-700",
  indigo: "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700",
  red: "text-red-500 hover:bg-red-50 hover:text-red-600",
} as const;

type ActionButtonProps = {
  label: string;
  icon: LucideIcon;
  tone: keyof typeof actionToneClass;
  onClick?: () => void;
};

export function ActionButton({
  label,
  icon: Icon,
  tone,
  onClick,
}: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={onClick}
            className={cn("rounded-lg", actionToneClass[tone])}
          >
            <Icon className="size-4" />
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

type ConfirmActionProps = {
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  confirmLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmAction({
  label,
  icon: Icon,
  title,
  description,
  confirmLabel,
  open,
  onOpenChange,
  onConfirm,
}: ConfirmActionProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={label}
                  className={cn("rounded-lg", actionToneClass.red)}
                >
                  <Icon className="size-4" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[24rem] gap-0 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl sm:p-4"
      >
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <TriangleAlert className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-6">{title}</p>
            <p className="mt-1 text-[13px] text-slate-500">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-lg px-5 text-[13px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => void onConfirm()}
            className="h-10 rounded-lg bg-red-600 px-5 text-[13px] font-semibold text-white hover:bg-red-700"
          >
            {confirmLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type DeleteActionProps = Pick<
  ConfirmActionProps,
  "open" | "onOpenChange" | "onConfirm"
> & {
  description?: string;
};

export function DeleteAction({
  description = "Data yang dihapus tidak dapat dikembalikan.",
  ...props
}: DeleteActionProps) {
  return (
    <ConfirmAction
      label="Hapus"
      icon={Trash2}
      title="Yakin ingin menghapus data ini?"
      description={description}
      confirmLabel="Hapus"
      {...props}
    />
  );
}

export type ActionMenuItem = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  hint?: string;
};

type ActionMenuProps = {
  label: string;
  icon: LucideIcon;
  tone: keyof typeof actionToneClass;
  items: ActionMenuItem[];
};

export function ActionMenu({
  label,
  icon: Icon,
  tone,
  items,
}: ActionMenuProps) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={label}
                  className={cn("rounded-lg", actionToneClass[tone])}
                >
                  <Icon className="size-4" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 bg-white p-1.5 text-slate-900"
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            disabled={item.disabled}
            onClick={item.onClick}
            className="cursor-pointer items-start gap-2.5 px-2.5 py-2"
          >
            <item.icon className="mt-0.5 size-4 text-slate-500" />
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold">
                {item.label}
              </span>
              {item.hint ? (
                <span className="block text-xs text-slate-500">
                  {item.hint}
                </span>
              ) : null}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
