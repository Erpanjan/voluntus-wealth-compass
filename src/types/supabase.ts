
import { Json } from "@/integrations/supabase/types";

export interface ArticleData {
  id?: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  content: Json;
  image_url: string;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthorData {
  id: string;
  name: string;
  image_url?: string;
}

export interface ArticleAuthor {
  article_id: string;
  author_id: string;
}

export interface ContactSubmission {
  first_name: string;
  last_name: string;
  contact_type: string;
  contact_info: string;
  message: string;
}

// Define tables structure to help TypeScript understand Supabase queries
export interface Tables {
  articles: ArticleData;
  authors: AuthorData;
  article_authors: ArticleAuthor;
  contact_submissions: ContactSubmission;
}

// This is a helper function to provide proper typing for Supabase queries
export const fromTable = <T extends keyof Tables>(table: T) => {
  return supabase.from(table);
};

// Re-export the supabase client to use in our hooks
import { supabase } from '@/integrations/supabase/client';
export { supabase };
