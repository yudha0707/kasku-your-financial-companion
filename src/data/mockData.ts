import type { Account, Budget, Category, Debt, Transaction, TransactionType, User } from "@/types";

export const DEMO_USER: User = {
  id: "usr_1",
  name: "Ananda",
  email: "ananda@example.com",
  phone: "0812-3456-7890",
  createdAt: "2026-01-10T08:00:00",
};

export const DEMO_CREDENTIALS = { email: "demo@example.com", password: "password" };

export const mockCategories: Category[] = [
  { id: "inc-gaji", name: "Gaji", type: "income", icon: "briefcase", color: "emerald" },
  { id: "inc-bonus", name: "Bonus", type: "income", icon: "gift", color: "amber" },
  { id: "inc-freelance", name: "Freelance", type: "income", icon: "laptop", color: "blue" },
  { id: "inc-bisnis", name: "Bisnis", type: "income", icon: "store", color: "violet" },
  { id: "inc-investasi", name: "Investasi", type: "income", icon: "trending-up", color: "teal" },
  { id: "inc-lain", name: "Lainnya", type: "income", icon: "circle-ellipsis", color: "slate" },
  { id: "exp-makan", name: "Makanan", type: "expense", icon: "utensils", color: "orange" },
  { id: "exp-transport", name: "Transportasi", type: "expense", icon: "car", color: "sky" },
  { id: "exp-belanja", name: "Belanja", type: "expense", icon: "shopping-bag", color: "pink" },
  { id: "exp-tagihan", name: "Tagihan", type: "expense", icon: "receipt", color: "red" },
  { id: "exp-pendidikan", name: "Pendidikan", type: "expense", icon: "graduation-cap", color: "indigo" },
  { id: "exp-kesehatan", name: "Kesehatan", type: "expense", icon: "heart-pulse", color: "green" },
  { id: "exp-hiburan", name: "Hiburan", type: "expense", icon: "film", color: "violet" },
  { id: "exp-rumah", name: "Rumah", type: "expense", icon: "home", color: "amber" },
  { id: "exp-internet", name: "Internet", type: "expense", icon: "wifi", color: "blue" },
  { id: "exp-lain", name: "Lainnya", type: "expense", icon: "circle-ellipsis", color: "slate" },
];

export const mockAccounts: Account[] = [
  { id: "acc-bca", name: "Bank BCA", type: "bank", balance: 5_500_000, icon: "landmark", color: "blue" },
  { id: "acc-mandiri", name: "Bank Mandiri", type: "bank", balance: 2_950_000, icon: "landmark", color: "amber" },
  { id: "acc-cash", name: "Cash", type: "cash", balance: 750_000, icon: "banknote", color: "green" },
  { id: "acc-ewallet", name: "E-Wallet", type: "ewallet", balance: 1_250_000, icon: "smartphone", color: "sky" },
  { id: "acc-tabungan", name: "Tabungan", type: "savings", balance: 2_000_000, icon: "piggy-bank", color: "emerald" },
];

type Row = [day: number, time: string, type: TransactionType, title: string, amount: number, cat: string | null, acc: string, extra?: { to?: string; note?: string; tags?: string[] }];

