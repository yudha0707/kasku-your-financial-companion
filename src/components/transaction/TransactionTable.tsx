import type { Transaction } from "@/types";
import { IconBadge } from "@/components/shared/IconBadge";
import { formatSigned } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { cn } from "@/lib/utils";
import { amountColor, useTxMeta } from "./TransactionItem";

function Row({ tx, onClick }: { tx: Transaction; onClick: (t: Transaction) => void }) {
  const meta = useTxMeta(tx);
  return (
    <tr
      tabIndex={0}
      onClick={() => onClick(tx)}
      onKeyDown={(e) => e.key === "Enter" && onClick(tx)}
      className="cursor-pointer border-t transition hover:bg-muted/50 focus-visible:bg-muted/50"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={meta.icon} color={meta.color} size="sm" />
          <span className="font-medium">{tx.title}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{meta.categoryName}</td>
      <td className="px-4 py-3 text-muted-foreground">{meta.accountName}</td>
      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(tx.date)} · {tx.time}</td>
      <td className={cn("whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums", amountColor(tx.type))}>{formatSigned(tx.amount, tx.type)}</td>
    </tr>
  );
}

export function TransactionTable({ transactions, onSelect }: { transactions: Transaction[]; onSelect: (t: Transaction) => void }) {
  return (
    <div className="surface overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Transaksi</th>
            <th scope="col" className="px-4 py-3 font-medium">Kategori</th>
            <th scope="col" className="px-4 py-3 font-medium">Rekening</th>
            <th scope="col" className="px-4 py-3 font-medium">Tanggal</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Nominal</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => <Row key={t.id} tx={t} onClick={onSelect} />)}
        </tbody>
      </table>
    </div>
  );
}
