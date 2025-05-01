
import { v4 as uuidv4 } from 'uuid';

// Mock author data
const mockAuthors = [
  {
    id: '1',
    name: 'Jane Smith',
    bio: 'Certified Financial Planner with over 15 years of experience',
    image_url: 'https://picsum.photos/seed/author1/200/200'
  },
  {
    id: '2',
    name: 'Michael Brown',
    bio: 'Investment advisor specializing in sustainable investments',
    image_url: 'https://picsum.photos/seed/author2/200/200'
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    bio: 'Retirement planning specialist and published author',
    image_url: 'https://picsum.photos/seed/author3/200/200'
  },
  {
    id: '4',
    name: 'David Wilson',
    bio: 'Tax strategy expert with a focus on small businesses',
    image_url: 'https://picsum.photos/seed/author4/200/200'
  }
];

// Mock author service functions
export const getAllAuthors = async () => {
  return Promise.resolve(mockAuthors);
};

export const getAuthorById = async (id: string) => {
  const author = mockAuthors.find(a => a.id === id);
  return Promise.resolve(author || null);
};

export const getAuthorByArticleId = async (articleId: string) => {
  // In our mock data, let's assume article 1 is by Jane Smith, 2 by Michael Brown, etc.
  let authorId;
  
  switch(articleId) {
    case '1':
      authorId = '1'; // Jane Smith
      break;
    case '2':
      authorId = '2'; // Michael Brown
      break;
    case '3':
      authorId = '3'; // Sarah Johnson
      break;
    default:
      authorId = '4'; // Default to David Wilson
  }
  
  return getAuthorById(authorId);
};

export const createAuthor = async (authorData: { name: string; bio: string; image_url: string }) => {
  const newAuthor = {
    id: uuidv4(),
    name: authorData.name,
    bio: authorData.bio,
    image_url: authorData.image_url || 'https://picsum.photos/seed/default-author/200/200'
  };
  
  mockAuthors.push(newAuthor);
  return Promise.resolve(newAuthor);
};

export const updateAuthor = async (id: string, authorData: { name: string; bio: string; image_url: string }) => {
  const index = mockAuthors.findIndex(a => a.id === id);
  
  if (index === -1) {
    return Promise.resolve(null);
  }
  
  const updatedAuthor = {
    ...mockAuthors[index],
    name: authorData.name,
    bio: authorData.bio,
    image_url: authorData.image_url || mockAuthors[index].image_url
  };
  
  mockAuthors[index] = updatedAuthor;
  return Promise.resolve(updatedAuthor);
};

export const deleteAuthor = async (id: string) => {
  const index = mockAuthors.findIndex(a => a.id === id);
  
  if (index === -1) {
    return Promise.resolve(false);
  }
  
  mockAuthors.splice(index, 1);
  return Promise.resolve(true);
};

export const createOrUpdateAuthorAssociation = async (articleId: string, authorName: string): Promise<string | null> => {
  try {
    // Check if author exists
    const existingAuthor = mockAuthors.find(a => a.name === authorName);
    
    let authorId;
    
    if (!existingAuthor) {
      // Create new author
      const newAuthor = await createAuthor({
        name: authorName,
        bio: '',
        image_url: ''
      });
      
      if (newAuthor) {
        authorId = newAuthor.id;
      }
    } else {
      authorId = existingAuthor.id;
    }
    
    // In a real implementation, we would update the article_authors table
    // but for our mock, we can just return the authorId
    
    return authorId || null;
  } catch (error) {
    console.error('Error handling author:', error);
    return null;
  }
};
