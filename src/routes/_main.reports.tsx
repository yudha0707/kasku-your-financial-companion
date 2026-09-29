import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Reports";

export const Route = createFileRoute("/_main/reports")({
  head: () => ({
    meta: [
      { title: "Laporan — KASKU" },
      { name: "description", content: "Laporan pemasukan, pengeluaran, dan arus kas." },
      { property: "og:title", content: "Laporan — KASKU" },
      { property: "og:description", content: "Laporan pemasukan, pengeluaran, dan arus kas." },
    ],
  }),
  component: Page,
});
