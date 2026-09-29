import type { ReactNode } from "react";
import { Logo } from "./AppShell";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-balance hidden flex-col justify-between p-12 text-primary-foreground lg:flex">
        <span className="text-xl font-bold">KASKU</span>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">Keuanganmu, rapi dalam satu tempat.</h2>
          <p className="mt-4 max-w-md opacity-80">Catat pemasukan, pengeluaran, anggaran, dan utang tanpa ribet.</p>
        </div>
        <p className="text-sm opacity-70">© 2026 KASKU</p>
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-6">
          <Logo />
          <div><h1 className="text-2xl font-bold">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div>
          {children}
        </div>
      </div>
    </div>
  );
}
