export const percent = (value: number, total: number) => (total > 0 ? Math.round((value / total) * 100) : 0);

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

export const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const accountTypeLabel: Record<string, string> = {
  bank: "Bank",
  cash: "Tunai",
  ewallet: "E-Wallet",
  savings: "Tabungan",
};

export const txTypeLabel: Record<string, string> = {
  income: "Pemasukan",
  expense: "Pengeluaran",
  transfer: "Transfer",
};
