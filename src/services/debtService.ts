import type { Debt, DebtInput } from "@/types";
import { uid } from "@/utils/format";
import { USE_MOCK, delay, request } from "./api";
import { getDB, mutateDB } from "./mockDb";

export const debtService = {
  async getAll(): Promise<Debt[]> {
    if (!USE_MOCK) return request<Debt[]>("/debts");
    await delay(150);
    return [...getDB().debts];
  },
  async create(data: DebtInput): Promise<Debt> {
    if (!USE_MOCK) return request<Debt>("/debts", { method: "POST", body: JSON.stringify(data) });
    await delay();
    const d: Debt = { ...data, id: uid("dbt"), createdAt: new Date().toISOString() };
    mutateDB((db) => db.debts.push(d));
    return d;
  },
  async update(id: string, data: DebtInput): Promise<Debt> {
    if (!USE_MOCK) return request<Debt>(`/debts/${id}`, { method: "PUT", body: JSON.stringify(data) });
    await delay();
    let d: Debt | undefined;
    mutateDB((db) => {
      db.debts = db.debts.map((x) => (x.id === id ? (d = { ...x, ...data }) : x));
    });
    return d!;
  },
  async delete(id: string): Promise<void> {
    if (!USE_MOCK) return request<void>(`/debts/${id}`, { method: "DELETE" });
    await delay();
    mutateDB((db) => {
      db.debts = db.debts.filter((x) => x.id !== id);
    });
  },
};
