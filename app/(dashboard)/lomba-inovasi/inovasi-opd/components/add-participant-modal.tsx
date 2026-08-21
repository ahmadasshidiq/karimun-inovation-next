"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

type InnovationOption = { id: string; name: string; stage: string; governmentAffair: string; implementationDate: string; status: string };

export default function AddParticipantModal({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; onSuccess: () => void }) {
  const [items, setItems] = useState<InnovationOption[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/competitions/available-innovations")
      .then((response) => response.json())
      .then((result) => setItems(result.data || []));
  }, [open]);

  const register = async () => {
    if (!selectedId) return;
    setLoading(true);
    const response = await fetch("/api/competitions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ innovationId: selectedId }) });
    const result = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) return toast.add({ title: "Pendaftaran gagal", description: result.message || "Silakan coba kembali.", type: "error" });
    toast.add({ title: "Inovasi didaftarkan", description: result.message, type: "success" });
    onOpenChange(false);
    setSelectedId("");
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto bg-white p-6 text-slate-900">
        <DialogHeader><DialogTitle>Pilih Inovasi Milik OPD</DialogTitle><DialogDescription>Data dasar dan dokumen existing akan ditarik otomatis. Pilih satu inovasi untuk didaftarkan sebagai Draft Lomba.</DialogDescription></DialogHeader>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs"><thead className="bg-slate-50 text-[#124579]"><tr><th className="p-3">Pilih</th><th className="p-3">Nama Inovasi</th><th className="p-3">Tahapan</th><th className="p-3">Urusan</th><th className="p-3">Penerapan</th><th className="p-3">Status Data</th></tr></thead>
          <tbody>{items.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="p-3"><input type="radio" name="innovation" checked={selectedId === item.id} onChange={() => setSelectedId(item.id)} /></td><td className="p-3 font-semibold">{item.name}</td><td className="p-3">{item.stage}</td><td className="p-3">{item.governmentAffair}</td><td className="p-3">{item.implementationDate}</td><td className="p-3">{item.status}</td></tr>)}</tbody></table>
          {!items.length ? <p className="p-8 text-center text-slate-500">Tidak ada inovasi OPD yang dapat didaftarkan.</p> : null}
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button><Button disabled={!selectedId || loading} onClick={register} className="bg-[#124579] text-white">{loading ? <Loader2 className="size-4 animate-spin" /> : null} Daftarkan ke Lomba</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
