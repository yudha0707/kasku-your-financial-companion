import type { Transaction } from "@/types";
import { IconBadge } from "@/components/shared/IconBadge";
import { useLookups } from "@/store/AppContext";
import { formatSigned } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { cn } from "@/lib/utils";

export const amountColor = (type: Transaction["type"]) =>
  type === "income" ? "text-income" : type === "expense" ? "text-expense" : "text-info";

export function useTxMeta(t: Transaction) {
  const { category, account } = useLookups();
  const cat = category(t.categoryId);
  const acc = account(t.accountId);
  const to = account(t.toAccountId);
  return {
    icon: t.type === "transfer" ? "transfer" : cat?.icon ?? "circle-ellipsis",
    color: t.type === "transfer" ? "blue" : cat?.color ?? "slate",
    categoryName: t.type === "transfer" ? "Transfer" : cat?.name ?? "Tanpa kategori",
    accountName: t.type === "transfer" ? `${acc?.name ?? "-"} → ${to?.name ?? "-"}` : acc?.name ?? "-",
  };
}

/** Compact list row (used in lists and dashboard). */
export function TransactionItem({ tx, onClick, showDate = true }: { tx: Transaction; onClick?: (t: Transaction) => void; showDate?: boolean }) {
  const meta = useTxMeta(tx);
  return (
    <button
      type="button"
      onClick={() => onClick?.(tx)}
      className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-muted/60"
    >
      <IconBadge icon={meta.icon} color={meta.color} />
      <span className="min-w-0">
        <span className="block truncate font-medium">{tx.title}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {meta.categoryName} · {meta.accountName}
        </span>
      </span>
      <span className="text-right">
        <span className={cn("block whitespace-nowrap font-semibold tabular-nums", amountColor(tx.type))}>{formatSigned(tx.amount, tx.type)}</span>
        <span className="block text-xs text-muted-foreground">{showDate ? formatDate(tx.date) : tx.time}</span>
      </span>
    </button>
  );
}

/** Card variant for grids / featured display. */
export function TransactionCard({ tx, onClick }: { tx: Transaction; onClick?: (t: Transaction) => void }) {
  const meta = useTxMeta(tx);
  return (
    <button type="button" onClick={() => onClick?.(tx)} className="surface flex w-full flex-col gap-3 p-4 text-left transition hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <IconBadge icon={meta.icon} color={meta.color} size="sm" />
        <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium">{tx.title}</p>
        <p className="truncate text-xs text-muted-foreground">{meta.categoryName}</p>
      </div>
      <p className={cn("font-bold tabular-nums", amountColor(tx.type))}>{formatSigned(tx.amount, tx.type)}</p>
    </button>
  );
}
