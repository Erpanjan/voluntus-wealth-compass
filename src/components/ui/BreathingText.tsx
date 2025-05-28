
import React from 'react';
import { cn } from '@/lib/utils';

interface BreathingTextProps {
  label: string;
  staggerDuration?: number;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  className?: string;
}

const BreathingText: React.FC<BreathingTextProps> = ({
  label,
  staggerDuration = 0.1,
  fromFontVariationSettings = "'wght' 400",
  toFontVariationSettings = "'wght' 700",
  className
}) => {
  const words = label.split(' ');

  return (
    <div className={cn("flex flex-wrap justify-center items-center gap-x-2", className)}>
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="breathing-text-word"
          style={{
            animationDelay: `${wordIndex * staggerDuration}s`,
            fontVariationSettings: fromFontVariationSettings,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default BreathingText;
