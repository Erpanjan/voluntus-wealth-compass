
import { AuthorData } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

// This is using the same mock data from mockArticleService.ts
// In a real application, these would be separate databases or tables
let authors: AuthorData[] = [
  {
    id: '1',
    name: 'Jane Smith',
    bio: 'Financial advisor with over 10 years of experience',
    image_url: 'https://randomuser.me/api/portraits/women/42.jpg',
    created_at: '2023-01-01T10:00:00Z',
    updated_at: '2023-01-01T10:00:00Z'
  }
];

// Fetch all authors
export const fetchAuthors = async (): Promise<AuthorData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [...authors];
};

// Fetch an author by ID
export const fetchAuthorById = async (id: string): Promise<AuthorData | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const author = authors.find(a => a.id === id);
  return author || null;
};

// Fetch author by article ID
export const getAuthorByArticleId = async (articleId: string): Promise<AuthorData | null> => {
  // Simulate network delay and relationship lookup
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For mock purposes, we'll just return the first author
  // In a real database, we'd join tables or lookup the relationship
  return authors[0] || null;
};

// Create or update an author
export const saveAuthor = async (author: Partial<AuthorData>): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const now = new Date().toISOString();
  
  if (author.id) {
    // Update existing author
    const index = authors.findIndex(a => a.id === author.id);
    if (index !== -1) {
      authors[index] = {
        ...authors[index],
        ...author,
        updated_at: now
      };
      return author.id;
    }
    throw new Error('Author not found');
  } else {
    // Create new author
    const newAuthor: AuthorData = {
      id: uuidv4(),
      name: author.name || 'Unnamed Author',
      bio: author.bio || '',
      image_url: author.image_url || '',
      created_at: now,
      updated_at: now
    };
    
    authors.push(newAuthor);
    return newAuthor.id;
  }
};

// Delete an author
export const deleteAuthor = async (id: string): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const initialLength = authors.length;
  authors = authors.filter(a => a.id !== id);
  
  return authors.length < initialLength;
};
