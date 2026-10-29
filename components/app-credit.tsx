"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Kabupaten Karimun";
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
const APP_DEVELOPERS = (process.env.NEXT_PUBLIC_APP_DEVELOPERS || "")
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

type AppCreditProps = {
  className?: string;
  align?: "left" | "center";
};

export function AppCredit({ className, align = "left" }: AppCreditProps) {
  const [showDevelopers, setShowDevelopers] = useState(false);

  // Klik tiga kali pada teks versi untuk menampilkan tim pengembang.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 3) setShowDevelopers(true);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "w-full select-none text-[11px] text-neutral-500",
          align === "center" ? "text-center" : "text-left",
        )}
      >
        &copy;{new Date().getFullYear()} {APP_NAME} v{APP_VERSION}
      </button>

      <Dialog open={showDevelopers} onOpenChange={setShowDevelopers}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto bg-white p-8 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-md">
          <Image
            src="/images/logo-jti.png"
            alt="PT Jaxer Teknologi Indonesia"
            width={800}
            height={322}
            className="mx-auto h-auto w-64"
          />
          <div className="mt-4 text-center">
            <DialogTitle className="text-lg font-bold">
              Inovasi Daerah {APP_NAME}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-slate-700">
              {APP_NAME} dianalisa, dirancang, dan dibangun oleh
              PT Jaxer Teknologi Indonesia
            </DialogDescription>
          </div>
          {APP_DEVELOPERS.length ? (
            <div className="mt-4">
              <p className="text-base font-bold">Contributor:</p>
              <ul className="mt-1 space-y-0.5 text-sm text-slate-800">
                {APP_DEVELOPERS.map((name) => (
                  <li key={name}>- {name}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
