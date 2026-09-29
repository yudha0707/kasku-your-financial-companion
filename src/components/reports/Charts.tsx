import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { formatCompact, formatRupiah } from "@/utils/currency";
import { colorVar } from "@/components/shared/icons";

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--popover-foreground)",
  fontSize: 12,
};
const axis = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false } as const;
const fmt = (v: number) => formatRupiah(v);

type Point = { label: string; income: number; expense: number; net?: number };

export function CashFlowChart({ data, height = 260 }: { data: Point[]; height?: number }) {
  return (
    <div style={{ height }} role="img" aria-label="Grafik pemasukan dan pengeluaran">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} margin={{ left: -12, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" {...axis} />
          <YAxis {...axis} tickFormatter={formatCompact} />
          <Tooltip contentStyle={tooltipStyle} formatter={fmt} cursor={{ fill: "var(--muted)" }} />
          <Bar dataKey="income" name="Pemasukan" fill="var(--income)" radius={[6, 6, 0, 0]} maxBarSize={28} />
          <Bar dataKey="expense" name="Pengeluaran" fill="var(--expense)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function NetLineChart({ data, height = 240 }: { data: Point[]; height?: number }) {
  let running = 0;
  const cumulative = data.map((d) => ({ label: d.label, saldo: (running += d.income - d.expense) }));
  return (
    <div style={{ height }} role="img" aria-label="Grafik arus kas kumulatif">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={cumulative} margin={{ left: -12, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" {...axis} />
          <YAxis {...axis} tickFormatter={formatCompact} />
          <Tooltip contentStyle={tooltipStyle} formatter={fmt} />
          <Line type="monotone" dataKey="saldo" name="Arus kas" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExpenseTrendChart({ data, height = 240 }: { data: Point[]; height?: number }) {
  return (
    <div style={{ height }} role="img" aria-label="Grafik tren pengeluaran">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--expense)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--expense)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" {...axis} />
          <YAxis {...axis} tickFormatter={formatCompact} />
          <Tooltip contentStyle={tooltipStyle} formatter={fmt} />
          <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="var(--expense)" strokeWidth={2} fill="url(#expFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDonut({ data }: { data: { id: string; name: string; color: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col">
      <div className="relative size-44 shrink-0" role="img" aria-label="Diagram pengeluaran per kategori">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="100%" paddingAngle={2} stroke="none">
              {data.map((d) => <Cell key={d.id} fill={colorVar(d.color)} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={fmt} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-bold">{formatCompact(total)}</p>
          </div>
        </div>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: colorVar(d.color) }} />
            <span className="truncate">{d.name}</span>
            <span className="font-medium tabular-nums text-muted-foreground">{total ? Math.round((d.value / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChartLegend() {
  return (
    <div className="flex gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-income" />Pemasukan</span>
      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-expense" />Pengeluaran</span>
    </div>
  );
}
