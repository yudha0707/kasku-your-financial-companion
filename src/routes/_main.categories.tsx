import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Categories";

export const Route = createFileRoute("/_main/categories")({
  head: () => ({
    meta: [
      { title: "Kategori — KASKU" },
      { name: "description", content: "Kelola kategori pemasukan dan pengeluaran." },
      { property: "og:title", content: "Kategori — KASKU" },
      { property: "og:description", content: "Kelola kategori pemasukan dan pengeluaran." },
    ],
  }),
  component: Page,
});
