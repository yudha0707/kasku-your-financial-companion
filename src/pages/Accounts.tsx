import { useState } from "react";
import { Plus, Pencil, Trash2, Wallet } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, LoadingButton } from "@/components/shared/States";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { IconBadge } from "@/components/shared/IconBadge";
import { ColorPicker, IconPicker, MoneyInput } from "@/components/shared/Pickers";
import { ACCOUNT_ICON_CHOICES } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatRupiah } from "@/utils/currency";
import { accountTypeLabel } from "@/utils/format";
import type { Account, AccountInput, AccountType } from "@/types";

export default function Accounts() {
  const { accounts, saveAccount, deleteAccount } = useApp();
  const [edit, setEdit] = useState<Account | "new" | null>(null);
  const [del, setDel] = useState<Account | null>(null);
  const [form, setForm] = useState<AccountInput>({ name: "", type: "bank", balance: 0, icon: "landmark", color: "blue" });
  const [saving, setSaving] = useState(false);
  const total = accounts.reduce((s, a) => s + a.balance, 0);
  const open = (a: Account | "new") => { setEdit(a); setForm(a === "new" ? { name: "", type: "bank", balance: 0, icon: "landmark", color: "blue" } : { name: a.name, type: a.type, balance: a.balance, icon: a.icon, color: a.color }); };

  return (
    <div className="space-y-5">
      <PageHeader title="Rekening & Dompet" actions={<Button onClick={() => open("new")}><Plus /> Tambah</Button>} />
      <div className="bg-balance rounded-3xl p-6 text-primary-foreground"><p className="text-sm opacity-80">Total saldo</p><p className="text-3xl font-extrabold tabular-nums">{formatRupiah(total)}</p></div>
      {accounts.length === 0 ? <EmptyState icon={Wallet} title="Belum ada rekening" /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((a) => (
            <article key={a.id} className="surface space-y-3 p-4">
              <div className="flex items-center gap-3">
                <IconBadge icon={a.icon} color={a.color} />
                <div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{a.name}</h3><p className="text-xs text-muted-foreground">{accountTypeLabel[a.type]}</p></div>
                <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => open(a)}><Pencil /></Button>
                <Button variant="ghost" size="icon" aria-label="Hapus" onClick={() => setDel(a)}><Trash2 /></Button>
              </div>
              <p className="text-xl font-bold tabular-nums">{formatRupiah(a.balance)}</p>
            </article>
          ))}
        </div>
      )}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{edit === "new" ? "Tambah Rekening" : "Edit Rekening"}</DialogTitle><DialogDescription>Detail rekening atau dompet</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            setSaving(true);
            try { await saveAccount(form, edit && edit !== "new" ? edit.id : undefined); setEdit(null); } finally { setSaving(false); }
          }}>
            <div className="space-y-1.5"><Label htmlFor="an">Nama</Label><Input id="an" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label htmlFor="at">Jenis</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as AccountType })}>
                  <SelectTrigger id="at"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(accountTypeLabel).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label htmlFor="ab">Saldo</Label><MoneyInput id="ab" value={form.balance} onChange={(v) => setForm({ ...form, balance: v })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Icon</Label><IconPicker choices={ACCOUNT_ICON_CHOICES} value={form.icon} color={form.color} onChange={(icon) => setForm({ ...form, icon })} /></div>
            <div className="space-y-1.5"><Label>Warna</Label><ColorPicker value={form.color} onChange={(color) => setForm({ ...form, color })} /></div>
            <LoadingButton type="submit" className="w-full" loading={saving}>Simpan</LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} title="Hapus rekening?" description={`"${del?.name ?? ""}" akan dihapus.`} onConfirm={async () => { if (del) await deleteAccount(del.id); }} />
    </div>
  );
}
