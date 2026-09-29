import { useState, type FormEvent } from "react";
import { Paperclip, X } from "lucide-react";
import type { TransactionInput, TransactionType } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoneyInput } from "@/components/shared/Pickers";
import { IconBadge } from "@/components/shared/IconBadge";
import { LoadingButton } from "@/components/shared/States";
import { useApp } from "@/store/AppContext";
import { nowTime, todayISO } from "@/utils/date";
import { cn } from "@/lib/utils";

interface Props {
  initial?: Partial<TransactionInput> | undefined;
  defaultType?: TransactionType | undefined;
  submitLabel?: string;
  onSubmit: (data: TransactionInput) => Promise<void>;
}

const types: { value: TransactionType; label: string; cls: string }[] = [
  { value: "expense", label: "Pengeluaran", cls: "data-[active=true]:bg-expense data-[active=true]:text-primary-foreground" },
  { value: "income", label: "Pemasukan", cls: "data-[active=true]:bg-income data-[active=true]:text-primary-foreground" },
  { value: "transfer", label: "Transfer", cls: "data-[active=true]:bg-info data-[active=true]:text-primary-foreground" },
];

export function TransactionForm({ initial, defaultType = "expense", submitLabel = "Simpan Transaksi", onSubmit }: Props) {
  const { categories, accounts } = useApp();
  const [type, setType] = useState<TransactionType>(initial?.type ?? defaultType);
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [accountId, setAccountId] = useState(initial?.accountId ?? accounts[0]?.id ?? "");
  const [toAccountId, setToAccountId] = useState(initial?.toAccountId ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [time, setTime] = useState(initial?.time ?? nowTime());
  const [note, setNote] = useState(initial?.note ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [attachment, setAttachment] = useState<string | null>(initial?.attachment ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const cats = categories.filter((c) => c.type === type);

  function validate() {
    const e: Record<string, string> = {};
    if (amount <= 0) e["amount"] = "Nominal harus lebih dari 0";
    if (!accountId) e["accountId"] = "Pilih rekening";
    if (type !== "transfer" && !categoryId) e["categoryId"] = "Pilih kategori";
    if (type === "transfer" && !toAccountId) e["toAccountId"] = "Pilih rekening tujuan";
    if (type === "transfer" && toAccountId === accountId) e["toAccountId"] = "Rekening tujuan harus berbeda";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const cat = categories.find((c) => c.id === categoryId);
    setSaving(true);
    try {
      await onSubmit({
        type,
        amount,
        title: title.trim() || (type === "transfer" ? "Transfer" : cat?.name ?? "Transaksi"),
        categoryId: type === "transfer" ? null : categoryId,
        accountId,
        toAccountId: type === "transfer" ? toAccountId : null,
        date,
        time,
        note: note.trim() || undefined,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        attachment,
        status: "completed",
      });
    } finally {
      setSaving(false);
    }
  }

  const err = (k: string) => errors[k] && <p className="text-xs font-medium text-destructive">{errors[k]}</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div role="radiogroup" aria-label="Tipe transaksi" className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
        {types.map((t) => (
          <button
            key={t.value} type="button" role="radio" aria-checked={type === t.value} data-active={type === t.value}
            onClick={() => { setType(t.value); setCategoryId(""); }}
            className={cn("rounded-lg py-2 text-sm font-semibold text-muted-foreground transition", t.cls)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Nominal</Label>
        <MoneyInput id="amount" value={amount} onChange={setAmount} large invalid={!!errors["amount"]} />
        {err("amount")}
      </div>

      {type !== "transfer" && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Kategori</legend>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {cats.map((c) => (
              <button
                key={c.id} type="button" aria-pressed={categoryId === c.id}
                onClick={() => setCategoryId(c.id)}
                className={cn("flex flex-col items-center gap-1.5 rounded-xl border p-2 text-xs font-medium transition hover:bg-muted", categoryId === c.id && "border-primary bg-accent")}
              >
                <IconBadge icon={c.icon} color={c.color} size="sm" />
                <span className="w-full truncate text-center">{c.name}</span>
              </button>
            ))}
          </div>
          {err("categoryId")}
        </fieldset>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="title">Nama transaksi</Label>
        <Input id="title" placeholder="Contoh: Makan siang" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className={cn("grid gap-4", type === "transfer" && "sm:grid-cols-2")}>
        <div className="space-y-1.5">
          <Label htmlFor="account">{type === "transfer" ? "Dari rekening" : "Rekening"}</Label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger id="account" aria-invalid={!!errors["accountId"]}><SelectValue placeholder="Pilih rekening" /></SelectTrigger>
            <SelectContent>{accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
          </Select>
          {err("accountId")}
        </div>
        {type === "transfer" && (
          <div className="space-y-1.5">
            <Label htmlFor="toAccount">Ke rekening</Label>
            <Select value={toAccountId ?? ""} onValueChange={setToAccountId}>
              <SelectTrigger id="toAccount" aria-invalid={!!errors["toAccountId"]}><SelectValue placeholder="Pilih rekening tujuan" /></SelectTrigger>
              <SelectContent>{accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
            {err("toAccountId")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="date">Tanggal</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="time">Waktu</Label>
          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="note">Catatan</Label>
        <Textarea id="note" rows={2} placeholder="Opsional" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tags">Tag</Label>
          <Input id="tags" placeholder="kantor, keluarga" value={tags} onChange={(e) => setTags(e.target.value)} />
          <p className="text-xs text-muted-foreground">Pisahkan dengan koma</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="attachment">Lampiran / struk</Label>
          {attachment ? (
            <div className="flex h-9 items-center justify-between gap-2 rounded-md border px-3 text-sm">
              <span className="flex min-w-0 items-center gap-2"><Paperclip className="size-4 shrink-0" /><span className="truncate">{attachment}</span></span>
              <button type="button" aria-label="Hapus lampiran" onClick={() => setAttachment(null)}><X className="size-4" /></button>
            </div>
          ) : (
            <Input id="attachment" type="file" accept="image/*,application/pdf" onChange={(e) => setAttachment(e.target.files?.[0]?.name ?? null)} />
          )}
        </div>
      </div>

      <LoadingButton type="submit" size="lg" className="w-full" loading={saving}>{submitLabel}</LoadingButton>
    </form>
  );
}
