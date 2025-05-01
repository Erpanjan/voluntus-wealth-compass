
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Author {
  id: string;
  name: string;
}

interface AuthorSelectorProps {
  authors: Author[] | undefined;
  selectedAuthorIds: string[];
  onAuthorSelection: (authorId: string) => void;
  isLoading?: boolean;
}

const AuthorSelector: React.FC<AuthorSelectorProps> = ({
  authors,
  selectedAuthorIds,
  onAuthorSelection,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Array(6).fill(0).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {authors?.map(author => (
        <div 
          key={author.id}
          className={`p-2 border rounded cursor-pointer ${
            selectedAuthorIds.includes(author.id) 
              ? 'bg-blue-100 border-blue-500' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onAuthorSelection(author.id)}
        >
          {author.name}
        </div>
      ))}
    </div>
  );
};

export default AuthorSelector;
