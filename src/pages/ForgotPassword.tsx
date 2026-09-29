import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { authService } from "@/services/authService";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoadingButton } from "@/components/shared/States";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout title="Lupa kata sandi" subtitle="Kami akan mengirim tautan untuk mengatur ulang">
      {sent ? (
        <p className="rounded-xl bg-accent p-4 text-sm text-accent-foreground">Jika email terdaftar, tautan reset telah dikirim ke {email} (simulasi).</p>
      ) : (
        <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); setLoading(true); await authService.forgotPassword(email); setLoading(false); setSent(true); }}>
          <div className="space-y-1.5"><Label htmlFor="e">Email</Label><Input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <LoadingButton type="submit" className="w-full" size="lg" loading={loading}>Kirim tautan</LoadingButton>
        </form>
      )}
      <p className="text-center text-sm"><Link to="/login" className="font-semibold text-primary">Kembali ke Masuk</Link></p>
    </AuthLayout>
  );
}
