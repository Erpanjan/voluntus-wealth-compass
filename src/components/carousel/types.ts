
import React from 'react';

export interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface InfiniteSection extends ContentSection {
  originalIndex: number;
}

export interface CarouselDimensions {
  cardWidth: number;
  cardGap: number;
  totalCardWidth: number;
}
