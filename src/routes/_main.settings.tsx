import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Settings";

export const Route = createFileRoute("/_main/settings")({
  head: () => ({
    meta: [
      { title: "Pengaturan — KASKU" },
      { name: "description", content: "Tema, mata uang, notifikasi, dan data." },
      { property: "og:title", content: "Pengaturan — KASKU" },
      { property: "og:description", content: "Tema, mata uang, notifikasi, dan data." },
    ],
  }),
  component: Page,
});
