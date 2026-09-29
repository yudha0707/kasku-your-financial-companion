import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Budgets";

export const Route = createFileRoute("/_main/budgets")({
  head: () => ({
    meta: [
      { title: "Anggaran — KASKU" },
      { name: "description", content: "Atur anggaran bulanan per kategori." },
      { property: "og:title", content: "Anggaran — KASKU" },
      { property: "og:description", content: "Atur anggaran bulanan per kategori." },
    ],
  }),
  component: Page,
});
