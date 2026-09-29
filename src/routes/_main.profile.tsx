import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Profile";

export const Route = createFileRoute("/_main/profile")({
  head: () => ({
    meta: [
      { title: "Profil — KASKU" },
      { name: "description", content: "Profil dan preferensi akun KASKU." },
      { property: "og:title", content: "Profil — KASKU" },
      { property: "og:description", content: "Profil dan preferensi akun KASKU." },
    ],
  }),
  component: Page,
});
