
export const SAMPLE_ARTICLES = [
  {
    id: '1',
    title: 'Understanding Financial Planning',
    slug: 'understanding-financial-planning',
    description: 'An overview of financial planning principles',
    category: 'Finance',
    published_at: new Date().toISOString(),
    authors: [
      { id: '1', name: 'John Smith', image_url: null },
      { id: '2', name: 'Jane Doe', image_url: null }
    ]
  },
  {
    id: '2',
    title: 'Investment Strategies for 2025',
    slug: 'investment-strategies-2025',
    description: 'Key investment strategies to consider for the coming year',
    category: 'Investing',
    published_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    authors: [
      { id: '1', name: 'John Smith', image_url: null }
    ]
  },
  {
    id: '3',
    title: 'Retirement Planning Basics',
    slug: 'retirement-planning-basics',
    description: 'Essential steps for planning your retirement',
    category: 'Planning',
    published_at: new Date().toISOString(),
    authors: [
      { id: '3', name: 'Robert Johnson', image_url: null },
      { id: '4', name: 'Mary Williams', image_url: null },
      { id: '5', name: 'David Brown', image_url: null }
    ]
  }
];
