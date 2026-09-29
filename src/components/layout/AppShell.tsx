import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeftRight, BarChart3, HandCoins, Home, LayoutDashboard, Moon, PieChart, Plus, Settings,
  Sun, Tags, User, Wallet, LogOut,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { initials } from "@/utils/format";
import { cn } from "@/lib/utils";

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2 font-bold tracking-tight">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Wallet className="size-5" />
      </span>
      {!compact && <span className="text-lg">KASKU</span>}
    </span>
  );
}

const mainNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { to: "/reports", label: "Laporan", icon: BarChart3 },
  { to: "/budgets", label: "Anggaran", icon: PieChart },
  { to: "/debts", label: "Utang & Piutang", icon: HandCoins },
  { to: "/categories", label: "Kategori", icon: Tags },
  { to: "/accounts", label: "Rekening", icon: Wallet },
] as const;

const accountNav = [
  { to: "/profile", label: "Profil", icon: User },
  { to: "/settings", label: "Pengaturan", icon: Settings },
] as const;

function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const isDark = theme === "dark" || (theme === "system" && typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Gunakan mode terang" : "Gunakan mode gelap"}
      className="grid size-10 place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}

const sideLink = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:justify-center lg:justify-start";
const sideActive = "bg-sidebar-accent text-sidebar-accent-foreground";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useApp();
  return (
    <div className="min-h-screen">
      {/* Sidebar: icons on tablet, full on desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r bg-sidebar px-3 py-5 md:flex lg:w-64 lg:px-4">
        <Link to="/" className="mb-6 flex justify-center lg:justify-start lg:px-2" aria-label="KASKU beranda">
          <span className="lg:hidden"><Logo compact /></span>
          <span className="hidden lg:inline"><Logo /></span>
        </Link>
        <Link
          to="/transactions/new"
          className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus className="size-5" /> <span className="hidden lg:inline">Tambah Transaksi</span>
        </Link>
        <nav aria-label="Navigasi utama" className="flex flex-1 flex-col gap-1">
          {mainNav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} title={label} className={sideLink} activeProps={{ className: sideActive }} activeOptions={{ exact: to === "/" }}>
              <Icon className="size-5 shrink-0" /> <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
          <div className="my-3 border-t" />
          {accountNav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} title={label} className={sideLink} activeProps={{ className: sideActive }}>
              <Icon className="size-5 shrink-0" /> <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-4 flex items-center gap-3 rounded-xl border p-2 md:flex-col lg:flex-row">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
            {initials(user?.name ?? "A")}
          </span>
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <button type="button" onClick={() => void logout()} aria-label="Keluar" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/85 px-4 py-2.5 backdrop-blur md:hidden">
        <Link to="/" aria-label="KASKU beranda"><Logo /></Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link to="/settings" aria-label="Pengaturan" className="grid size-10 place-items-center rounded-xl text-muted-foreground hover:bg-muted">
            <Settings className="size-5" />
          </Link>
        </div>
      </header>

      <div className="md:pl-20 lg:pl-64">
        <div className="sticky top-0 z-20 hidden justify-end border-b bg-background/85 px-8 py-2 backdrop-blur md:flex">
          <ThemeToggle />
        </div>
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 md:pb-10 lg:px-8 lg:pt-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav aria-label="Navigasi bawah" className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5 items-end px-2">
          <BottomLink to="/" icon={Home} label="Beranda" />
          <BottomLink to="/transactions" icon={ArrowLeftRight} label="Transaksi" />
          <div className="flex justify-center">
            <Link
              to="/transactions/new"
              aria-label="Tambah transaksi"
              className="-mt-6 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition active:scale-95"
            >
              <Plus className="size-7" />
            </Link>
          </div>
          <BottomLink to="/reports" icon={BarChart3} label="Laporan" />
          <BottomLink to="/profile" icon={User} label="Profil" />
        </div>
      </nav>
    </div>
  );
}

function BottomLink({ to, icon: Icon, label }: { to: "/" | "/transactions" | "/reports" | "/profile"; icon: typeof Home; label: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground")}
      activeProps={{ className: "text-primary" }}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
}
