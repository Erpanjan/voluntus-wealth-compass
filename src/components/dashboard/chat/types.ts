
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'advisor';
  timestamp: Date;
  attachmentType?: 'image' | 'audio' | 'video' | 'document';
  attachmentUrl?: string;
  isLoading?: boolean;
}
