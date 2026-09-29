import { useState } from "react";
import { Pencil, Trash2, Paperclip } from "lucide-react";
import type { Transaction } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useApp } from "@/store/AppContext";
import { formatSigned } from "@/utils/currency";
import { formatDateLong, formatDateTime } from "@/utils/date";
import { txTypeLabel } from "@/utils/format";
import { cn } from "@/lib/utils";
import { amountColor, useTxMeta } from "./TransactionItem";
import { TransactionForm } from "./TransactionForm";

function Detail({ tx, onEdit, onDelete }: { tx: Transaction; onEdit: () => void; onDelete: () => void }) {
  const meta = useTxMeta(tx);
  const rows: [string, React.ReactNode][] = [
    ["Tipe", txTypeLabel[tx.type]],
    ["Kategori", meta.categoryName],
    ["Rekening", meta.accountName],
    ["Tanggal", formatDateLong(tx.date)],
    ["Waktu", tx.time],
    ["Catatan", tx.note || "-"],
    ["Tag", tx.tags.length ? <span className="flex flex-wrap justify-end gap-1">{tx.tags.map((t) => <Badge key={t} variant="secondary">#{t}</Badge>)}</span> : "-"],
    ["Lampiran", tx.attachment ? <span className="inline-flex items-center gap-1"><Paperclip className="size-3.5" />{tx.attachment}</span> : "-"],
    ["Dibuat", formatDateTime(tx.createdAt)],
  ];
  return (
    <>
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <IconBadge icon={meta.icon} color={meta.color} size="lg" />
        <p className={cn("text-3xl font-bold tabular-nums", amountColor(tx.type))}>{formatSigned(tx.amount, tx.type)}</p>
      </div>
      <dl className="divide-y rounded-xl border text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 px-4 py-2.5">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium break-words">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onEdit}><Pencil /> Edit</Button>
        <Button variant="destructive" onClick={onDelete}><Trash2 /> Hapus</Button>
      </div>
    </>
  );
}

export function TransactionDetailDialog({ tx, onClose }: { tx: Transaction | null; onClose: () => void }) {
  const { updateTransaction, deleteTransaction } = useApp();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <Dialog open={!!tx && !confirm} onOpenChange={(o) => { if (!o) { setEditing(false); onClose(); } }}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Transaksi" : tx?.title}</DialogTitle>
            <DialogDescription>{editing ? "Perbarui detail transaksi" : "Detail transaksi"}</DialogDescription>
          </DialogHeader>
          {tx && (editing ? (
            <TransactionForm
              initial={tx}
              submitLabel="Simpan Perubahan"
              onSubmit={async (d) => { await updateTransaction(tx.id, d); setEditing(false); onClose(); }}
            />
          ) : (
            <Detail tx={tx} onEdit={() => setEditing(true)} onDelete={() => setConfirm(true)} />
          ))}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Hapus transaksi?"
        description={`"${tx?.title ?? ""}" akan dihapus permanen dan saldo rekening disesuaikan.`}
        onConfirm={async () => { if (tx) await deleteTransaction(tx.id); onClose(); }}
      />
    </>
  );
}
