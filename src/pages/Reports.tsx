import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { startOfWeek, startOfYear, format } from "date-fns";
import { useApp } from "@/store/AppContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CashFlowChart, CategoryDonut, ChartLegend, ExpenseTrendChart, NetLineChart } from "@/components/reports/Charts";
import { EmptyState } from "@/components/shared/States";
import { expenseByCategory, inRange, seriesForRange, topWithOthers, totals } from "@/utils/finance";
import { formatRupiah } from "@/utils/currency";
import { todayISO } from "@/utils/date";
import { cn } from "@/lib/utils";

type Period = "today" | "week" | "month" | "year" | "custom";
const labels: Record<Period, string> = { today: "Hari ini", week: "Minggu ini", month: "Bulan ini", year: "Tahun ini", custom: "Custom" };

export default function Reports() {
  const { transactions, categories } = useApp();
  const today = todayISO();
  const [period, setPeriod] = useState<Period>("month");
  const [custom, setCustom] = useState({ from: `${today.slice(0, 7)}-01`, to: today });
  const range = useMemo(() => {
    const d = new Date();
    if (period === "today") return { from: today, to: today };
    if (period === "week") return { from: format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-MM-dd"), to: today };
    if (period === "month") return { from: `${today.slice(0, 7)}-01`, to: today };
    if (period === "year") return { from: format(startOfYear(d), "yyyy-MM-dd"), to: today };
    return custom;
  }, [period, custom, today]);
  const txs = transactions.filter((t) => inRange(t, range.from, range.to));
  const { income, expense, net } = totals(txs);
  const series = seriesForRange(transactions, range.from, range.to);

  return (
    <div className="space-y-5">
      <PageHeader title="Laporan" description="Analisis kondisi keuanganmu" actions={
        <Button variant="outline" onClick={() => toast.success("Laporan diekspor (simulasi)")}><Download /> Export</Button>
      } />
      <div className="flex flex-wrap gap-2">
        {(Object.keys(labels) as Period[]).map((p) => (
          <button key={p} onClick={() => setPeriod(p)} aria-pressed={period === p} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium", period === p ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}>{labels[p]}</button>
        ))}
      </div>
      {period === "custom" && (
        <div className="grid max-w-md grid-cols-2 gap-2">
          <Input type="date" aria-label="Dari" value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} />
          <Input type="date" aria-label="Sampai" value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["Total pemasukan", income, "text-income"], ["Total pengeluaran", expense, "text-expense"], ["Cash flow", income - expense, "text-info"], ["Net income", net, net >= 0 ? "text-income" : "text-expense"]].map(([l, v, c]) => (
          <div key={l as string} className="surface p-4">
            <p className="text-xs text-muted-foreground">{l}</p>
            <p className={cn("mt-1 font-bold tabular-nums sm:text-lg", c as string)}>{formatRupiah(v as number)}</p>
          </div>
        ))}
      </div>
      {txs.length === 0 ? <EmptyState title="Belum ada data" description="Tidak ada transaksi pada periode ini." /> : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="surface p-5"><h2 className="font-semibold">Pemasukan vs Pengeluaran</h2><ChartLegend /><CashFlowChart data={series} /></section>
          <section className="surface p-5"><h2 className="mb-4 font-semibold">Pengeluaran per Kategori</h2><CategoryDonut data={topWithOthers(expenseByCategory(txs, categories))} /></section>
          <section className="surface p-5"><h2 className="mb-2 font-semibold">Arus Kas</h2><NetLineChart data={series} /></section>
          <section className="surface p-5"><h2 className="mb-2 font-semibold">Tren Pengeluaran</h2><ExpenseTrendChart data={series} /></section>
        </div>
      )}
    </div>
  );
}
