"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download, ShieldCheck, ShieldOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { formatDateId } from "@/lib/helper/date";
import { parseApiResponse } from "@/lib/helper/response-api";

type MfaSettingsDialogProps = {
  open: boolean;
  onClose: () => void;
};

type MfaStatus = {
  enabled: boolean;
  enabledAt: string | null;
  recoveryCodesRemaining: number;
};

type MfaSetup = {
  secret: string;
  otpauthUrl: string;
  qrSvg: string;
};

type Step = "loading" | "status" | "password" | "scan" | "recovery" | "disable";

const inputClassName = "h-11 border-slate-300 bg-white";

export function MfaSettingsDialog({ open, onClose }: MfaSettingsDialogProps) {
  const [step, setStep] = useState<Step>("loading");
  const [status, setStatus] = useState<MfaStatus>();
  const [setup, setSetup] = useState<MfaSetup>();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/session/mfa", { cache: "no-store" });
      const payload = await parseApiResponse<{ data: MfaStatus }>(
        response,
        "Gagal mengambil status autentikasi dua langkah",
      );
      setStatus(payload.data);
      setStep("status");
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error
            ? error.message
            : "Gagal mengambil status autentikasi dua langkah",
      });
      setStep("status");
    }
  }, []);

  useEffect(() => {
    // Status diambil sekali saat dialog dibuka.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchStatus();
  }, [fetchStatus]);

  const handleClose = () => {
    if (saving) return;
    if (step === "recovery") {
      toast.add({
        type: "success",
        title: "Autentikasi dua langkah berhasil diaktifkan",
      });
    }
    onClose();
  };

  const runAction = async (action: () => Promise<void>, fallback: string) => {
    try {
      setSaving(true);
      await action();
    } catch (error) {
      toast.add({
        type: "error",
        title: error instanceof Error ? error.message : fallback,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStartSetup = () =>
    runAction(async () => {
      const response = await fetch("/api/session/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await parseApiResponse<{ data: MfaSetup }>(
        response,
        "Gagal memulai pengaturan autentikasi dua langkah",
      );
      setSetup(payload.data);
      setPassword("");
      setCode("");
      setStep("scan");
    }, "Gagal memulai pengaturan autentikasi dua langkah");

  const handleConfirmSetup = () =>
    runAction(async () => {
      const response = await fetch("/api/session/mfa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const payload = await parseApiResponse<{
        data: { recoveryCodes: string[] };
      }>(response, "Gagal mengaktifkan autentikasi dua langkah");
      setRecoveryCodes(payload.data.recoveryCodes);
      setSetup(undefined);
      setCode("");
      setStep("recovery");
    }, "Gagal mengaktifkan autentikasi dua langkah");

  const handleDisable = () =>
    runAction(async () => {
      const response = await fetch("/api/session/mfa", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
      });
      await parseApiResponse(
        response,
        "Gagal menonaktifkan autentikasi dua langkah",
      );
      toast.add({
        type: "success",
        title: "Autentikasi dua langkah berhasil dinonaktifkan",
      });
      onClose();
    }, "Gagal menonaktifkan autentikasi dua langkah");

  const handleCopyCodes = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join("\n"));
      toast.add({ type: "success", title: "Kode pemulihan berhasil disalin" });
    } catch {
      toast.add({ type: "error", title: "Gagal menyalin kode pemulihan" });
    }
  };

  const handleDownloadCodes = () => {
    const blob = new Blob(
      [
        `Kode Pemulihan - Inovasi Karimun\n\n${recoveryCodes.join("\n")}\n\nSetiap kode hanya dapat digunakan satu kali.\n`,
      ],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kode-pemulihan-2fa.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const description: Record<Step, string> = {
    loading: "Memuat status autentikasi dua langkah...",
    status: "Lindungi akun Anda dengan kode dari aplikasi autentikator.",
    password: "Masukkan password Anda untuk melanjutkan.",
    scan: "Pindai kode QR dengan Google Authenticator, Microsoft Authenticator, atau aplikasi sejenis.",
    recovery:
      "Simpan kode pemulihan berikut di tempat aman. Kode ini hanya ditampilkan sekali.",
    disable: "Masukkan password dan kode autentikasi untuk menonaktifkan 2FA.",
  };

  const renderBody = () => {
    if (step === "loading") {
      return <p className="text-sm text-slate-500">Memuat...</p>;
    }

    if (step === "status" && !status) {
      return (
        <p className="text-sm text-slate-500">
          Status autentikasi dua langkah tidak dapat dimuat.
        </p>
      );
    }

    if (step === "status" && status) {
      return (
        <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          {status.enabled ? (
            <ShieldCheck className="mt-0.5 size-6 shrink-0 text-emerald-600" />
          ) : (
            <ShieldOff className="mt-0.5 size-6 shrink-0 text-slate-400" />
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900">
                Autentikasi Dua Langkah
              </p>
              {status.enabled ? (
                <Badge className="bg-emerald-100 text-emerald-700">Aktif</Badge>
              ) : (
                <Badge className="bg-slate-200 text-slate-600">
                  Belum Aktif
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {status.enabled
                ? `Aktif sejak ${formatDateId(status.enabledAt)}. Sisa kode pemulihan: ${status.recoveryCodesRemaining}.`
                : "Setelah aktif, setiap login memerlukan kode 6 digit dari aplikasi autentikator."}
            </p>
          </div>
        </div>
      );
    }

    if (step === "password" || step === "disable") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan password Anda"
              className={inputClassName}
            />
          </div>
          {step === "disable" ? (
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">
                Kode Autentikasi atau Kode Pemulihan{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="000000"
                className={inputClassName}
              />
            </div>
          ) : null}
        </div>
      );
    }

    if (step === "scan" && setup) {
      return (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div
              className="size-[200px] rounded-lg bg-white p-2"
              dangerouslySetInnerHTML={{ __html: setup.qrSvg }}
            />
            <p className="text-center text-xs text-slate-500">
              Tidak bisa memindai? Masukkan kode berikut secara manual:
            </p>
            <code className="break-all rounded-md bg-white px-3 py-1.5 text-center text-sm font-semibold tracking-wider text-slate-800">
              {setup.secret}
            </code>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">
              Kode dari Aplikasi <span className="text-red-500">*</span>
            </Label>
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ""))
              }
              placeholder="000000"
              className={inputClassName}
            />
          </div>
        </div>
      );
    }

    if (step === "recovery") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {recoveryCodes.map((recoveryCode) => (
              <code
                key={recoveryCode}
                className="rounded-md bg-white px-3 py-2 text-center text-sm font-semibold tracking-wider text-slate-800"
              >
                {recoveryCode}
              </code>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleCopyCodes()}
              className="h-9 border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Copy className="size-4" />
              Salin
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadCodes}
              className="h-9 border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Download className="size-4" />
              Unduh
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderPrimaryAction = () => {
    const primaryClassName =
      "h-10 bg-[#2362ee] px-6 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300";

    if (step === "status" && status) {
      return status.enabled ? (
        <Button
          type="button"
          onClick={() => {
            setPassword("");
            setCode("");
            setStep("disable");
          }}
          className="h-10 bg-red-600 px-6 font-semibold text-white hover:bg-red-700"
        >
          Nonaktifkan 2FA
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => setStep("password")}
          className={primaryClassName}
        >
          Aktifkan 2FA
        </Button>
      );
    }

    if (step === "password") {
      return (
        <Button
          type="button"
          disabled={saving || !password}
          onClick={() => void handleStartSetup()}
          className={primaryClassName}
        >
          {saving ? "Memproses..." : "Lanjutkan"}
        </Button>
      );
    }

    if (step === "scan") {
      return (
        <Button
          type="button"
          disabled={saving || code.length !== 6}
          onClick={() => void handleConfirmSetup()}
          className={primaryClassName}
        >
          {saving ? "Memverifikasi..." : "Verifikasi & Aktifkan"}
        </Button>
      );
    }

    if (step === "disable") {
      return (
        <Button
          type="button"
          disabled={saving || !password || !code}
          onClick={() => void handleDisable()}
          className="h-10 bg-red-600 px-6 font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
        >
          {saving ? "Memproses..." : "Nonaktifkan"}
        </Button>
      );
    }

    if (step === "recovery") {
      return (
        <Button type="button" onClick={handleClose} className={primaryClassName}>
          Saya Sudah Menyimpan
        </Button>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-lg">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            Autentikasi Dua Langkah
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {description[step]}
          </DialogDescription>
        </DialogHeader>

        <form
          className="max-h-[calc(90vh-190px)] overflow-y-auto px-6 py-6"
          onSubmit={(event) => event.preventDefault()}
        >
          {renderBody()}
        </form>

        <DialogFooter className="border-t border-slate-200 px-6 py-4">
          {step !== "recovery" ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-10 border-blue-500 px-6 font-semibold text-blue-600 hover:bg-blue-50"
            >
              {step === "status" ? "Tutup" : "Batal"}
            </Button>
          ) : null}
          {renderPrimaryAction()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
