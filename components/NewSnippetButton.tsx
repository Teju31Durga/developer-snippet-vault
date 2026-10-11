"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import SnippetForm from "./SnippetForm";

export default function NewSnippetButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-bold text-white hover:bg-violet-700">
        <Plus size={18} /> New snippet
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">Create snippet</h2>
              <button onClick={() => setOpen(false)} className="rounded-lg border p-2"><X size={18} /></button>
            </div>
            <SnippetForm onDone={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
