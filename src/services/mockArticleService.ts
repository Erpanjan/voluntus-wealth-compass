
import { ArticleData, AuthorData } from '@/types/supabase';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { ArticleFormValues } from '@/hooks/useArticleForm';

// Mock data storage
let articles: ArticleData[] = [
  {
    id: '1',
    title: 'Introduction to Financial Planning',
    slug: 'introduction-to-financial-planning',
    description: 'Learn the basics of financial planning and how to get started.',
    content: JSON.stringify({
      ops: [
        { insert: 'Introduction to Financial Planning\n', attributes: { header: 1 } },
        { insert: 'Financial planning is the process of setting goals, developing a plan to achieve them, and putting the plan into action.' },
      ]
    }),
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=500',
    published: true,
    created_at: '2023-05-15T10:00:00Z',
    updated_at: '2023-05-15T10:00:00Z',
    published_at: '2023-05-15T10:00:00Z',
    category: 'Financial Planning',
    tags: ['finance', 'planning', 'basics'],
    author_id: '1'
  }
];

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

// Helper function to create a slug from a title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Fetch an article by ID
export const fetchArticleById = async (id: string): Promise<ArticleData | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const article = articles.find(a => a.id === id);
  return article || null;
};

// Fetch all articles
export const fetchArticles = async (): Promise<ArticleData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [...articles];
};

// Save an article (create or update)
export const saveArticle = async (
  formData: ArticleFormValues, 
  htmlContent: string,
  imageUrl: string,
  publish: boolean,
  id?: string
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const now = new Date().toISOString();
  const slug = createSlug(formData.title);
  
  if (id) {
    // Update existing article
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index] = {
        ...articles[index],
        title: formData.title,
        description: formData.description,
        content: htmlContent,
        image_url: imageUrl,
        published: publish,
        updated_at: now,
        published_at: publish ? now : articles[index].published_at,
        category: formData.category,
      };
      return id;
    }
    throw new Error('Article not found');
  } else {
    // Create new article
    const newArticle: ArticleData = {
      id: uuidv4(),
      title: formData.title,
      slug,
      description: formData.description,
      content: htmlContent,
      image_url: imageUrl,
      published: publish,
      created_at: now,
      updated_at: now,
      published_at: publish ? now : null,
      category: formData.category,
      tags: [],
      author_id: '1' // Default author ID
    };
    
    articles.push(newArticle);
    return newArticle.id;
  }
};

// Extract HTML content from article
export const extractContentHtml = (content: any): string => {
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      if (parsed && parsed.ops) {
        return content; // Already in Delta format
      }
      return content; // Plain HTML
    } catch (e) {
      return content; // Plain HTML or other format
    }
  }
  return '';
};

// Delete an article
export const deleteArticle = async (id: string): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const initialLength = articles.length;
  articles = articles.filter(a => a.id !== id);
  
  return articles.length < initialLength;
};