const september: Row[] = [
  [29, "12:15", "expense", "Makan siang", 35_000, "exp-makan", "acc-ewallet", { tags: ["kantor"] }],
  [29, "09:40", "income", "Freelance desain logo", 500_000, "inc-freelance", "acc-bca", { note: "Klien: Toko Sinar", tags: ["freelance"] }],
  [29, "08:05", "expense", "Kopi susu", 28_000, "exp-makan", "acc-ewallet"],
  [28, "17:30", "expense", "Bensin", 100_000, "exp-transport", "acc-cash"],
  [28, "10:00", "income", "Gaji", 7_500_000, "inc-gaji", "acc-bca", { note: "Gaji bulan September", tags: ["rutin"] }],
  [28, "10:30", "transfer", "Setor tabungan", 500_000, null, "acc-bca", { to: "acc-tabungan", tags: ["tabungan"] }],
  [27, "15:20", "expense", "Belanja bulanan", 685_000, "exp-belanja", "acc-bca", { note: "Supermarket", tags: ["keluarga"] }],
  [26, "19:00", "expense", "Nonton bioskop", 90_000, "exp-hiburan", "acc-ewallet", { tags: ["weekend"] }],
  [25, "08:00", "expense", "Listrik PLN", 450_000, "exp-tagihan", "acc-bca", { tags: ["rutin"] }],
  [25, "19:45", "expense", "Makan malam keluarga", 210_000, "exp-makan", "acc-mandiri", { tags: ["keluarga"] }],
  [24, "07:50", "expense", "Ojek online ke kantor", 42_000, "exp-transport", "acc-ewallet"],
  [23, "13:10", "expense", "Obat & vitamin", 125_000, "exp-kesehatan", "acc-cash"],
  [22, "09:00", "expense", "Internet rumah", 385_000, "exp-internet", "acc-bca", { tags: ["rutin"] }],
  [21, "20:00", "expense", "Kursus online", 199_000, "exp-pendidikan", "acc-mandiri"],
  [20, "12:30", "expense", "Makan siang", 32_000, "exp-makan", "acc-cash"],
  [19, "16:00", "expense", "Parkir & tol", 56_000, "exp-transport", "acc-cash"],
  [18, "14:00", "expense", "Kaos baru", 149_000, "exp-belanja", "acc-ewallet"],
  [17, "08:30", "expense", "Air PDAM", 98_000, "exp-tagihan", "acc-bca", { tags: ["rutin"] }],
  [16, "21:00", "expense", "Langganan musik", 55_000, "exp-hiburan", "acc-bca", { tags: ["langganan"] }],
  [15, "10:00", "income", "Bonus proyek", 500_000, "inc-bonus", "acc-bca"],
  [15, "07:30", "expense", "Sarapan", 25_000, "exp-makan", "acc-cash"],
  [14, "11:00", "expense", "Servis motor", 175_000, "exp-transport", "acc-cash"],
  [13, "15:30", "expense", "Perlengkapan rumah", 160_000, "exp-rumah", "acc-mandiri"],
  [12, "12:20", "expense", "Makan siang", 38_000, "exp-makan", "acc-ewallet"],
  [11, "09:15", "expense", "Pulsa & data", 100_000, "exp-internet", "acc-ewallet"],
  [10, "17:40", "expense", "Bensin", 100_000, "exp-transport", "acc-cash"],
  [9, "18:00", "expense", "Donasi", 50_000, "exp-lain", "acc-cash"],
  [8, "16:10", "expense", "Groceries", 230_000, "exp-belanja", "acc-mandiri", { tags: ["keluarga"] }],
  [7, "19:30", "expense", "Makan malam", 65_000, "exp-makan", "acc-ewallet"],
  [6, "14:45", "expense", "Buku", 120_000, "exp-pendidikan", "acc-mandiri"],
  [5, "10:20", "expense", "Gas LPG", 22_000, "exp-rumah", "acc-cash"],
  [4, "08:10", "expense", "Kopi", 27_000, "exp-makan", "acc-ewallet"],
  [3, "09:00", "expense", "BPJS Kesehatan", 150_000, "exp-kesehatan", "acc-bca", { tags: ["rutin"] }],
  [2, "12:00", "expense", "Makan siang", 34_000, "exp-makan", "acc-cash"],
  [2, "08:00", "transfer", "Top up e-wallet", 300_000, null, "acc-bca", { to: "acc-ewallet" }],
  [1, "18:30", "expense", "Arisan keluarga", 200_000, "exp-lain", "acc-cash", { tags: ["keluarga"] }],
];

// Deterministic pseudo-random generator for historical months.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

const templates: [string, string, number, number, string][] = [
  ["Makan siang", "exp-makan", 25_000, 60_000, "acc-ewallet"],
  ["Belanja bulanan", "exp-belanja", 400_000, 800_000, "acc-bca"],
  ["Bensin", "exp-transport", 80_000, 120_000, "acc-cash"],
  ["Listrik PLN", "exp-tagihan", 380_000, 480_000, "acc-bca"],
  ["Internet rumah", "exp-internet", 385_000, 385_000, "acc-bca"],
  ["Nonton / hiburan", "exp-hiburan", 50_000, 150_000, "acc-ewallet"],
  ["Obat", "exp-kesehatan", 40_000, 200_000, "acc-cash"],
  ["Makan malam", "exp-makan", 50_000, 220_000, "acc-mandiri"],
  ["Ojek online", "exp-transport", 20_000, 60_000, "acc-ewallet"],
  ["Perlengkapan rumah", "exp-rumah", 60_000, 250_000, "acc-mandiri"],
  ["Buku / kursus", "exp-pendidikan", 80_000, 250_000, "acc-mandiri"],
  ["Pakaian", "exp-belanja", 100_000, 350_000, "acc-ewallet"],
];

