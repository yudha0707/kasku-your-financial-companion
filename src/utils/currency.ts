const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** 1000000 -> "Rp 1.000.000" */
export const formatRupiah = (value: number) => rupiah.format(value);

/** Signed display for transactions: "+ Rp 500.000" / "- Rp 35.000" */
export const formatSigned = (value: number, type: "income" | "expense" | "transfer") =>
  `${type === "income" ? "+" : type === "expense" ? "-" : ""} ${formatRupiah(value)}`.trim();

/** Short axis labels: 1500000 -> "1,5jt" */
export const formatCompact = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`;
  if (abs >= 1_000) return `${Math.round(value / 1_000)}rb`;
  return String(value);
};

/** Input display: 1000 -> "Rp1.000" (empty for 0) */
export const formatInputRupiah = (value: number) => (value ? `Rp${value.toLocaleString("id-ID")}` : "");

/** "Rp1.000.000" -> 1000000 */
export const parseRupiah = (text: string) => Number(text.replace(/\D/g, "")) || 0;
