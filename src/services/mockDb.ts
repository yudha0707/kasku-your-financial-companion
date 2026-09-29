// In-browser mock "database" persisted to localStorage. Only used when USE_MOCK is true.
import { buildMockTransactions, mockAccounts, mockBudgets, mockCategories, mockDebts } from "@/data/mockData";
import type { Account, Budget, Category, Debt, Transaction } from "@/types";

const KEY = "kasku:db:v1";

export interface MockDB {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  debts: Debt[];
}

const seed = (): MockDB => ({
  transactions: buildMockTransactions(),
  categories: structuredClone(mockCategories),
  accounts: structuredClone(mockAccounts),
  budgets: structuredClone(mockBudgets),
  debts: structuredClone(mockDebts),
});

let cache: MockDB | null = null;

function persist() {
  if (typeof window !== "undefined" && cache) localStorage.setItem(KEY, JSON.stringify(cache));
}

export function getDB(): MockDB {
  if (cache) return cache;
  if (typeof window === "undefined") return seed();
  const raw = localStorage.getItem(KEY);
  try {
    cache = raw ? (JSON.parse(raw) as MockDB) : seed();
  } catch {
    cache = seed();
  }
  persist();
  return cache;
}

export function mutateDB(fn: (db: MockDB) => void) {
  const db = getDB();
  fn(db);
  persist();
}

export function resetDB() {
  cache = seed();
  persist();
}

export function exportDB(): string {
  return JSON.stringify(getDB(), null, 2);
}

export function importDB(json: string) {
  const parsed = JSON.parse(json) as MockDB;
  if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.accounts)) throw new Error("Format file tidak valid");
  cache = parsed;
  persist();
}
