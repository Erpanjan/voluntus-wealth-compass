
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Goal } from '../types';

interface GoalPriorityQuestionProps {
  questionNumber: number;
  title: string;
  description: string;
  goals: Goal[];
  goalOrder: string[];
  getGoalById: (goalId: string) => Goal | undefined;
  onReorder: (newOrder: string[]) => void;
}

const GoalPriorityQuestion: React.FC<GoalPriorityQuestionProps> = ({
  questionNumber,
  title,
  description,
  goals,
  goalOrder,
  getGoalById,
  onReorder
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(goalOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    
    const newOrder = [...goalOrder];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    onReorder(newOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index >= goalOrder.length - 1) return;
    
    const newOrder = [...goalOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    onReorder(newOrder);
  };

  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{questionNumber}. {title}</h2>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          
          <div className="space-y-4 mt-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="goals-priority">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {goalOrder.map((goalId, index) => {
                      const goal = getGoalById(goalId);
                      if (!goal) return null;
                      
                      return (
                        <Draggable key={goal.id} draggableId={goal.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center justify-between p-4 rounded-lg bg-white border shadow-sm transition-all hover:shadow ${index === 0 ? 'border-amber-400 bg-amber-50' : ''}`}
                            >
                              <div className="flex items-center space-x-3 flex-grow">
                                <div 
                                  {...provided.dragHandleProps}
                                  className="cursor-move text-amber-400 hover:text-amber-700"
                                >
                                  <GripVertical size={20} />
                                </div>
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-amber-800 font-medium">
                                  {index + 1}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="h-5 w-5 text-amber-600">{goal.icon}</span>
                                  <span className="font-medium">{goal.name}</span>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="p-0 h-8 w-8 border-amber-200 text-amber-700 hover:text-amber-900 hover:bg-amber-50"
                                  onClick={() => handleMoveUp(index)}
                                  disabled={index === 0}
                                >
                                  <ArrowUp size={16} />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline" 
                                  size="sm"
                                  className="p-0 h-8 w-8 border-amber-200 text-amber-700 hover:text-amber-900 hover:bg-amber-50"
                                  onClick={() => handleMoveDown(index)}
                                  disabled={index === goalOrder.length - 1}
                                >
                                  <ArrowDown size={16} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          
          {goalOrder.length === 0 && (
            <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              No goals selected. Please select financial goals in the previous section first.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalPriorityQuestion;
