import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, LoadingButton } from "@/components/shared/States";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { IconBadge } from "@/components/shared/IconBadge";
import { ColorPicker, IconPicker } from "@/components/shared/Pickers";
import { CATEGORY_ICON_CHOICES } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Category, CategoryInput, CategoryType } from "@/types";

export default function Categories() {
  const { categories, saveCategory, deleteCategory } = useApp();
  const [type, setType] = useState<CategoryType>("expense");
  const [edit, setEdit] = useState<Category | "new" | null>(null);
  const [del, setDel] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryInput>({ name: "", type: "expense", icon: "utensils", color: "emerald" });
  const [saving, setSaving] = useState(false);
  const list = categories.filter((c) => c.type === type);
  const open = (c: Category | "new") => { setEdit(c); setForm(c === "new" ? { name: "", type, icon: "circle-ellipsis", color: "emerald" } : { name: c.name, type: c.type, icon: c.icon, color: c.color }); };

  return (
    <div className="space-y-5">
      <PageHeader title="Kategori" actions={<Button onClick={() => open("new")}><Plus /> Tambah</Button>} />
      <Tabs value={type} onValueChange={(v) => setType(v as CategoryType)}>
        <TabsList className="grid w-full max-w-xs grid-cols-2"><TabsTrigger value="expense">Pengeluaran</TabsTrigger><TabsTrigger value="income">Pemasukan</TabsTrigger></TabsList>
      </Tabs>
      {list.length === 0 ? <EmptyState title="Belum ada kategori" /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <div key={c.id} className="surface flex items-center gap-3 p-3">
              <IconBadge icon={c.icon} color={c.color} />
              <span className="min-w-0 flex-1 truncate font-medium">{c.name}</span>
              <Button variant="ghost" size="icon" aria-label={`Edit ${c.name}`} onClick={() => open(c)}><Pencil /></Button>
              <Button variant="ghost" size="icon" aria-label={`Hapus ${c.name}`} onClick={() => setDel(c)}><Trash2 /></Button>
            </div>
          ))}
        </div>
      )}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{edit === "new" ? "Tambah Kategori" : "Edit Kategori"}</DialogTitle><DialogDescription>Nama, tipe, icon, dan warna</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            setSaving(true);
            try { await saveCategory(form, edit && edit !== "new" ? edit.id : undefined); setEdit(null); } finally { setSaving(false); }
          }}>
            <div className="space-y-1.5"><Label htmlFor="cn">Nama</Label><Input id="cn" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <Tabs value={form.type} onValueChange={(v) => setForm({ ...form, type: v as CategoryType })}>
              <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="expense">Pengeluaran</TabsTrigger><TabsTrigger value="income">Pemasukan</TabsTrigger></TabsList>
            </Tabs>
            <div className="space-y-1.5"><Label>Icon</Label><IconPicker choices={CATEGORY_ICON_CHOICES} value={form.icon} color={form.color} onChange={(icon) => setForm({ ...form, icon })} /></div>
            <div className="space-y-1.5"><Label>Warna</Label><ColorPicker value={form.color} onChange={(color) => setForm({ ...form, color })} /></div>
            <LoadingButton type="submit" className="w-full" loading={saving}>Simpan</LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} title="Hapus kategori?" description={`Kategori "${del?.name ?? ""}" akan dihapus.`} onConfirm={async () => { if (del) await deleteCategory(del.id); }} />
    </div>
  );
}
