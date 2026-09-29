import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Dashboard";

export const Route = createFileRoute("/_main/")({
  head: () => ({
    meta: [
      { title: "Dashboard — KASKU" },
      { name: "description", content: "Ringkasan saldo, arus kas, dan transaksi terbaru." },
      { property: "og:title", content: "Dashboard — KASKU" },
      { property: "og:description", content: "Ringkasan saldo, arus kas, dan transaksi terbaru." },
    ],
  }),
  component: Page,
});
