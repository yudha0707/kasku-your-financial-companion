import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — KASKU" },
      { name: "description", content: "Masuk ke akun KASKU." },
      { property: "og:title", content: "Masuk — KASKU" },
      { property: "og:description", content: "Masuk ke akun KASKU." },
    ],
  }),
  component: Page,
});
