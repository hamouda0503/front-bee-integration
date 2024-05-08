import { Attachment } from './attachment.model';
import { SeenBy } from './seen-by.model';

export interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  senderImage: string;
  text: string;
  createdAt: Date;
  seenBy: SeenBy[];
  attachments: Attachment[];
}
