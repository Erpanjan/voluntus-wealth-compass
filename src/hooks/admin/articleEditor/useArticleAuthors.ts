
import { useState } from 'react';

// Sample authors for edit mode
const SAMPLE_AUTHORS = ['John Smith', 'Jane Doe'];

export const useArticleAuthors = (isEditMode: boolean) => {
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  
  const loadAuthorsData = async () => {
    if (isEditMode) {
      // For now, assume these authors for the sample article
      setSelectedAuthors(SAMPLE_AUTHORS);
    }
  };
  
  return {
    selectedAuthors,
    setSelectedAuthors,
    loadAuthorsData
  };
};
