"use client";

import { useState } from "react";
import { Pencil, Trash2, Sparkles } from "lucide-react";
import type { Snippet } from "@/lib/types";
import { deleteSnippet } from "@/app/dashboard/actions";
import SnippetForm from "./SnippetForm";

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    if (!confirm("Delete this snippet?")) return;
    setDeleting(true);
    const fd = new FormData();
    fd.set("id", snippet.id);
    await deleteSnippet(fd);
    setDeleting(false);
  }

  if (editing) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold">Edit snippet</h3>
          <button onClick={() => setEditing(false)} className="text-sm text-slate-500">Cancel</button>
        </div>
        <SnippetForm snippet={snippet} onDone={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-soft">
      <div className="flex items-start justify-between gap-4 border-b p-5">
        <div>
          <h3 className="text-xl font-bold">{snippet.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{snippet.language}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} title="Edit" className="rounded-lg border p-2 hover:bg-slate-50"><Pencil size={16} /></button>
          <button onClick={remove} disabled={deleting} title="Delete" className="rounded-lg border p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
        </div>
      </div>

      <pre className="code-font max-h-80 overflow-auto bg-slate-950 p-5 text-sm leading-6 text-slate-200">
        <code>{snippet.code}</code>
      </pre>

      <div className="p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-violet-700">
          <Sparkles size={16} /> Gemini AI
        </div>
        <p className="mt-2 text-sm text-slate-600">{snippet.ai_summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {snippet.tags.map(tag => (
            <span key={tag} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">#{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
