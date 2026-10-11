
export type Snippet = {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  code: string;
  language: string;
  tags: string[];
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
};
