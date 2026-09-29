import { cn } from "@/lib/utils";
import { ICONS, colorVar } from "./icons";

interface Props {
  icon: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "size-8 rounded-lg [&_svg]:size-4", md: "size-10 rounded-xl [&_svg]:size-5", lg: "size-12 rounded-2xl [&_svg]:size-6" };

export function IconBadge({ icon, color, size = "md", className }: Props) {
  const Icon = ICONS[icon] ?? ICONS["circle-ellipsis"]!;
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center", sizes[size], className)}
      style={{ backgroundColor: `color-mix(in oklab, ${colorVar(color)} 16%, transparent)`, color: colorVar(color) }}
    >
      <Icon />
    </span>
  );
}
