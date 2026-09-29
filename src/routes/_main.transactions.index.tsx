import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Transactions";

export const Route = createFileRoute("/_main/transactions/")({
  head: () => ({
    meta: [
      { title: "Transaksi — KASKU" },
      { name: "description", content: "Daftar lengkap transaksi dengan pencarian dan filter." },
      { property: "og:title", content: "Transaksi — KASKU" },
      { property: "og:description", content: "Daftar lengkap transaksi dengan pencarian dan filter." },
    ],
  }),
  component: Page,
});
