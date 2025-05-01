
import { supabase } from '@/integrations/supabase/client';
import { Author } from '@/types/article.types';

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
  }
};
