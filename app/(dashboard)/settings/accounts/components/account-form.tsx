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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  UserDto,
  UserFormValues,
  UserOptionDto,
  UserStatus,
} from "../page.config";

export default function AccountForm({
  open,
  initialData,
  roles,
  institutions,
  saving,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initialData?: UserDto;
  roles: UserOptionDto[];
  institutions: UserOptionDto[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
}) {
  const [form, setForm] = useState<UserFormValues>({
    username: initialData?.username || "",
    email: initialData?.email || "",
    fullname: initialData?.fullname || "",
    nip: initialData?.nip || "",
    phone: initialData?.phone || "",
    status: initialData?.status || "ACTIVE",
    roleId: initialData?.roleId || "",
    institutionId: initialData?.institutionId || "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassword, setChangePassword] = useState(!initialData);
  const setField = <K extends keyof UserFormValues>(
    key: K,
    value: UserFormValues[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const passwordValid =
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[a-z]/.test(form.password) &&
    /\d/.test(form.password) &&
    /[^A-Za-z0-9]/.test(form.password);
  const passwordRules = [
    { label: "Minimal 8 karakter", valid: form.password.length >= 8 },
    { label: "Minimal 1 huruf besar", valid: /[A-Z]/.test(form.password) },
    { label: "Minimal 1 huruf kecil", valid: /[a-z]/.test(form.password) },
    { label: "Minimal 1 angka", valid: /\d/.test(form.password) },
    {
      label: "Minimal 1 karakter khusus",
      valid: /[^A-Za-z0-9]/.test(form.password),
    },
  ];
  const passwordComplete =
    !changePassword || (passwordValid && form.password === confirmPassword);
  const requiredComplete =
    form.username.trim() &&
    form.fullname.trim() &&
    form.roleId &&
    form.institutionId &&
    passwordComplete;

  const cancelPasswordChange = () => {
    setChangePassword(false);
    setField("password", "");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmation(false);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-hidden bg-white p-0 text-slate-900 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 sm:max-w-3xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            {initialData ? "Edit Akun" : "Tambah Akun"}
          </DialogTitle>
          <DialogDescription>
            Lengkapi identitas, role, instansi, dan kredensial akun.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nama Lengkap" required>
              <Input
                value={form.fullname}
                onChange={(event) => setField("fullname", event.target.value)}
                placeholder="Masukkan nama lengkap"
                className="h-10 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Username" required>
              <Input
                value={form.username}
                onChange={(event) => setField("username", event.target.value)}
                placeholder="Masukkan username"
                className="h-10 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="nama@contoh.id"
                className="h-10 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="NIP">
              <Input
                value={form.nip}
                onChange={(event) => setField("nip", event.target.value)}
                placeholder="Masukkan NIP"
                className="h-10 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Nomor Telepon">
              <Input
                value={form.phone}
                onChange={(event) => setField("phone", event.target.value)}
                placeholder="08xxxxxxxxxx"
                className="h-10 border-slate-300 bg-white"
              />
            </FormField>
            <FormField label="Role" required>
              <Select
                value={form.roleId}
                onValueChange={(value) => setField("roleId", value || "")}
              >
                <SelectTrigger className="h-10! w-full border-slate-300 bg-white px-3">
                  <SelectValue>
                    {roles.find((role) => role.id === form.roleId)?.name ||
                      "Pilih role"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Instansi" required>
              <Select
                value={form.institutionId}
                onValueChange={(value) =>
                  setField("institutionId", value || "")
                }
              >
                <SelectTrigger className="h-10! w-full border-slate-300 bg-white px-3">
                  <SelectValue>
                    {institutions.find(
                      (institution) => institution.id === form.institutionId,
                    )?.name || "Pilih instansi"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900">
                  {institutions.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Status" required>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setField("status", value as UserStatus)
                }
              >
                <SelectTrigger className="h-10! w-full border-slate-300 bg-white px-3">
                  <SelectValue>
                    {form.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900">
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {initialData ? "Ganti Password" : "Password Akun"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {initialData
                    ? "Aktifkan jika password akun perlu diperbarui."
                    : "Buat password yang aman untuk akun baru."}
                </p>
              </div>
              {initialData ? (
                <Button
                  type="button"
                  variant={changePassword ? "outline" : "default"}
                  className={
                    changePassword
                      ? "h-9 border-slate-300 bg-white px-4 font-semibold text-slate-700 hover:bg-slate-100"
                      : "h-9 bg-slate-900 px-4 font-semibold text-white hover:bg-slate-800"
                  }
                  onClick={() =>
                    changePassword
                      ? cancelPasswordChange()
                      : setChangePassword(true)
                  }
                >
                  {changePassword ? "Batalkan" : "Aktifkan"}
                </Button>
              ) : null}
            </div>

            {changePassword ? (
              <div className="space-y-4 border-t border-slate-200 bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Password Baru" required>
                    <PasswordInput
                      value={form.password}
                      visible={showPassword}
                      placeholder="Password baru"
                      onChange={(value) => setField("password", value)}
                      onToggle={() => setShowPassword((visible) => !visible)}
                    />
                  </FormField>
                  <FormField label="Konfirmasi Password Baru" required>
                    <PasswordInput
                      value={confirmPassword}
                      visible={showConfirmation}
                      placeholder="Ulangi password baru"
                      onChange={setConfirmPassword}
                      onToggle={() =>
                        setShowConfirmation((visible) => !visible)
                      }
                    />
                  </FormField>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-800">
                    Syarat password
                  </p>
                  <div className="mt-2 grid gap-x-8 gap-y-2 text-xs sm:grid-cols-2">
                    {passwordRules.map((rule) => (
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
                  {confirmPassword ? (
                    form.password === confirmPassword ? (
                      <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="size-4" />
                        Konfirmasi password sudah sesuai.
                      </p>
                    ) : (
                      <p className="mt-3 text-xs font-medium text-red-500">
                        Konfirmasi password belum sama.
                      </p>
                    )
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        
        <DialogFooter className="border-t border-slate-200 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 rounded-md border-[#2362ee] bg-white px-5 text-xs font-semibold text-[#2362ee] hover:bg-blue-50 hover:text-blue-700"
          >
            Batal
          </Button>
          <Button
            className="h-9 bg-blue-600 px-5 text-white hover:bg-blue-700"
            disabled={saving || !requiredComplete}
            onClick={() => void onSubmit(form)}
          >
            {saving ? "Menyimpan..." : "Simpan Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

function PasswordInput({
  value,
  visible,
  placeholder,
  onChange,
  onToggle,
}: {
  value: string;
  visible: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 border-slate-300 bg-white pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-slate-500 hover:bg-slate-100"
        onClick={onToggle}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        <span className="sr-only">
          {visible ? "Sembunyikan password" : "Tampilkan password"}
        </span>
      </Button>
    </div>
  );
}
