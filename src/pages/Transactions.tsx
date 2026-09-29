import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { List, Table2, Plus } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/States";
import { Button } from "@/components/ui/button";
import { TransactionFilter, defaultFilters, type TxFilters } from "@/components/transaction/TransactionFilter";
import { TransactionItem } from "@/components/transaction/TransactionItem";
import { TransactionTable } from "@/components/transaction/TransactionTable";
import { TransactionDetailDialog } from "@/components/transaction/TransactionDetail";
import { formatDateLong } from "@/utils/date";
import type { Transaction } from "@/types";

const PAGE = 15;

export default function Transactions() {
  const { transactions, categories } = useApp();
  const [f, setF] = useState<TxFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "table">("list");
  const [selected, setSelected] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const q = f.q.toLowerCase();
    const r = transactions.filter((t) => {
      if (f.type !== "all" && t.type !== f.type) return false;
      if (f.categoryId !== "all" && t.categoryId !== f.categoryId) return false;
      if (f.accountId !== "all" && t.accountId !== f.accountId && t.toAccountId !== f.accountId) return false;
      if (f.from && t.date < f.from) return false;
      if (f.to && t.date > f.to) return false;
      if (q) {
        const cat = categories.find((c) => c.id === t.categoryId)?.name ?? "";
        if (![t.title, t.note ?? "", cat, ...t.tags].join(" ").toLowerCase().includes(q)) return false;
      }
      return true;
    });
    const key = (t: Transaction) => t.date + t.time;
    return r.sort((a, b) =>
      f.sort === "oldest" ? key(a).localeCompare(key(b)) : f.sort === "highest" ? b.amount - a.amount : f.sort === "lowest" ? a.amount - b.amount : key(b).localeCompare(key(a)));
  }, [transactions, categories, f]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = filtered.slice((page - 1) * PAGE, page * PAGE);
  const groups = useMemo(() => {
    const m = new Map<string, Transaction[]>();
    for (const t of current) m.set(t.date, [...(m.get(t.date) ?? []), t]);
    return [...m.entries()];
  }, [current]);

  return (
    <div className="space-y-4">
      <PageHeader title="Transaksi" description={`${filtered.length} transaksi`} actions={
        <>
          <div className="hidden rounded-lg bg-muted p-1 md:flex">
            <button aria-label="Tampilan daftar" aria-pressed={view === "list"} onClick={() => setView("list")} className={`rounded-md p-1.5 ${view === "list" ? "bg-card shadow-sm" : ""}`}><List className="size-4" /></button>
            <button aria-label="Tampilan tabel" aria-pressed={view === "table"} onClick={() => setView("table")} className={`rounded-md p-1.5 ${view === "table" ? "bg-card shadow-sm" : ""}`}><Table2 className="size-4" /></button>
          </div>
          <Button asChild><Link to="/transactions/new"><Plus /> <span className="hidden sm:inline">Tambah</span></Link></Button>
        </>
      } />
      <TransactionFilter value={f} onChange={(v) => { setF(v); setPage(1); }} />
      {filtered.length === 0 ? (
        <EmptyState title="Belum ada transaksi" description="Tidak ada transaksi yang cocok. Mulai catat transaksi pertamamu." action={<Button asChild><Link to="/transactions/new">+ Tambah Transaksi</Link></Button>} />
      ) : view === "table" ? (
        <TransactionTable transactions={current} onSelect={setSelected} />
      ) : (
        <div className="space-y-4">
          {groups.map(([date, list]) => (
            <section key={date} className="surface p-2 sm:p-3">
              <h2 className="px-2 py-1 text-sm font-semibold text-muted-foreground">{formatDateLong(date)}</h2>
              {list.map((t) => <TransactionItem key={t.id} tx={t} onClick={setSelected} showDate={false} />)}
            </section>
          ))}
        </div>
      )}
      {pages > 1 && (
        <nav aria-label="Halaman" className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Sebelumnya</Button>
          <span className="text-sm text-muted-foreground">{page} / {pages}</span>
          <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage(page + 1)}>Berikutnya</Button>
        </nav>
      )}
      <TransactionDetailDialog tx={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
