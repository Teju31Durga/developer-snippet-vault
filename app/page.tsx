import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold">⚡ Snippet Vault</div>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm hover:bg-white/10">Login</Link>
          <Link href="/signup" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500">Get Started</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-20 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-sm text-violet-200">
            Gemini-powered developer workspace
          </div>
          <h1 className="text-5xl font-black leading-tight md:text-6xl">
            Save code.<br />Find it faster.<br /><span className="text-violet-300">Let AI organize it.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Store reusable snippets and technical notes in one private vault. Gemini automatically creates useful tags and a plain-English summary whenever you save code.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-xl bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-100">Create free vault →</Link>
            <Link href="/login" className="rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10">Sign in</Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-2">async-fetch.ts</span>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm leading-7 text-slate-200"><code>{`const response = await fetch(url);
const data = await response.json();

return data.items.filter(
  item => item.active
);`}</code></pre>
          <div className="mt-4 flex flex-wrap gap-2">
            {["typescript", "async", "fetch", "filter"].map(tag => (
              <span key={tag} className="rounded-full bg-violet-500/15 px-3 py-1 text-xs text-violet-200">#{tag}</span>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-300">AI summary: Filters API results to return only active items.</p>
        </div>
      </section>
    </main>
  );
}
