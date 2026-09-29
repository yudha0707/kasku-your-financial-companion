import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/store/AppContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import type { TransactionType } from "@/types";

export default function AddTransaction({ defaultType }: { defaultType?: TransactionType | undefined }) {
  const { addTransaction } = useApp();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Tambah Transaksi" description="Catat dalam hitungan detik." />
      <div className="surface p-5 sm:p-6">
        <TransactionForm key={defaultType} defaultType={defaultType} onSubmit={async (d) => { await addTransaction(d); void navigate({ to: "/transactions" }); }} />
      </div>
    </div>
  );
}
