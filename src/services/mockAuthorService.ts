
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
