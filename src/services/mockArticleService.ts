
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

// Mock article data
const mockArticles = [
  {
    id: '1',
    title: 'Understanding Financial Planning',
    slug: 'understanding-financial-planning',
    description: 'A comprehensive guide to getting started with financial planning',
    content: '<h2>Introduction to Financial Planning</h2><p>Financial planning is the process of setting goals, developing a plan to achieve those goals, and putting the plan into action.</p>',
    category: 'Financial Planning',
    image_url: 'https://picsum.photos/seed/finance1/800/400',
    published_at: '2025-01-15',
    created_at: '2024-12-20',
    updated_at: '2025-01-10',
    is_published: true,
    author: 'Jane Smith',
    authors: [{ name: 'Jane Smith', image_url: '' }]
  },
  {
    id: '2',
    title: 'Investment Strategies for Beginners',
    slug: 'investment-strategies-beginners',
    description: 'Learn the basics of investing and how to build a strong portfolio',
    content: '<h2>Getting Started with Investments</h2><p>Investing can seem intimidating, but with the right approach, anyone can build wealth over time.</p>',
    category: 'Investing',
    image_url: 'https://picsum.photos/seed/invest1/800/400',
    published_at: '2025-02-10',
    created_at: '2025-01-15',
    updated_at: '2025-02-05',
    is_published: true,
    author: 'Michael Brown',
    authors: [{ name: 'Michael Brown', image_url: '' }]
  },
  {
    id: '3',
    title: 'Retirement Planning Essentials',
    slug: 'retirement-planning-essentials',
    description: 'How to prepare for a comfortable and secure retirement',
    content: '<h2>Planning for Your Future</h2><p>Retirement planning is one of the most important aspects of financial management.</p>',
    category: 'Retirement',
    image_url: 'https://picsum.photos/seed/retire1/800/400',
    published_at: '2025-03-01',
    created_at: '2025-02-01',
    updated_at: '2025-02-25',
    is_published: false,
    author: 'Sarah Johnson',
    authors: [{ name: 'Sarah Johnson', image_url: '' }, { name: 'David Wilson', image_url: '' }]
  }
];

// Mock article service functions
export const getAllArticles = async () => {
  return Promise.resolve(mockArticles);
};

export const getArticleById = async (id: string) => {
  const article = mockArticles.find(a => a.id === id);
  return Promise.resolve(article || null);
};

export const getArticleBySlug = async (slug: string) => {
  const article = mockArticles.find(a => a.slug === slug);
  return Promise.resolve(article || null);
};

export const createArticle = async (articleData: any, htmlContent: string, imageUrl: string, publish = false) => {
  const newArticle = {
    id: uuidv4(),
    title: articleData.title,
    slug: articleData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    description: articleData.description,
    content: htmlContent,
    category: articleData.category,
    image_url: imageUrl || 'https://picsum.photos/seed/default/800/400',
    published_at: articleData.published_at || format(new Date(), 'yyyy-MM-dd'),
    created_at: format(new Date(), 'yyyy-MM-dd'),
    updated_at: format(new Date(), 'yyyy-MM-dd'),
    is_published: publish,
    author: articleData.author || 'Anonymous',
    authors: [{ name: articleData.author || 'Anonymous', image_url: '' }]
  };
  
  mockArticles.push(newArticle);
  return Promise.resolve(newArticle);
};

export const updateArticle = async (id: string, articleData: any, htmlContent: string, imageUrl: string, publish = false) => {
  const index = mockArticles.findIndex(a => a.id === id);
  
  if (index === -1) {
    return Promise.resolve(null);
  }
  
  const updatedArticle = {
    ...mockArticles[index],
    title: articleData.title,
    slug: articleData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    description: articleData.description,
    content: htmlContent,
    category: articleData.category,
    image_url: imageUrl || mockArticles[index].image_url,
    published_at: articleData.published_at,
    updated_at: format(new Date(), 'yyyy-MM-dd'),
    is_published: publish,
    author: articleData.author,
    authors: [{ name: articleData.author, image_url: '' }]
  };
  
  mockArticles[index] = updatedArticle;
  return Promise.resolve(updatedArticle);
};

export const deleteArticle = async (id: string) => {
  const index = mockArticles.findIndex(a => a.id === id);
  
  if (index === -1) {
    return Promise.resolve(false);
  }
  
  mockArticles.splice(index, 1);
  return Promise.resolve(true);
};
