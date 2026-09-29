import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Debts";

export const Route = createFileRoute("/_main/debts")({
  head: () => ({
    meta: [
      { title: "Utang & Piutang — KASKU" },
      { name: "description", content: "Catat utang dan piutang beserta jatuh temponya." },
      { property: "og:title", content: "Utang & Piutang — KASKU" },
      { property: "og:description", content: "Catat utang dan piutang beserta jatuh temponya." },
    ],
  }),
  component: Page,
});
