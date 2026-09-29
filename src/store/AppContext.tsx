import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type {
  Account, AccountInput, Budget, BudgetInput, Category, CategoryInput, Debt, DebtInput,
  Theme, Transaction, TransactionInput, User,
} from "@/types";
import { transactionService } from "@/services/transactionService";
import { categoryService } from "@/services/categoryService";
import { accountService } from "@/services/accountService";
import { budgetService } from "@/services/budgetService";
import { debtService } from "@/services/debtService";
import { authService } from "@/services/authService";
import { resetDB } from "@/services/mockDb";

interface DataState {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  debts: Debt[];
}

interface AppContextValue extends DataState {
  ready: boolean;
  authReady: boolean;
  error: string | null;
  user: User | null;
  theme: Theme;
  setTheme: (t: Theme) => void;
  reload: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Pick<User, "name" | "email" | "phone">) => Promise<void>;
  addTransaction: (d: TransactionInput) => Promise<void>;
  updateTransaction: (id: string, d: TransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  saveCategory: (d: CategoryInput, id?: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveAccount: (d: AccountInput, id?: string) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  saveBudget: (d: BudgetInput, id?: string) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  saveDebt: (d: DebtInput, id?: string) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  resetData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);
const THEME_KEY = "kasku:theme";
const empty: DataState = { transactions: [], categories: [], accounts: [], budgets: [], debts: [] };

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataState>(empty);
  const [ready, setReady] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setThemeState] = useState<Theme>("system");

  const reload = useCallback(async () => {
    setReady(false);
    setError(null);
    try {
      const [transactions, categories, accounts, budgets, debts] = await Promise.all([
        transactionService.getAll(), categoryService.getAll(), accountService.getAll(),
        budgetService.getAll(), debtService.getAll(),
      ]);
      setData({ transactions, categories, accounts, budgets, debts });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    authService.me().then((u) => {
      setUser(u);
      setAuthReady(true);
    });
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored) setThemeState(stored);
    void reload();
  }, [reload]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  }, []);

  const refresh = useCallback(async (keys: (keyof DataState)[]) => {
    const loaders: Record<keyof DataState, () => Promise<unknown>> = {
      transactions: transactionService.getAll, categories: categoryService.getAll,
      accounts: accountService.getAll, budgets: budgetService.getAll, debts: debtService.getAll,
    };
    const results = await Promise.all(keys.map((k) => loaders[k]()));
    setData((prev) => {
      const next = { ...prev };
      keys.forEach((k, i) => Object.assign(next, { [k]: results[i] }));
      return next;
    });
  }, []);

  const run = useCallback(async (fn: () => Promise<unknown>, keys: (keyof DataState)[], success: string) => {
    try {
      await fn();
      await refresh(keys);
      toast.success(success);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Terjadi kesalahan");
      throw e;
    }
  }, [refresh]);

  const value = useMemo<AppContextValue>(() => ({
    ...data, ready, authReady, error, user, theme, setTheme, reload,
    login: async (email, password) => { setUser(await authService.login(email, password)); },
    register: async (name, email, password) => { setUser(await authService.register(name, email, password)); },
    logout: async () => { await authService.logout(); setUser(null); },
    updateProfile: async (d) => { setUser(await authService.updateProfile(d)); toast.success("Profil berhasil diperbarui"); },
    addTransaction: (d) => run(() => transactionService.create(d), ["transactions", "accounts"], "Transaksi berhasil ditambahkan"),
    updateTransaction: (id, d) => run(() => transactionService.update(id, d), ["transactions", "accounts"], "Transaksi berhasil diedit"),
    deleteTransaction: (id) => run(() => transactionService.delete(id), ["transactions", "accounts"], "Transaksi berhasil dihapus"),
    saveCategory: (d, id) => run(() => (id ? categoryService.update(id, d) : categoryService.create(d)), ["categories"], id ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan"),
    deleteCategory: (id) => run(() => categoryService.delete(id), ["categories"], "Kategori berhasil dihapus"),
    saveAccount: (d, id) => run(() => (id ? accountService.update(id, d) : accountService.create(d)), ["accounts"], id ? "Rekening berhasil diperbarui" : "Rekening berhasil ditambahkan"),
    deleteAccount: (id) => run(() => accountService.delete(id), ["accounts"], "Rekening berhasil dihapus"),
    saveBudget: (d, id) => run(() => (id ? budgetService.update(id, d) : budgetService.create(d)), ["budgets"], id ? "Anggaran berhasil diperbarui" : "Anggaran berhasil dibuat"),
    deleteBudget: (id) => run(() => budgetService.delete(id), ["budgets"], "Anggaran berhasil dihapus"),
    saveDebt: (d, id) => run(() => (id ? debtService.update(id, d) : debtService.create(d)), ["debts"], id ? "Data berhasil diperbarui" : "Data berhasil ditambahkan"),
    deleteDebt: (id) => run(() => debtService.delete(id), ["debts"], "Data berhasil dihapus"),
    resetData: async () => { resetDB(); await reload(); toast.success("Data berhasil direset"); },
  }), [data, ready, authReady, error, user, theme, setTheme, reload, run]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function useLookups() {
  const { categories, accounts } = useApp();
  return useMemo(() => ({
    category: (id: string | null | undefined) => categories.find((c) => c.id === id),
    account: (id: string | null | undefined) => accounts.find((a) => a.id === id),
  }), [categories, accounts]);
}
