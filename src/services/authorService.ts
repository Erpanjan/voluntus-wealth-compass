
import { Author } from '@/types/article.types';

export interface CreateAuthorInput {
  name: string;
  bio?: string;
  image_url?: string;
}

export const authorService = {
  /**
   * Get all available authors - now returns empty array since authors table was deleted
   * @returns Empty list of authors
   */
  async getAuthors(): Promise<Author[]> {
    try {
      console.log('Authors table no longer exists, returning empty array');
      return [];
    } catch (error) {
      console.error('Error in getAuthors:', error);
      return [];
    }
  },

  /**
   * Create a new author - now returns null since authors table was deleted
   * @param authorData Author information to create
   * @returns null since authors table doesn't exist
   */
  async createAuthor(authorData: CreateAuthorInput): Promise<Author | null> {
    try {
      console.log('Authors table no longer exists, cannot create author:', authorData);
      return null;
    } catch (error) {
      console.error('Error in createAuthor:', error);
      return null;
    }
  }
};
