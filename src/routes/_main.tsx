import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState, PageSkeleton } from "@/components/shared/States";
import { useApp } from "@/store/AppContext";

export const Route = createFileRoute("/_main")({ component: MainLayout });

function MainLayout() {
  const { ready, authReady, user, error, reload } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (authReady && !user) void navigate({ to: "/login" });
  }, [authReady, user, navigate]);
  return (
    <AppShell>
      {!ready || !authReady || !user ? <PageSkeleton /> : error ? <ErrorState message={error} onRetry={() => void reload()} /> : <Outlet />}
    </AppShell>
  );
}
