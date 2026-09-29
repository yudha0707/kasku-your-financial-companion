import type { Category, CategoryInput } from "@/types";
import { uid } from "@/utils/format";
import { USE_MOCK, delay, request } from "./api";
import { getDB, mutateDB } from "./mockDb";

export const categoryService = {
  async getAll(): Promise<Category[]> {
    if (!USE_MOCK) return request<Category[]>("/categories");
    await delay(150);
    return [...getDB().categories];
  },
  async create(data: CategoryInput): Promise<Category> {
    if (!USE_MOCK) return request<Category>("/categories", { method: "POST", body: JSON.stringify(data) });
    await delay();
    const c: Category = { ...data, id: uid("cat") };
    mutateDB((db) => db.categories.push(c));
    return c;
  },
  async update(id: string, data: CategoryInput): Promise<Category> {
    if (!USE_MOCK) return request<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
    await delay();
    const c: Category = { ...data, id };
    mutateDB((db) => {
      db.categories = db.categories.map((x) => (x.id === id ? c : x));
    });
    return c;
  },
  async delete(id: string): Promise<void> {
    if (!USE_MOCK) return request<void>(`/categories/${id}`, { method: "DELETE" });
    await delay();
    mutateDB((db) => {
      db.categories = db.categories.filter((x) => x.id !== id);
    });
  },
};
