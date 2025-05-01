
import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { authorService } from '@/services/authorService';
import { Author } from '@/types/article.types';

interface ArticleAuthorsSectionProps {
  selectedAuthors: string[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<string[]>>;
}

const ArticleAuthorsSection: React.FC<ArticleAuthorsSectionProps> = ({
  selectedAuthors,
  setSelectedAuthors
}) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [newAuthorName, setNewAuthorName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch available authors when component mounts
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const data = await authorService.getAuthors();
        setAuthors(data);
      } catch (error) {
        console.error('Error fetching authors:', error);
        toast({
          title: "Error",
          description: "Failed to load author data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [toast]);

  const handleAddAuthor = () => {
    if (!newAuthorName.trim()) return;
    
    // Check if author already exists to avoid duplicates
    const existingAuthor = authors.find(a => 
      a.name.toLowerCase() === newAuthorName.trim().toLowerCase()
    );
    
    if (existingAuthor) {
      // If author exists, check if already selected
      if (selectedAuthors.includes(existingAuthor.id)) {
        toast({
          title: "Author already added",
          description: "This author is already in the list.",
          variant: "destructive",
        });
        return;
      }
      
      // Add existing author
      setSelectedAuthors(prev => [...prev, existingAuthor.id]);
    } else {
      // Here we would typically create a new author, but for now we'll just show a message
      toast({
        title: "Author not found",
        description: "This author doesn't exist in the system. Please select from existing authors.",
        variant: "destructive",
      });
    }
    
    setNewAuthorName(''); // Reset input
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAuthor();
    }
  };

  const handleRemoveAuthor = (authorId: string) => {
    setSelectedAuthors(prev => prev.filter(author => author !== authorId));
  };

  // Get author name by ID
  const getAuthorName = (authorId: string): string => {
    const author = authors.find(a => a.id === authorId);
    return author ? author.name : 'Unknown Author';
  };

  return (
    <div>
      <FormLabel className="text-gray-700 text-base">Authors</FormLabel>
      <FormDescription className="text-gray-500 mb-3">
        Add one or multiple authors for this article
      </FormDescription>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedAuthors.map((authorId) => (
          <Badge 
            key={authorId}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200"
          >
            {getAuthorName(authorId)}
            <button 
              type="button"
              className="ml-1 hover:bg-gray-300 rounded-full p-1 transition-colors"
              onClick={() => handleRemoveAuthor(authorId)}
            >
              <X size={14} />
            </button>
          </Badge>
        ))}

        {selectedAuthors.length === 0 && (
          <div className="text-sm text-gray-500 italic">No authors selected</div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type author name and press Enter"
          value={newAuthorName}
          onChange={(e) => setNewAuthorName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow"
          disabled={loading}
          list="author-suggestions"
        />
        
        <datalist id="author-suggestions">
          {authors.map(author => (
            <option key={author.id} value={author.name} />
          ))}
        </datalist>
        
        <Button 
          type="button" 
          onClick={handleAddAuthor}
          variant="outline"
          disabled={!newAuthorName.trim() || loading}
          className="hover:bg-gray-100"
        >
          <Plus size={16} className="mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default ArticleAuthorsSection;
