
export interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface CarouselItem extends ContentSection {
  originalIndex: number;
}
