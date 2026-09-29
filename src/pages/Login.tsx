import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/store/AppContext";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoadingButton } from "@/components/shared/States";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CREDENTIALS } from "@/data/mockData";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout title="Masuk" subtitle="Selamat datang kembali di KASKU">
      <form className="space-y-4" onSubmit={async (e) => {
        e.preventDefault(); setError(""); setLoading(true);
        try { await login(email, password); void navigate({ to: "/" }); } catch (err) { setError(err instanceof Error ? err.message : "Gagal masuk"); } finally { setLoading(false); }
      }}>
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5">
          <div className="flex justify-between"><Label htmlFor="pw">Kata sandi</Label><Link to="/forgot-password" className="text-xs font-medium text-primary">Lupa kata sandi?</Link></div>
          <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <LoadingButton type="submit" className="w-full" size="lg" loading={loading}>Masuk</LoadingButton>
        <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">Demo: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}</p>
        <p className="text-center text-sm">Belum punya akun? <Link to="/register" className="font-semibold text-primary">Daftar</Link></p>
      </form>
    </AuthLayout>
  );
}
