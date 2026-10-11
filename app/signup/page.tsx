"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else if (data.session) router.push("/dashboard");
    else setMessage("Account created. Check your email to confirm your account, then sign in.");
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <Link href="/" className="text-sm text-violet-600">← Home</Link>
        <h1 className="mt-5 text-3xl font-black">Create your vault</h1>
        <p className="mt-2 text-slate-500">Your snippets stay private to your account.</p>
        <div className="mt-7 space-y-4">
          <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-violet-500" />
          <input required minLength={6} type="password" placeholder="Password (6+ characters)" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-violet-500" />
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          {message && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white hover:bg-violet-700 disabled:opacity-60">
            {loading ? "Creating..." : "Create account"}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="font-semibold text-violet-600">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
