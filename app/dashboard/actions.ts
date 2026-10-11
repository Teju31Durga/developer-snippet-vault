"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateSnippetMetadata } from "@/lib/gemini";

async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

// Create a new snippet
export async function createSnippet(formData: FormData) {
  const { supabase, user } = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const code = String(formData.get("code") || "");
  const language = String(formData.get("language") || "text");

  if (!title || !code.trim()) {
    throw new Error("Title and code are required.");
  }

  // Generate AI tags and summary
  const ai = await generateSnippetMetadata(code, language);

  const { error } = await supabase.from("snippets").insert({
    user_id: user.id,
    title,
    description: description || null,
    code,
    language,
    tags: ai.tags,
    ai_summary: ai.ai_summary,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

// Update an existing snippet
export async function updateSnippet(formData: FormData) {
  const { supabase, user } = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const code = String(formData.get("code") || "");
  const language = String(formData.get("language") || "text");

  if (!id) {
    throw new Error("Snippet ID is required.");
  }

  if (!title || !code.trim()) {
    throw new Error("Title and code are required.");
  }

  // Regenerate AI tags and summary after editing
  const ai = await generateSnippetMetadata(code, language);

  const { error } = await supabase
    .from("snippets")
    .update({
      title,
      description: description || null,
      code,
      language,
      tags: ai.tags,
      ai_summary: ai.ai_summary,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

// Delete a snippet
export async function deleteSnippet(formData: FormData) {
  const { supabase, user } = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Snippet ID is required.");
  }

  const { error } = await supabase
    .from("snippets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

// Sign out the current user
export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/");
}