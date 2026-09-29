import { createFileRoute } from "@tanstack/react-router";
import AddTransaction from "@/pages/AddTransaction";

export const Route = createFileRoute("/_main/transactions/new")({
  validateSearch: (s: Record<string, unknown>): { type?: "income" | "expense" | "transfer" } =>
    s["type"] === "income" || s["type"] === "expense" || s["type"] === "transfer" ? { type: s["type"] } : {},
  head: () => ({
    meta: [
      { title: "Tambah Transaksi — KASKU" },
      { name: "description", content: "Catat pemasukan, pengeluaran, atau transfer baru." },
      { property: "og:title", content: "Tambah Transaksi — KASKU" },
      { property: "og:description", content: "Catat pemasukan, pengeluaran, atau transfer baru." },
    ],
  }),
  component: Page,
});

function Page() {
  const { type } = Route.useSearch();
  return <AddTransaction defaultType={type} />;
}
