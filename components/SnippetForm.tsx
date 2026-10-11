"use client";

import { useState } from "react";
import { createSnippet, updateSnippet } from "@/app/dashboard/actions";
import type { Snippet } from "@/lib/types";

const languages = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C",
  "C++",
  "HTML",
  "CSS",
  "SQL",
  "JSON",
  "Bash",
  "Markdown",
  "Text",
  "Other"
];

export default function SnippetForm({ snippet, onDone }: { snippet?: Snippet; onDone?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      if (snippet) {
        formData.set("id", snippet.id);
        await updateSnippet(formData);
      } else {
        await createSnippet(formData);
      }
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={submit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-semibold">Title</label>
        <input name="title" required defaultValue={snippet?.title} placeholder="e.g. Fetch active users"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-violet-500" />
      </div>
      
<div>
  <label className="mb-1 block text-sm font-semibold">
    Description (Optional)
  </label>
  <textarea
    name="description"
    defaultValue={snippet?.description ?? ""}
    rows={3}
    placeholder="What is this snippet used for?"
    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-violet-500"
  />
</div>

      <div>
        <label className="mb-1 block text-sm font-semibold">Language / Syntax</label>
        <select name="language" defaultValue={snippet?.language || ""} required
          className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-violet-500">
            <option value="" disabled>
      Select language
    </option>
          {languages.map(lang => <option key={lang}>{lang}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">Code / Content</label>
        <textarea name="code" required defaultValue={snippet?.code} rows={14} placeholder="Paste your code / content here..."
          className="code-font w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-violet-500" />
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white hover:bg-violet-700 disabled:opacity-60">
        {loading ? "Saving + generating AI metadata..." : snippet ? "Update snippet" : "Save snippet"}
      </button>
    </form>
  );
}
