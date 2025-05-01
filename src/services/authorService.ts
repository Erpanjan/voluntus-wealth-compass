
import { supabase } from '@/integrations/supabase/client';
import { Author } from '@/types/article.types';

export interface CreateAuthorInput {
  name: string;
  bio?: string;
  image_url?: string;
}

export const authorService = {
  /**
   * Get all available authors
   * @returns List of all authors
   */
  async getAuthors(): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching authors:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAuthors:', error);
      return [];
    }
  },

  /**
   * Create a new author
   * @param authorData Author information to create
   * @returns The created author or null if failed
   */
  async createAuthor(authorData: CreateAuthorInput): Promise<Author | null> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .insert([{
          name: authorData.name,
          bio: authorData.bio || null,
          image_url: authorData.image_url || null
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating author:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in createAuthor:', error);
      return null;
    }
  }
};
