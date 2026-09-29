import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/store/AppContext";

export interface TxFilters {
  q: string;
  type: "all" | "income" | "expense" | "transfer";
  categoryId: string;
  accountId: string;
  from: string;
  to: string;
  sort: "newest" | "oldest" | "highest" | "lowest";
}

export const defaultFilters: TxFilters = { q: "", type: "all", categoryId: "all", accountId: "all", from: "", to: "", sort: "newest" };

export function TransactionFilter({ value, onChange }: { value: TxFilters; onChange: (f: TxFilters) => void }) {
  const { categories, accounts } = useApp();
  const set = <K extends keyof TxFilters>(k: K, v: TxFilters[K]) => onChange({ ...value, [k]: v });
  const cats = categories.filter((c) => value.type === "all" || value.type === c.type);
  const dirty = JSON.stringify(value) !== JSON.stringify(defaultFilters);

  return (
    <div className="surface space-y-3 p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Cari transaksi"
          placeholder="Cari transaksi, catatan, atau tag…"
          className="pl-9"
          value={value.q}
          onChange={(e) => set("q", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        <Select value={value.type} onValueChange={(v) => onChange({ ...value, type: v as TxFilters["type"], categoryId: "all" })}>
          <SelectTrigger aria-label="Filter tipe"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua tipe</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={value.categoryId} onValueChange={(v) => set("categoryId", v)}>
          <SelectTrigger aria-label="Filter kategori"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kategori</SelectItem>
            {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.type === "income" ? "masuk" : "keluar"})</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={value.accountId} onValueChange={(v) => set("accountId", v)}>
          <SelectTrigger aria-label="Filter rekening"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua rekening</SelectItem>
            {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={value.sort} onValueChange={(v) => set("sort", v as TxFilters["sort"])}>
          <SelectTrigger aria-label="Urutkan"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
            <SelectItem value="highest">Nominal terbesar</SelectItem>
            <SelectItem value="lowest">Nominal terkecil</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" aria-label="Dari tanggal" value={value.from} onChange={(e) => set("from", e.target.value)} />
        <Input type="date" aria-label="Sampai tanggal" value={value.to} onChange={(e) => set("to", e.target.value)} />
      </div>
      {dirty && (
        <Button variant="ghost" size="sm" onClick={() => onChange(defaultFilters)}>
          <X /> Reset filter
        </Button>
      )}
    </div>
  );
}
