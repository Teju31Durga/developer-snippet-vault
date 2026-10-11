
import { GoogleGenAI } from "@google/genai";

export async function generateSnippetMetadata(
  code: string,
  language: string
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      tags: [language.toLowerCase(), "code", "snippet"].slice(0, 3),
      ai_summary: `A ${language} code snippet saved in the Developer Snippet Vault.`,
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const prompt = `Analyze this developer code snippet.

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON with this exact shape:
{
  "tags": ["tag1", "tag2", "tag3"],
  "ai_summary": "One sentence in plain English."
}

Rules:
- Provide 3 to 5 short, relevant tags.
- Tags must not contain #.
- Summary must be exactly one sentence.
- Do not include markdown or extra text.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const raw = response.text?.trim() || "";
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    const tags = Array.isArray(parsed.tags)
      ? parsed.tags
          .map((tag: unknown) => String(tag).replace(/^#/, "").trim())
          .filter(Boolean)
          .slice(0, 5)
      : [];

    return {
      tags: tags.length
        ? tags
        : [language.toLowerCase(), "code", "snippet"],
      ai_summary: String(
        parsed.ai_summary || "A reusable developer code snippet."
      ),
    };
  } catch {
    return {
      tags: [language.toLowerCase(), "code", "snippet"].slice(0, 3),
      ai_summary: `A ${language} code snippet saved in the Developer Snippet Vault.`,
    };
  }
}
