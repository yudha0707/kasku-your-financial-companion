import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Accounts";

export const Route = createFileRoute("/_main/accounts")({
  head: () => ({
    meta: [
      { title: "Rekening & Dompet — KASKU" },
      { name: "description", content: "Kelola rekening bank, tunai, dan e-wallet." },
      { property: "og:title", content: "Rekening & Dompet — KASKU" },
      { property: "og:description", content: "Kelola rekening bank, tunai, dan e-wallet." },
    ],
  }),
  component: Page,
});