function history(): Row[] {
  const rows: Row[] = [];
  const rand = rng(42);
  // months 4..8 of 2026
  const out: { month: number; rows: Row[] }[] = [];
  for (let m = 4; m <= 8; m++) {
    const mr: Row[] = [[28, "10:00", "income", "Gaji", 7_500_000, "inc-gaji", "acc-bca", { tags: ["rutin"] }]];
    if (rand() > 0.4) mr.push([Math.ceil(rand() * 25), "11:00", "income", "Freelance", Math.round((300_000 + rand() * 1_200_000) / 1000) * 1000, "inc-freelance", "acc-bca"]);
    for (const t of templates) {
      const n = t[1] === "exp-makan" ? 3 : 1;
      for (let i = 0; i < n; i++) {
        const amt = Math.round((t[2] + rand() * (t[3] - t[2])) / 1000) * 1000;
        rows.length; // noop
        mr.push([1 + Math.floor(rand() * 27), `${String(8 + Math.floor(rand() * 12)).padStart(2, "0")}:${rand() > 0.5 ? "30" : "00"}`, "expense", t[0], amt, t[1], t[4]]);
      }
    }
    out.push({ month: m, rows: mr });
  }
  return out.flatMap(({ month, rows: r }) => r.map((row) => [row[0] + month * 100, ...row.slice(1)] as unknown as Row));
}

function toTx(row: Row, month: number, day: number, index: number): Transaction {
  const [, time, type, title, amount, cat, acc, extra] = row;
  const date = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const stamp = `${date}T${time}:00`;
  return {
    id: `trx_${month}_${index}`,
    type,
    title,
    amount,
    categoryId: cat,
    accountId: acc,
    toAccountId: extra?.to ?? null,
    date,
    time,
    note: extra?.note,
    tags: extra?.tags ?? [],
    attachment: null,
    status: "completed",
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export function buildMockTransactions(): Transaction[] {
  const sep = september.map((r, i) => toTx(r, 9, r[0], i));
  const hist = history().map((r, i) => {
    const encoded = r[0];
    return toTx(r, Math.floor(encoded / 100), encoded % 100, 1000 + i);
  });
  return [...sep, ...hist].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}

export const mockBudgets: Budget[] = [
  { id: "bdg_1", categoryId: "exp-makan", amount: 800_000, month: "2026-09" },
  { id: "bdg_2", categoryId: "exp-transport", amount: 750_000, month: "2026-09" },
  { id: "bdg_3", categoryId: "exp-belanja", amount: 1_000_000, month: "2026-09" },
  { id: "bdg_4", categoryId: "exp-hiburan", amount: 170_000, month: "2026-09" },
  { id: "bdg_5", categoryId: "exp-tagihan", amount: 600_000, month: "2026-09" },
  { id: "bdg_6", categoryId: "exp-pendidikan", amount: 400_000, month: "2026-09" },
];

export const mockDebts: Debt[] = [
  { id: "dbt_1", kind: "debt", person: "Budi", amount: 500_000, paid: 0, dueDate: "2026-10-05", note: "Pinjam untuk servis motor", createdAt: "2026-09-10T10:00:00" },
  { id: "dbt_2", kind: "debt", person: "Koperasi Kantor", amount: 2_000_000, paid: 1_200_000, dueDate: "2026-09-25", note: "Cicilan laptop", createdAt: "2026-06-01T10:00:00" },
  { id: "dbt_3", kind: "debt", person: "Rina", amount: 150_000, paid: 150_000, dueDate: "2026-09-15", createdAt: "2026-09-01T10:00:00" },
  { id: "dbt_4", kind: "receivable", person: "Andi", amount: 250_000, paid: 0, dueDate: "2026-10-02", note: "Patungan tiket konser", createdAt: "2026-09-20T10:00:00" },
  { id: "dbt_5", kind: "receivable", person: "Sari", amount: 400_000, paid: 400_000, dueDate: "2026-09-18", createdAt: "2026-09-05T10:00:00" },
  { id: "dbt_6", kind: "receivable", person: "Dimas", amount: 150_000, paid: 50_000, dueDate: "2026-09-20", note: "Makan bersama", createdAt: "2026-09-08T10:00:00" },
];
