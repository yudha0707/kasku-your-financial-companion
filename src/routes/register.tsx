import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Register";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar — KASKU" },
      { name: "description", content: "Buat akun KASKU baru." },
      { property: "og:title", content: "Daftar — KASKU" },
      { property: "og:description", content: "Buat akun KASKU baru." },
    ],
  }),
  component: Page,
});
