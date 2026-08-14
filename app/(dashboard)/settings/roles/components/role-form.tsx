"use client";

import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MASTER_PERMISSIONS } from "@/lib/master-permission";

import type { RoleDto, RoleFormValues, RolePermission } from "../page.config";
import { normalizeRolePermissions } from "../page.config";

export default function RoleForm({
  open,
  initialData,
  saving,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initialData?: RoleDto;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void | Promise<void>;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [permissions, setPermissions] = useState<RolePermission[]>(
    normalizeRolePermissions(initialData?.permission || []),
  );

  const actionsOf = (model: string) =>
    permissions.find((permission) => permission.model === model)?.actions || [];
  const setModelActions = (model: string, actions: string[]) =>
    setPermissions((current) => [
      ...current.filter((permission) => permission.model !== model),
      ...(actions.length ? [{ model, actions }] : []),
    ]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-hidden bg-white p-0 [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:bg-slate-100 [&_[data-slot=dialog-close]]:hover:text-slate-900 sm:max-w-2xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            {initialData ? "Edit Role" : "Tambah Role"}
          </DialogTitle>
          <DialogDescription>Atur nama role dan akses untuk setiap modul.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] space-y-5 overflow-y-auto px-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="role-name" className="font-semibold text-slate-700">Nama Role</Label>
            <Input
              id="role-name"
              className="h-10 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              placeholder="Contoh: Admin OPD"
              value={name}
              disabled={initialData?.name === "Super Admin"}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-3">
            {MASTER_PERMISSIONS.map((permission) => {
              const selectedActions = actionsOf(permission.model);
              const allSelected = selectedActions.length === permission.actions.length;
              return (
                <section key={permission.model} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold capitalize text-slate-900">
                      {permission.model.replaceAll("-", " ")}
                    </h3>
                    <Label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                      <Checkbox
                        className="border-blue-400 bg-white text-white data-checked:border-blue-600 data-checked:bg-blue-600 data-checked:text-white dark:data-checked:bg-blue-600"
                        checked={allSelected}
                        onCheckedChange={(checked) =>
                          setModelActions(
                            permission.model,
                            checked ? [...permission.actions] : [],
                          )
                        }
                      />
                      Pilih Semua
                    </Label>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                    {permission.actions.map((action) => (
                      <Label key={action} className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                        <Checkbox
                          className="border-blue-400 bg-white text-white data-checked:border-blue-600 data-checked:bg-blue-600 data-checked:text-white dark:data-checked:bg-blue-600"
                          checked={selectedActions.includes(action)}
                          onCheckedChange={(checked) =>
                            setModelActions(
                              permission.model,
                              checked
                                ? [...selectedActions, action]
                                : selectedActions.filter((item) => item !== action),
                            )
                          }
                        />
                        {action}
                      </Label>
                    ))}
                  </div>
                </section>
              );
            })}
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
            disabled={saving || !name.trim()}
            onClick={() => void onSubmit({ name: name.trim(), permission: permissions })}
          >
            {saving ? "Menyimpan..." : "Simpan Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
