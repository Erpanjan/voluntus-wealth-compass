
import React, { useState, useRef, useCallback } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlignLeft, AlignCenter, AlignRight, Edit, Trash2, GripHorizontal } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const ResizableImageComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [editingAlt, setEditingAlt] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const { src, alt, title, width, height, alignment } = node.attrs;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === imageRef.current) {
      setIsResizing(true);
      const rect = imageRef.current!.getBoundingClientRect();
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height,
      };
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !imageRef.current) return;

    const deltaX = e.clientX - startPos.current.x;
    const newWidth = Math.max(100, startPos.current.width + deltaX);
    const aspectRatio = startPos.current.height / startPos.current.width;
    const newHeight = newWidth * aspectRatio;

    updateAttributes({
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    });
  }, [isResizing, updateAttributes]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleAlignmentChange = (newAlignment: string) => {
    updateAttributes({ alignment: newAlignment });
  };

  const handleAltTextSave = (newAlt: string) => {
    updateAttributes({ alt: newAlt });
    setEditingAlt(false);
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'center':
        return 'mx-auto block';
      case 'right':
        return 'ml-auto block';
      default:
        return 'mr-auto block';
    }
  };

  return (
    <NodeViewWrapper className="relative group">
      <div
        className={`relative inline-block ${getAlignmentClass()}`}
        onMouseEnter={() => setIsSelected(true)}
        onMouseLeave={() => setIsSelected(false)}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          className={`max-w-full h-auto rounded-lg cursor-pointer transition-all duration-200 ${
            isSelected ? 'ring-2 ring-blue-500' : ''
          } ${isResizing ? 'cursor-nw-resize' : ''}`}
          onMouseDown={handleMouseDown}
          draggable={false}
        />
        
        {/* Resize handle */}
        {isSelected && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nw-resize opacity-75 hover:opacity-100">
            <GripHorizontal className="w-3 h-3 text-white m-0.5" />
          </div>
        )}

        {/* Controls overlay */}
        {isSelected && !isResizing && (
          <div className="absolute top-2 right-2 flex gap-1 bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleAlignmentChange('left')}
              title="Align Left"
            >
              <AlignLeft className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleAlignmentChange('center')}
              title="Align Center"
            >
              <AlignCenter className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleAlignmentChange('right')}
              title="Align Right"
            >
              <AlignRight className="h-3 w-3" />
            </Button>

            <Popover open={editingAlt} onOpenChange={setEditingAlt}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  title="Edit Alt Text"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Label htmlFor="alt-text">Alt Text (for accessibility)</Label>
                  <Input
                    id="alt-text"
                    defaultValue={alt || ''}
                    placeholder="Describe the image..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAltTextSave((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingAlt(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('alt-text') as HTMLInputElement;
                        handleAltTextSave(input.value);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={deleteNode}
              title="Delete Image"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;
