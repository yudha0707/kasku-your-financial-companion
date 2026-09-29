import type { Account, AccountInput } from "@/types";
import { uid } from "@/utils/format";
import { USE_MOCK, delay, request } from "./api";
import { getDB, mutateDB } from "./mockDb";

export const accountService = {
  async getAll(): Promise<Account[]> {
    if (!USE_MOCK) return request<Account[]>("/accounts");
    await delay(150);
    return [...getDB().accounts];
  },
  async create(data: AccountInput): Promise<Account> {
    if (!USE_MOCK) return request<Account>("/accounts", { method: "POST", body: JSON.stringify(data) });
    await delay();
    const a: Account = { ...data, id: uid("acc") };
    mutateDB((db) => db.accounts.push(a));
    return a;
  },
  async update(id: string, data: AccountInput): Promise<Account> {
    if (!USE_MOCK) return request<Account>(`/accounts/${id}`, { method: "PUT", body: JSON.stringify(data) });
    await delay();
    const a: Account = { ...data, id };
    mutateDB((db) => {
      db.accounts = db.accounts.map((x) => (x.id === id ? a : x));
    });
    return a;
  },
  async delete(id: string): Promise<void> {
    if (!USE_MOCK) return request<void>(`/accounts/${id}`, { method: "DELETE" });
    await delay();
    mutateDB((db) => {
      db.accounts = db.accounts.filter((x) => x.id !== id);
    });
  },
};
