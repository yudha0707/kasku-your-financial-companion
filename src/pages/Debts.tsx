import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, HandCoins } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, LoadingButton } from "@/components/shared/States";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { MoneyInput } from "@/components/shared/Pickers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { debtStatus, debtStatusLabel } from "@/utils/finance";
import { formatRupiah } from "@/utils/currency";
import { formatDateLong, todayISO } from "@/utils/date";
import type { Debt, DebtKind } from "@/types";
import { cn } from "@/lib/utils";

const badge = { unpaid: "bg-info/15 text-info", overdue: "bg-expense/15 text-expense", paid: "bg-income/15 text-income" };

export default function Debts() {
  const { debts, saveDebt, deleteDebt } = useApp();
  const [kind, setKind] = useState<DebtKind>("debt");
  const [edit, setEdit] = useState<Debt | "new" | null>(null);
  const [del, setDel] = useState<Debt | null>(null);
  const [form, setForm] = useState({ person: "", amount: 0, paid: 0, dueDate: todayISO(), note: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const list = debts.filter((d) => d.kind === kind);
  const outstanding = list.reduce((s, d) => s + Math.max(0, d.amount - d.paid), 0);
  const open = (d: Debt | "new") => { setErr(""); setEdit(d); setForm(d === "new" ? { person: "", amount: 0, paid: 0, dueDate: todayISO(), note: "" } : { person: d.person, amount: d.amount, paid: d.paid, dueDate: d.dueDate, note: d.note ?? "" }); };

  return (
    <div className="space-y-5">
      <PageHeader title="Utang & Piutang" actions={<Button onClick={() => open("new")}><Plus /> Tambah</Button>} />
      <Tabs value={kind} onValueChange={(v) => setKind(v as DebtKind)}>
        <TabsList className="grid w-full max-w-xs grid-cols-2"><TabsTrigger value="debt">Utang</TabsTrigger><TabsTrigger value="receivable">Piutang</TabsTrigger></TabsList>
      </Tabs>
      <div className="surface p-5">
        <p className="text-sm text-muted-foreground">{kind === "debt" ? "Sisa utang" : "Sisa piutang"}</p>
        <p className={cn("text-2xl font-bold tabular-nums", kind === "debt" ? "text-expense" : "text-income")}>{formatRupiah(outstanding)}</p>
      </div>
      {list.length === 0 ? <EmptyState icon={HandCoins} title="Belum ada data" description="Catat utang atau piutang agar tidak lupa." /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((d) => {
            const s = debtStatus(d);
            const pct = Math.min(100, Math.round((d.paid / d.amount) * 100));
            return (
              <article key={d.id} className="surface space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><h3 className="truncate font-semibold">{d.person}</h3><p className="text-xs text-muted-foreground">Jatuh tempo {formatDateLong(d.dueDate)}</p></div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", badge[s])}>{debtStatusLabel[s]}</span>
                </div>
                <p className="text-xl font-bold tabular-nums">{formatRupiah(d.amount)}</p>
                <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
                <p className="text-xs text-muted-foreground">Dibayar {formatRupiah(d.paid)} ({pct}%){d.note ? ` · ${d.note}` : ""}</p>
                <div className="flex gap-1">
                  {s !== "paid" && <Button size="sm" variant="outline" onClick={() => void saveDebt({ ...d, paid: d.amount }, d.id)}><CheckCircle2 /> Tandai Lunas</Button>}
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => open(d)}><Pencil /></Button>
                  <Button size="icon" variant="ghost" aria-label="Hapus" onClick={() => setDel(d)}><Trash2 /></Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{edit === "new" ? "Tambah" : "Edit"} {kind === "debt" ? "Utang" : "Piutang"}</DialogTitle><DialogDescription>Isi detail di bawah</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!form.person.trim() || form.amount <= 0) return setErr("Nama dan nominal wajib diisi");
            setSaving(true);
            try { await saveDebt({ ...form, kind, note: form.note || undefined }, edit && edit !== "new" ? edit.id : undefined); setEdit(null); } finally { setSaving(false); }
          }}>
            <div className="space-y-1.5"><Label htmlFor="dp">Nama</Label><Input id="dp" value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label htmlFor="da">Nominal</Label><MoneyInput id="da" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} /></div>
              <div className="space-y-1.5"><Label htmlFor="dpd">Sudah dibayar</Label><MoneyInput id="dpd" value={form.paid} onChange={(v) => setForm({ ...form, paid: v })} /></div>
            </div>
            <div className="space-y-1.5"><Label htmlFor="dd">Jatuh tempo</Label><Input id="dd" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="dn">Catatan</Label><Input id="dn" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
            {err && <p className="text-xs text-destructive">{err}</p>}
            <LoadingButton type="submit" className="w-full" loading={saving}>Simpan</LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} title="Hapus data?" description="Data ini akan dihapus permanen." onConfirm={async () => { if (del) await deleteDebt(del.id); }} />
    </div>
  );
}
