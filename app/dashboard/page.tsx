"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import SnippetCard from "@/components/SnippetCard";
import NewSnippetButton from "@/components/NewSnippetButton";
import SignOutButton from "@/components/SignOutButton";
import type { Snippet } from "@/lib/types";


export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSnippets() {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      setUserEmail(user.email ?? "");

      const { data, error: dbError } = await supabase
        .from("snippets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (dbError) {
        setError(dbError.message);
      } else {
        setSnippets((data ?? []) as Snippet[]);
      }

      setLoading(false);
    }

    loadSnippets();
  }, [router]);

  const filteredSnippets = snippets.filter((snippet) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    const searchableText = [
      snippet.title,
      snippet.description,
      snippet.code,
      snippet.language,
      snippet.ai_summary,
      ...(snippet.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-xl font-black">⚡ Developer Snippet Vault</h1>
            <p className="text-xs text-slate-500">{userEmail}</p>
          </div>
          <SignOutButton />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              PRIVATE WORKSPACE
            </p>
            <h2 className="mt-1 text-4xl font-black">Your snippets</h2>
            <p className="mt-2 text-slate-500">
              Save once. Gemini tags and explains it automatically.
            </p>
          </div>

          <NewSnippetButton />
        </div>

        <div className="mb-6">
          <label
            htmlFor="snippet-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search snippets
          </label>

          <input
            id="snippet-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, code, language, or tags..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          {!loading && !error && (
            <p className="mt-2 text-sm text-slate-500">
              Showing {filteredSnippets.length} of {snippets.length} snippets
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-700">
            Database error: {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-slate-500">
            Loading your snippets...
          </div>
        ) : !error && filteredSnippets.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-16 text-center">
            <div className="text-5xl">🗂️</div>
            <h3 className="mt-4 text-xl font-bold">
              {search ? "No matching snippets" : "Your vault is empty"}
            </h3>
            <p className="mt-2 text-slate-500">
              {search
                ? "Try another title, language, code keyword, or tag."
                : "Create your first snippet and let Gemini organize it."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          !error && (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredSnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          )
        )}
      </section>
    </main>
  );
}
