import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Settings, Coins, CalendarDays, Palette, Bell, Shield, PieChart, HandCoins, Tags, Wallet, LogOut, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/store/AppContext";
import { initials } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/shared/States";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Profile() {
  const { user, logout, updateProfile } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "" });
  const [saving, setSaving] = useState(false);

  const prefs = [
    { label: "Preferensi", icon: Settings }, { label: "Mata uang", icon: Coins }, { label: "Format tanggal", icon: CalendarDays },
    { label: "Tema", icon: Palette }, { label: "Notifikasi", icon: Bell },
  ];
  const manage = [
    { to: "/budgets", label: "Anggaran", icon: PieChart }, { to: "/debts", label: "Utang & Piutang", icon: HandCoins },
    { to: "/categories", label: "Kategori", icon: Tags }, { to: "/accounts", label: "Rekening & Dompet", icon: Wallet },
  ] as const;
  const row = "flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition hover:bg-muted/60";

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <section className="surface flex items-center gap-4 p-5">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-primary text-xl font-bold text-primary-foreground">{initials(user?.name ?? "")}</span>
        <div className="min-w-0 flex-1"><h1 className="truncate text-xl font-bold">{user?.name}</h1><p className="truncate text-sm text-muted-foreground">{user?.email}</p></div>
        <Button variant="outline" size="icon" aria-label="Edit profil" onClick={() => { setForm({ name: user?.name ?? "", email: user?.email ?? "" }); setOpen(true); }}><Pencil /></Button>
      </section>
      <section className="surface divide-y overflow-hidden">
        {prefs.map((p) => <Link key={p.label} to="/settings" className={row}><p.icon className="size-5 text-muted-foreground" /><span className="flex-1">{p.label}</span><ChevronRight className="size-4 text-muted-foreground" /></Link>)}
        <button className={row} onClick={() => toast.info("Pengaturan keamanan akan tersedia setelah backend terhubung")}><Shield className="size-5 text-muted-foreground" /><span className="flex-1">Keamanan</span><ChevronRight className="size-4 text-muted-foreground" /></button>
      </section>
      <section className="surface divide-y overflow-hidden">
        {manage.map((m) => <Link key={m.to} to={m.to} className={row}><m.icon className="size-5 text-muted-foreground" /><span className="flex-1">{m.label}</span><ChevronRight className="size-4 text-muted-foreground" /></Link>)}
      </section>
      <Button variant="outline" className="w-full text-destructive" onClick={async () => { await logout(); void navigate({ to: "/login" }); }}><LogOut /> Keluar</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Edit Profil</DialogTitle><DialogDescription>Perbarui nama dan email</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); setSaving(true); try { await updateProfile(form); setOpen(false); } finally { setSaving(false); } }}>
            <div className="space-y-1.5"><Label htmlFor="pn">Nama</Label><Input id="pn" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="pe">Email</Label><Input id="pe" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <LoadingButton type="submit" className="w-full" loading={saving}>Simpan</LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
