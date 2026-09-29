import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/store/AppContext";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoadingButton } from "@/components/shared/States";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout title="Buat akun" subtitle="Mulai catat keuanganmu hari ini">
      <form className="space-y-4" onSubmit={async (e) => {
        e.preventDefault(); setError("");
        if (f.password.length < 6) return setError("Kata sandi minimal 6 karakter");
        setLoading(true);
        try { await register(f.name, f.email, f.password); void navigate({ to: "/" }); } catch (err) { setError(err instanceof Error ? err.message : "Gagal daftar"); } finally { setLoading(false); }
      }}>
        <div className="space-y-1.5"><Label htmlFor="n">Nama</Label><Input id="n" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="space-y-1.5"><Label htmlFor="e">Email</Label><Input id="e" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="space-y-1.5"><Label htmlFor="p">Kata sandi</Label><Input id="p" type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <LoadingButton type="submit" className="w-full" size="lg" loading={loading}>Daftar</LoadingButton>
        <p className="text-center text-sm">Sudah punya akun? <Link to="/login" className="font-semibold text-primary">Masuk</Link></p>
      </form>
    </AuthLayout>
  );
}
