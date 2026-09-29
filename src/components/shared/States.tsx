import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: {
  icon?: LucideIcon; title: string; description?: string; action?: ReactNode; className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center", className)}>
      <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
        <Icon className="size-6" />
      </span>
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = "Terjadi kesalahan", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <h3 className="font-semibold">Terjadi kesalahan</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RotateCcw /> Coba lagi
        </Button>
      )}
    </div>
  );
}

export function Spinner({ className, label = "Memuat" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <Loader2 className={cn("size-5 animate-spin text-primary", className)} />
    </span>
  );
}

export function LoadingButton({ loading, children, disabled, ...props }: ButtonProps & { loading?: boolean }) {
  return (
    <Button disabled={disabled || loading} aria-busy={loading} {...props}>
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Memuat halaman">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-44 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
    </div>
  );
}
