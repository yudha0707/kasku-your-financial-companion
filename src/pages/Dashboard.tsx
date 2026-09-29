import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, HandCoins, AlertTriangle, ChevronRight } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { formatRupiah } from "@/utils/currency";
import { currentMonth, formatMonth } from "@/utils/date";
import { budgetUsage, expenseByCategory, monthlyCashflow, topWithOthers, totals, weeklyCashflow } from "@/utils/finance";
import { CashFlowChart, CategoryDonut, ChartLegend } from "@/components/reports/Charts";
import { TransactionItem } from "@/components/transaction/TransactionItem";
import { TransactionDetailDialog } from "@/components/transaction/TransactionDetail";
import { EmptyState } from "@/components/shared/States";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, transactions, accounts, categories, budgets } = useApp();
  const [mode, setMode] = useState<"week" | "month">("week");
  const [selected, setSelected] = useState<Transaction | null>(null);
  const month = currentMonth();
  const monthTx = useMemo(() => transactions.filter((t) => t.date.startsWith(month)), [transactions, month]);
  const { income, expense } = totals(monthTx);
  const balance = accounts.reduce((s, a) => s + a.balance, 0);
  const savings = accounts.filter((a) => a.type === "savings").reduce((s, a) => s + a.balance, 0);
  const alerts = budgets
    .filter((b) => b.month === month)
    .map((b) => ({ b, u: budgetUsage(b, transactions), c: categories.find((c) => c.id === b.categoryId) }))
    .filter((x) => x.u.level !== "ok");

  const actions = [
    { label: "Pemasukan", icon: ArrowDownLeft, cls: "text-income bg-income/10", to: "/transactions/new", search: { type: "income" as const } },
    { label: "Pengeluaran", icon: ArrowUpRight, cls: "text-expense bg-expense/10", to: "/transactions/new", search: { type: "expense" as const } },
    { label: "Transfer", icon: ArrowLeftRight, cls: "text-info bg-info/10", to: "/transactions/new", search: { type: "transfer" as const } },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Selamat datang 👋</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{user?.name}</h1>
        <p className="text-sm text-muted-foreground">{formatMonth(month)}</p>
      </div>

      <section className="bg-balance rounded-3xl p-6 text-primary-foreground shadow-lg sm:p-8">
        <p className="text-sm opacity-80">Total Saldo</p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums sm:text-4xl">{formatRupiah(balance)}</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[["Pemasukan bulan ini", income], ["Pengeluaran bulan ini", expense], ["Tabungan", savings]].map(([l, v]) => (
            <div key={l} className="rounded-2xl bg-primary-foreground/10 p-3">
              <p className="text-xs opacity-80">{l}</p>
              <p className="font-bold tabular-nums">{formatRupiah(v as number)}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Aksi cepat" className="grid grid-cols-4 gap-3">
        {actions.map((a) => (
          <Link key={a.label} to={a.to} search={a.search} className="surface flex flex-col items-center gap-2 p-3 text-xs font-medium sm:text-sm">
            <span className={cn("grid size-10 place-items-center rounded-xl", a.cls)}><a.icon className="size-5" /></span>{a.label}
          </Link>
        ))}
        <Link to="/debts" className="surface flex flex-col items-center gap-2 p-3 text-xs font-medium sm:text-sm">
          <span className="grid size-10 place-items-center rounded-xl bg-warning/15 text-warning"><HandCoins className="size-5" /></span>Utang
        </Link>
      </section>

      {alerts.length > 0 && (
        <section className="space-y-2">
          {alerts.map(({ b, u, c }) => (
            <Link key={b.id} to="/budgets" role="alert" className={cn("flex items-center gap-3 rounded-2xl border p-3 text-sm", u.level === "over" ? "border-expense/30 bg-expense/10" : "border-warning/30 bg-warning/10")}>
              <AlertTriangle className={cn("size-5 shrink-0", u.level === "over" ? "text-expense" : "text-warning")} />
              Anggaran {c?.name.toLowerCase()} sudah mencapai {u.pct}%.
            </Link>
          ))}
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div><h2 className="font-semibold">Cash Flow</h2><ChartLegend /></div>
            <div className="flex rounded-lg bg-muted p-1 text-xs">
              {(["week", "month"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} className={cn("rounded-md px-3 py-1 font-medium", mode === m && "bg-card shadow-sm")}>{m === "week" ? "Mingguan" : "Bulanan"}</button>
              ))}
            </div>
          </div>
          <CashFlowChart data={mode === "week" ? weeklyCashflow(transactions, month) : monthlyCashflow(transactions, month)} />
        </section>
        <section className="surface p-5">
          <h2 className="mb-4 font-semibold">Pengeluaran per Kategori</h2>
          <CategoryDonut data={topWithOthers(expenseByCategory(monthTx, categories))} />
        </section>
      </div>

      <section className="surface p-3 sm:p-5">
        <div className="mb-2 flex items-center justify-between px-2">
          <h2 className="font-semibold">Transaksi Terbaru</h2>
          <Link to="/transactions" className="flex items-center text-sm font-medium text-primary">Lihat semua <ChevronRight className="size-4" /></Link>
        </div>
        {transactions.length === 0 ? (
          <EmptyState title="Belum ada transaksi" description="Mulai catat transaksi pertamamu." action={<Button asChild><Link to="/transactions/new">+ Tambah Transaksi</Link></Button>} />
        ) : transactions.slice(0, 8).map((t) => <TransactionItem key={t.id} tx={t} onClick={setSelected} />)}
      </section>
      <TransactionDetailDialog tx={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
