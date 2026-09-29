import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatInputRupiah, parseRupiah } from "@/utils/currency";
import { COLOR_CHOICES, ICONS, colorVar } from "./icons";

export function MoneyInput({ id, value, onChange, large, invalid }: {
  id: string; value: number; onChange: (v: number) => void; large?: boolean; invalid?: boolean;
}) {
  return (
    <Input
      id={id}
      inputMode="numeric"
      autoComplete="off"
      placeholder="Rp0"
      aria-invalid={invalid}
      value={formatInputRupiah(value)}
      onChange={(e) => onChange(parseRupiah(e.target.value))}
      className={cn("tabular-nums", large && "h-14 text-2xl font-bold")}
    />
  );
}

export function IconPicker({ choices, value, onChange, color }: { choices: string[]; value: string; onChange: (v: string) => void; color: string }) {
  return (
    <div role="radiogroup" aria-label="Pilih icon" className="grid grid-cols-6 gap-2 sm:grid-cols-8">
      {choices.map((key) => {
        const Icon = ICONS[key]!;
        const active = key === value;
        return (
          <button
            type="button" key={key} role="radio" aria-checked={active} aria-label={key}
            onClick={() => onChange(key)}
            className={cn("grid aspect-square place-items-center rounded-xl border transition", active ? "border-transparent" : "hover:bg-muted")}
            style={active ? { backgroundColor: `color-mix(in oklab, ${colorVar(color)} 18%, transparent)`, color: colorVar(color), borderColor: colorVar(color) } : undefined}
          >
            <Icon className="size-5" />
          </button>
        );
      })}
    </div>
  );
}

export function ColorPicker({ value, onChange }: { value: string; onChange: (v: never) => void }) {
  return (
    <div role="radiogroup" aria-label="Pilih warna" className="flex flex-wrap gap-2">
      {COLOR_CHOICES.map((c) => (
        <button
          type="button" key={c} role="radio" aria-checked={c === value} aria-label={c}
          onClick={() => onChange(c as never)}
          className="grid size-8 place-items-center rounded-full ring-offset-2 ring-offset-background transition focus-visible:ring-2"
          style={{ backgroundColor: colorVar(c) }}
        >
          {c === value && <Check className="size-4 text-primary-foreground" />}
        </button>
      ))}
    </div>
  );
}
