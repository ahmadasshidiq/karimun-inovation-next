"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type SearchSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SearchSelectProps = {
  options: SearchSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxVisibleOptions?: number;
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
  onDebouncedSearchChange?: (search: string) => void;
};

export default function SearchSelect({
  options,
  value,
  onValueChange,
  placeholder = "Pilih data",
  searchPlaceholder = "Cari data...",
  emptyMessage = "Data tidak ditemukan",
  maxVisibleOptions = 5,
  debounceMs = 500,
  disabled = false,
  className,
  onDebouncedSearchChange,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, debounceMs);

    return () => window.clearTimeout(timeout);
  }, [debounceMs, searchTerm]);

  useEffect(() => {
    onDebouncedSearchChange?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onDebouncedSearchChange]);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const visibleOptions = useMemo(() => {
    const normalizedSearch = debouncedSearchTerm.toLocaleLowerCase("id-ID");
    const filteredOptions = normalizedSearch
      ? options.filter((option) =>
          option.label.toLocaleLowerCase("id-ID").includes(normalizedSearch),
        )
      : options;

    return filteredOptions.slice(0, Math.max(1, maxVisibleOptions));
  }, [debouncedSearchTerm, maxVisibleOptions, options]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearchTerm("");
      setDebouncedSearchTerm("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-between rounded-lg border-neutral-300",
              "bg-white px-3 text-xs font-normal text-neutral-900",
              "hover:bg-neutral-50 dark:bg-white dark:hover:bg-neutral-50",
              className,
            )}
          />
        }
      >
        <span className="truncate">
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-(--anchor-width) min-w-56 gap-0 overflow-hidden rounded-lg border border-neutral-300 bg-white p-0 text-neutral-900 shadow-none ring-0"
      >
        <Command
          shouldFilter={false}
          className="rounded-none bg-white text-neutral-900"
        >
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder={searchPlaceholder}
            className="border-neutral-200"
          />
          <CommandList className="border-t border-neutral-200 py-1">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {visibleOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  data-checked={option.value === value}
                  onSelect={() => {
                    onValueChange(option.value);
                    handleOpenChange(false);
                  }}
                  className="mx-1 min-h-9 cursor-pointer rounded-md px-3 text-xs data-selected:bg-neutral-100"
                >
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
