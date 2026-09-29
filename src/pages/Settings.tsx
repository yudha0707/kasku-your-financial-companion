import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Monitor, Download, Upload, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/store/AppContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { exportDB, importDB } from "@/services/mockDb";
import type { Theme } from "@/types";
import { cn } from "@/lib/utils";

const PREF_KEY = "kasku:prefs";
const defaults = { currency: "IDR", notif: { transaction: true, budget: true, debt: true, summary: false } };

export default function Settings() {
  const { theme, setTheme, resetData, reload } = useApp();
  const [prefs, setPrefs] = useState(defaults);
  const [confirm, setConfirm] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => { const raw = localStorage.getItem(PREF_KEY); if (raw) setPrefs(JSON.parse(raw) as typeof defaults); }, []);
  const save = (p: typeof defaults) => { setPrefs(p); localStorage.setItem(PREF_KEY, JSON.stringify(p)); };
  const themes: { v: Theme; l: string; i: typeof Sun }[] = [{ v: "light", l: "Light", i: Sun }, { v: "dark", l: "Dark", i: Moon }, { v: "system", l: "System", i: Monitor }];
  const notifs: [keyof typeof defaults.notif, string][] = [["transaction", "Pengingat transaksi"], ["budget", "Pengingat budget"], ["debt", "Pengingat utang"], ["summary", "Ringkasan keuangan"]];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader title="Pengaturan" />
      <section className="surface space-y-3 p-5">
        <h2 className="font-semibold">Tampilan</h2>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((t) => <button key={t.v} onClick={() => setTheme(t.v)} aria-pressed={theme === t.v} className={cn("flex flex-col items-center gap-2 rounded-xl border p-3 text-sm font-medium", theme === t.v && "border-primary bg-accent")}><t.i className="size-5" />{t.l}</button>)}
        </div>
      </section>
      <section className="surface space-y-3 p-5">
        <h2 className="font-semibold">Mata Uang</h2>
        <div className="grid grid-cols-2 gap-2">
          {["IDR", "USD"].map((c) => <button key={c} onClick={() => { save({ ...prefs, currency: c }); toast.success(`Mata uang: ${c}`); }} aria-pressed={prefs.currency === c} className={cn("rounded-xl border p-3 text-sm font-semibold", prefs.currency === c && "border-primary bg-accent")}>{c}</button>)}
        </div>
      </section>
      <section className="surface space-y-4 p-5">
        <h2 className="font-semibold">Notifikasi</h2>
        {notifs.map(([k, l]) => (
          <div key={k} className="flex items-center justify-between"><Label htmlFor={k}>{l}</Label><Switch id={k} checked={prefs.notif[k]} onCheckedChange={(v) => save({ ...prefs, notif: { ...prefs.notif, [k]: v } })} /></div>
        ))}
      </section>
      <section className="surface space-y-3 p-5">
        <h2 className="font-semibold">Data</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          <Button variant="outline" onClick={() => {
            const url = URL.createObjectURL(new Blob([exportDB()], { type: "application/json" }));
            const a = document.createElement("a"); a.href = url; a.download = "kasku-data.json"; a.click(); URL.revokeObjectURL(url);
            toast.success("Data diekspor");
          }}><Download /> Export data</Button>
          <Button variant="outline" onClick={() => file.current?.click()}><Upload /> Import data</Button>
          <Button variant="outline" className="text-destructive" onClick={() => setConfirm(true)}><RotateCcw /> Reset data</Button>
        </div>
        <input ref={file} type="file" accept="application/json" className="hidden" aria-label="Pilih file data" onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return;
          try { importDB(await f.text()); await reload(); toast.success("Data berhasil diimpor"); } catch { toast.error("File tidak valid"); }
          e.target.value = "";
        }} />
      </section>
      <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Reset semua data?" description="Data akan dikembalikan ke contoh awal." confirmLabel="Reset" onConfirm={resetData} />
    </div>
  );
}
