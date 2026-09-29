// Domain types. Field names map 1:1 to future REST API / MySQL columns (camelCase in JSON).

export type TransactionType = "income" | "expense" | "transfer";
export type CategoryType = "income" | "expense";
export type TransactionStatus = "completed" | "pending";
export type PaymentMethod = "cash" | "debit" | "credit" | "ewallet" | "transfer";
export type AccountType = "bank" | "cash" | "ewallet" | "savings";
export type DebtKind = "debt" | "receivable";
export type DebtStatus = "unpaid" | "overdue" | "paid";
export type Theme = "light" | "dark" | "system";
export type ColorKey =
  | "emerald" | "green" | "teal" | "sky" | "blue" | "indigo"
  | "violet" | "pink" | "red" | "orange" | "amber" | "slate";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | undefined;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: ColorKey;
}
export type CategoryInput = Omit<Category, "id">;

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  icon: string;
  color: ColorKey;
}
export type AccountInput = Omit<Account, "id">;

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number; // raw number, never formatted
  categoryId: string | null; // null for transfer
  accountId: string;
  toAccountId?: string | null | undefined; // transfer target
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note?: string | undefined;
  tags: string[];
  attachment?: string | null | undefined;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod | undefined;
  createdAt: string;
  updatedAt: string;
}
export type TransactionInput = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM
}
export type BudgetInput = Omit<Budget, "id">;

export interface Debt {
  id: string;
  kind: DebtKind;
  person: string;
  amount: number;
  paid: number;
  dueDate: string;
  note?: string | undefined;
  createdAt: string;
}
export type Receivable = Debt & { kind: "receivable" };
export type DebtInput = Omit<Debt, "id" | "createdAt">;
