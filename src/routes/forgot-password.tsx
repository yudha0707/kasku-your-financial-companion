import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/ForgotPassword";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Lupa Kata Sandi — KASKU" },
      { name: "description", content: "Atur ulang kata sandi akun KASKU." },
      { property: "og:title", content: "Lupa Kata Sandi — KASKU" },
      { property: "og:description", content: "Atur ulang kata sandi akun KASKU." },
    ],
  }),
  component: Page,
});
