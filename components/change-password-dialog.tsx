"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Eye, EyeOff } from "lucide-react";

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
import { getPasswordRules } from "@/lib/password";
import { parseApiResponse } from "@/lib/helper/response-api";

type ChangePasswordDialogProps = {
  open: boolean;
  onClose: () => void;
};

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

const fields: { key: PasswordField; label: string; placeholder: string }[] = [
  {
    key: "currentPassword",
    label: "Password Lama",
    placeholder: "Masukkan password saat ini",
  },
  {
    key: "newPassword",
    label: "Password Baru",
    placeholder: "Masukkan password baru",
  },
  {
    key: "confirmPassword",
    label: "Konfirmasi Password Baru",
    placeholder: "Ulangi password baru",
  },
];

export function ChangePasswordDialog({
  open,
  onClose,
}: ChangePasswordDialogProps) {
  const [form, setForm] = useState<Record<PasswordField, string>>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [saving, setSaving] = useState(false);

  const rules = getPasswordRules(form.newPassword);
  const passwordValid = rules.every((rule) => rule.valid);
  const confirmationMatch =
    Boolean(form.confirmPassword) && form.newPassword === form.confirmPassword;
  const canSubmit =
    Boolean(form.currentPassword) && passwordValid && confirmationMatch;

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/session/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await parseApiResponse(response, "Gagal mengubah password");
      toast.add({ type: "success", title: "Password berhasil diubah" });
      onClose();
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error instanceof Error ? error.message : "Gagal mengubah password",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-lg">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-lg font-bold">
            Ganti Password
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Masukkan password lama, lalu buat password baru untuk akun Anda.
          </DialogDescription>
        </DialogHeader>

        <form
          className="max-h-[calc(90vh-190px)] space-y-4 overflow-y-auto px-6 py-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSubmit && !saving) void handleSave();
          }}
        >
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="font-semibold text-slate-700">
                {field.label} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={visible[field.key] ? "text" : "password"}
                  value={form[field.key]}
                  autoComplete={
                    field.key === "currentPassword"
                      ? "current-password"
                      : "new-password"
                  }
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  className="h-11 border-slate-300 bg-white pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-slate-500 hover:bg-slate-100"
                  onClick={() =>
                    setVisible((current) => ({
                      ...current,
                      [field.key]: !current[field.key],
                    }))
                  }
                >
                  {visible[field.key] ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                  <span className="sr-only">
                    {visible[field.key]
                      ? "Sembunyikan password"
                      : "Tampilkan password"}
                  </span>
                </Button>
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800">Syarat password</p>
            <div className="mt-2 grid gap-x-8 gap-y-2 text-xs sm:grid-cols-2">
              {rules.map((rule) => (
                <span
                  key={rule.label}
                  className={`flex items-center gap-2 font-medium transition-colors ${
                    rule.valid ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {rule.valid ? (
                    <CheckCircle2 className="size-4 shrink-0" />
                  ) : (
                    <Circle className="size-4 shrink-0" />
                  )}
                  {rule.label}
                </span>
              ))}
            </div>
            {form.confirmPassword ? (
              <p
                className={`mt-3 flex items-center gap-2 text-xs font-semibold ${
                  confirmationMatch ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {confirmationMatch ? (
                  <CheckCircle2 className="size-4 shrink-0" />
                ) : (
                  <Circle className="size-4 shrink-0" />
                )}
                {confirmationMatch
                  ? "Konfirmasi password sesuai"
                  : "Konfirmasi password belum sama"}
              </p>
            ) : null}
          </div>
          <button type="submit" hidden />
        </form>

        <DialogFooter className="border-t border-slate-200 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-10 border-blue-500 px-6 font-semibold text-blue-600 hover:bg-blue-50"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={saving || !canSubmit}
            onClick={() => void handleSave()}
            className="h-10 bg-[#2362ee] px-6 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Menyimpan..." : "Simpan Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
