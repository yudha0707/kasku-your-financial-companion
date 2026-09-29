import { eachDayOfInterval, parseISO, format, subMonths, differenceInCalendarDays } from "date-fns";
import { id } from "date-fns/locale";
import type { Budget, Category, Debt, DebtStatus, Transaction } from "@/types";
import { formatMonthShort, todayISO } from "./date";

export const inRange = (t: Transaction, from: string, to: string) => t.date >= from && t.date <= to;

export function totals(txs: Transaction[]) {
  let income = 0;
  let expense = 0;
  for (const t of txs) {
    if (t.type === "income") income += t.amount;
    else if (t.type === "expense") expense += t.amount;
  }
  return { income, expense, net: income - expense };
}

export function expenseByCategory(txs: Transaction[], categories: Category[]) {
  const map = new Map<string, number>();
  for (const t of txs) if (t.type === "expense" && t.categoryId) map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
  return [...map.entries()]
    .map(([cid, value]) => {
      const c = categories.find((x) => x.id === cid);
      return { id: cid, name: c?.name ?? "Lainnya", color: c?.color ?? "slate", icon: c?.icon ?? "circle-ellipsis", value };
    })
    .sort((a, b) => b.value - a.value);
}

/** Group top N categories, rest into "Lainnya". */
export function topWithOthers<T extends { value: number; name: string }>(rows: T[], n = 5) {
  if (rows.length <= n + 1) return rows;
  const top = rows.slice(0, n);
  const rest = rows.slice(n).reduce((s, r) => s + r.value, 0);
  return [...top, { ...rows[n]!, id: "others", name: "Lainnya", color: "slate", icon: "circle-ellipsis", value: rest }];
}

export function weeklyCashflow(txs: Transaction[], month: string) {
  const weeks = [
    { label: "Mgg 1", from: 1, to: 7 },
    { label: "Mgg 2", from: 8, to: 14 },
    { label: "Mgg 3", from: 15, to: 21 },
    { label: "Mgg 4", from: 22, to: 28 },
    { label: "Mgg 5", from: 29, to: 31 },
  ];
  return weeks.map((w) => {
    const sub = txs.filter((t) => {
      if (!t.date.startsWith(month)) return false;
      const d = Number(t.date.slice(8, 10));
      return d >= w.from && d <= w.to;
    });
    const { income, expense } = totals(sub);
    return { label: w.label, income, expense };
  });
}

export function monthlyCashflow(txs: Transaction[], endMonth: string, count = 6) {
  const end = parseISO(`${endMonth}-01`);
  return Array.from({ length: count }, (_, i) => {
    const m = format(subMonths(end, count - 1 - i), "yyyy-MM");
    const { income, expense } = totals(txs.filter((t) => t.date.startsWith(m)));
    return { label: formatMonthShort(m), income, expense, net: income - expense };
  });
}

/** Buckets for reports: daily when range <= 31 days, else monthly. */
export function seriesForRange(txs: Transaction[], from: string, to: string) {
  const days = differenceInCalendarDays(parseISO(to), parseISO(from));
  if (days <= 31) {
    return eachDayOfInterval({ start: parseISO(from), end: parseISO(to) }).map((d) => {
      const iso = format(d, "yyyy-MM-dd");
      const { income, expense } = totals(txs.filter((t) => t.date === iso));
      return { label: format(d, "d MMM", { locale: id }), income, expense, net: income - expense };
    });
  }
  const months: string[] = [];
  let cur = parseISO(`${from.slice(0, 7)}-01`);
  while (format(cur, "yyyy-MM") <= to.slice(0, 7)) {
    months.push(format(cur, "yyyy-MM"));
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  return months.map((m) => {
    const { income, expense } = totals(txs.filter((t) => t.date.startsWith(m)));
    return { label: formatMonthShort(m), income, expense, net: income - expense };
  });
}

export function budgetUsage(budget: Budget, txs: Transaction[]) {
  const spent = txs
    .filter((t) => t.type === "expense" && t.categoryId === budget.categoryId && t.date.startsWith(budget.month))
    .reduce((s, t) => s + t.amount, 0);
  const pct = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
  const level: "ok" | "warning" | "over" = pct >= 100 ? "over" : pct >= 80 ? "warning" : "ok";
  return { spent, pct, remaining: budget.amount - spent, level };
}

export function debtStatus(d: Debt, today = todayISO()): DebtStatus {
  if (d.paid >= d.amount) return "paid";
  if (d.dueDate < today) return "overdue";
  return "unpaid";
}

export const debtStatusLabel: Record<DebtStatus, string> = {
  unpaid: "Belum Lunas",
  overdue: "Jatuh Tempo",
  paid: "Lunas",
};
