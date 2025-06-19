
import { ReactNode } from 'react';

export interface ContentSection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface InfiniteItem extends ContentSection {
  originalIndex: number;
}

export interface CarouselDimensions {
  cardWidth: number;
  cardGap: number;
  totalCardWidth: number;
  isMobile: boolean;
  isClient: boolean;
}

export interface CarouselScrollProps {
  scrollViewportRef: React.RefObject<HTMLDivElement>;
  totalCardWidth: number;
  sectionLength: number;
  isClient: boolean;
}

export interface CarouselCardProps {
  section: InfiniteItem;
  cardWidth: number;
  isMobile: boolean;
}

export interface CarouselHeaderProps {
  title: string;
}
