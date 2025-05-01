
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { articleService, Author } from '@/services/articleService';

interface ArticleAuthorsSectionProps {
  selectedAuthors: string[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<string[]>>;
}

const ArticleAuthorsSection: React.FC<ArticleAuthorsSectionProps> = ({
  selectedAuthors,
  setSelectedAuthors
}) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch available authors when component mounts
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const data = await articleService.getAuthors();
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
    if (!selectedAuthor) return;
    
    // Check if author already exists to avoid duplicates
    if (selectedAuthors.includes(selectedAuthor)) {
      toast({
        title: "Author already added",
        description: "This author is already in the list.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedAuthors(prev => [...prev, selectedAuthor]);
    setSelectedAuthor(''); // Reset selection
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
        <Select 
          value={selectedAuthor} 
          onValueChange={setSelectedAuthor}
          disabled={loading}
        >
          <SelectTrigger className="flex-grow">
            <SelectValue placeholder="Select an author" />
          </SelectTrigger>
          <SelectContent>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          type="button" 
          onClick={handleAddAuthor}
          variant="outline"
          disabled={!selectedAuthor || loading}
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
