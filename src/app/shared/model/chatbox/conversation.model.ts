import { ConversationType } from "./conversation-type.enum";
import { Participant } from "./participant.model";

export interface Conversation {
    id: string;
    name: string;
    type: ConversationType;
    participants: Participant[];
    imageUrl: string;
    lastMessage: string;
    createdAt: Date;
  }
