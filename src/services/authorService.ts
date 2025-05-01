
import { supabase } from '@/types/supabase';

export const getAuthorByArticleId = async (articleId: string) => {
  try {
    const { data: authorJoins, error: authorError } = await supabase
      .from('article_authors')
      .select('author_id')
      .eq('article_id', articleId);

    if (authorError || !authorJoins || authorJoins.length === 0) {
      return null;
    }

    const authorId = authorJoins[0].author_id;
    const { data: authorData } = await supabase
      .from('authors')
      .select('name')
      .eq('id', authorId)
      .single();

    return authorData;
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
};

export const createOrUpdateAuthorAssociation = async (articleId: string, authorName: string): Promise<string | null> => {
  try {
    // Check if author exists
    const { data: existingAuthor } = await supabase
      .from('authors')
      .select('id')
      .eq('name', authorName)
      .single();
      
    let authorId;
    
    if (!existingAuthor) {
      // Create new author
      const { data: newAuthor, error: authorError } = await supabase
        .from('authors')
        .insert({
          name: authorName,
        })
        .select();
        
      if (authorError) throw authorError;
      
      if (newAuthor && newAuthor.length > 0) {
        authorId = newAuthor[0].id;
      }
    } else {
      authorId = existingAuthor.id;
    }
    
    // Delete existing author association
    await supabase
      .from('article_authors')
      .delete()
      .eq('article_id', articleId);
    
    // Create author association
    if (authorId) {
      const { error: joinError } = await supabase
        .from('article_authors')
        .insert({
          article_id: articleId,
          author_id: authorId
        });
        
      if (joinError) throw joinError;
      return authorId;
    }
    
    return null;
  } catch (error) {
    console.error('Error handling author:', error);
    return null;
  }
};
