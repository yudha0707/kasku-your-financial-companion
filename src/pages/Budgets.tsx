import { useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle, PieChart } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, LoadingButton } from "@/components/shared/States";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { IconBadge } from "@/components/shared/IconBadge";
import { MoneyInput } from "@/components/shared/Pickers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { budgetUsage } from "@/utils/finance";
import { formatRupiah } from "@/utils/currency";
import { currentMonth, formatMonth } from "@/utils/date";
import type { Budget } from "@/types";
import { cn } from "@/lib/utils";

export default function Budgets() {
  const { budgets, categories, transactions, saveBudget, deleteBudget } = useApp();
  const month = currentMonth();
  const list = budgets.filter((b) => b.month === month);
  const [edit, setEdit] = useState<Budget | "new" | null>(null);
  const [del, setDel] = useState<Budget | null>(null);
  const [form, setForm] = useState({ categoryId: "", amount: 0 });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const total = list.reduce((s, b) => s + b.amount, 0);
  const spent = list.reduce((s, b) => s + budgetUsage(b, transactions).spent, 0);

  const open = (b: Budget | "new") => { setEdit(b); setErr(""); setForm(b === "new" ? { categoryId: "", amount: 0 } : { categoryId: b.categoryId, amount: b.amount }); };

  return (
    <div className="space-y-5">
      <PageHeader title="Anggaran" description={formatMonth(month)} actions={<Button onClick={() => open("new")}><Plus /> Buat</Button>} />
      <div className="surface p-5">
        <p className="text-sm text-muted-foreground">Terpakai dari total anggaran</p>
        <p className="mt-1 text-2xl font-bold tabular-nums">{formatRupiah(spent)} <span className="text-base font-medium text-muted-foreground">/ {formatRupiah(total)}</span></p>
      </div>
      {list.length === 0 ? <EmptyState icon={PieChart} title="Belum ada anggaran" description="Buat anggaran agar pengeluaran tetap terkendali." action={<Button onClick={() => open("new")}>+ Buat Anggaran</Button>} /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((b) => {
            const c = categories.find((x) => x.id === b.categoryId);
            const u = budgetUsage(b, transactions);
            return (
              <article key={b.id} className="surface space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <IconBadge icon={c?.icon ?? "circle-ellipsis"} color={c?.color ?? "slate"} />
                  <div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{c?.name ?? "Kategori"}</h3><p className="text-xs text-muted-foreground">Budget {formatRupiah(b.amount)}</p></div>
                  <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => open(b)}><Pencil /></Button>
                  <Button variant="ghost" size="icon" aria-label="Hapus" onClick={() => setDel(b)}><Trash2 /></Button>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={u.pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className={cn("h-full rounded-full", u.level === "over" ? "bg-expense" : u.level === "warning" ? "bg-warning" : "bg-primary")} style={{ width: `${Math.min(100, u.pct)}%` }} />
                </div>
                <div className="flex justify-between text-sm"><span>Terpakai {formatRupiah(u.spent)}</span><span className="font-semibold">{u.pct}%</span></div>
                {u.level !== "ok" && <p className={cn("flex items-center gap-2 text-xs font-medium", u.level === "over" ? "text-expense" : "text-warning")}><AlertTriangle className="size-4" />Anggaran {c?.name.toLowerCase()} sudah mencapai {u.pct}%.</p>}
              </article>
            );
          })}
        </div>
      )}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{edit === "new" ? "Buat Anggaran" : "Edit Anggaran"}</DialogTitle><DialogDescription>Batas pengeluaran untuk {formatMonth(month)}</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!form.categoryId || form.amount <= 0) return setErr("Pilih kategori dan isi nominal");
            setSaving(true);
            try { await saveBudget({ ...form, month }, edit && edit !== "new" ? edit.id : undefined); setEdit(null); } finally { setSaving(false); }
          }}>
            <div className="space-y-1.5"><Label htmlFor="bcat">Kategori</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger id="bcat"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>{categories.filter((c) => c.type === "expense").map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label htmlFor="bamt">Nominal</Label><MoneyInput id="bamt" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} /></div>
            {err && <p className="text-xs text-destructive">{err}</p>}
            <LoadingButton type="submit" className="w-full" loading={saving}>Simpan</LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} title="Hapus anggaran?" description="Anggaran ini akan dihapus." onConfirm={async () => { if (del) await deleteBudget(del.id); }} />
    </div>
  );
}
