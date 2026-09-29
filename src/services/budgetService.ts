import type { Budget, BudgetInput } from "@/types";
import { uid } from "@/utils/format";
import { USE_MOCK, delay, request } from "./api";
import { getDB, mutateDB } from "./mockDb";

export const budgetService = {
  async getAll(): Promise<Budget[]> {
    if (!USE_MOCK) return request<Budget[]>("/budgets");
    await delay(150);
    return [...getDB().budgets];
  },
  async create(data: BudgetInput): Promise<Budget> {
    if (!USE_MOCK) return request<Budget>("/budgets", { method: "POST", body: JSON.stringify(data) });
    await delay();
    const b: Budget = { ...data, id: uid("bdg") };
    mutateDB((db) => db.budgets.push(b));
    return b;
  },
  async update(id: string, data: BudgetInput): Promise<Budget> {
    if (!USE_MOCK) return request<Budget>(`/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) });
    await delay();
    const b: Budget = { ...data, id };
    mutateDB((db) => {
      db.budgets = db.budgets.map((x) => (x.id === id ? b : x));
    });
    return b;
  },
  async delete(id: string): Promise<void> {
    if (!USE_MOCK) return request<void>(`/budgets/${id}`, { method: "DELETE" });
    await delay();
    mutateDB((db) => {
      db.budgets = db.budgets.filter((x) => x.id !== id);
    });
  },
};
