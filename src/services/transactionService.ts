import type { Transaction, TransactionInput } from "@/types";
import { uid } from "@/utils/format";
import { USE_MOCK, delay, request } from "./api";
import { getDB, mutateDB, type MockDB } from "./mockDb";

const sortDesc = (a: Transaction, b: Transaction) => (b.date + b.time).localeCompare(a.date + a.time);

// Mirrors what the backend should do: keep account balances in sync with transactions.
function applyBalance(db: MockDB, t: Transaction, sign: 1 | -1) {
  const acc = db.accounts.find((a) => a.id === t.accountId);
  if (acc) acc.balance += t.type === "income" ? sign * t.amount : -sign * t.amount;
  if (t.type === "transfer" && t.toAccountId) {
    const to = db.accounts.find((a) => a.id === t.toAccountId);
    if (to) to.balance += sign * t.amount;
  }
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    if (!USE_MOCK) return request<Transaction[]>("/transactions");
    await delay();
    return [...getDB().transactions].sort(sortDesc);
  },

  async getById(id: string): Promise<Transaction | undefined> {
    if (!USE_MOCK) return request<Transaction>(`/transactions/${id}`);
    await delay(100);
    return getDB().transactions.find((t) => t.id === id);
  },

  async create(data: TransactionInput): Promise<Transaction> {
    if (!USE_MOCK) return request<Transaction>("/transactions", { method: "POST", body: JSON.stringify(data) });
    await delay();
    const now = new Date().toISOString();
    const tx: Transaction = { ...data, id: uid("trx"), createdAt: now, updatedAt: now };
    mutateDB((db) => {
      db.transactions.push(tx);
      applyBalance(db, tx, 1);
    });
    return tx;
  },

  async update(id: string, data: TransactionInput): Promise<Transaction> {
    if (!USE_MOCK) return request<Transaction>(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) });
    await delay();
    let updated: Transaction | undefined;
    mutateDB((db) => {
      const i = db.transactions.findIndex((t) => t.id === id);
      const old = db.transactions[i];
      if (!old) throw new Error("Transaksi tidak ditemukan");
      applyBalance(db, old, -1);
      updated = { ...old, ...data, updatedAt: new Date().toISOString() };
      db.transactions[i] = updated;
      applyBalance(db, updated, 1);
    });
    return updated!;
  },

  async delete(id: string): Promise<void> {
    if (!USE_MOCK) return request<void>(`/transactions/${id}`, { method: "DELETE" });
    await delay();
    mutateDB((db) => {
      const old = db.transactions.find((t) => t.id === id);
      if (old) applyBalance(db, old, -1);
      db.transactions = db.transactions.filter((t) => t.id !== id);
    });
  },
};
