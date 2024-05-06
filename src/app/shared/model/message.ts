import { ChatRoom } from "./chatroom";
import { User } from '../model/user.model';

export interface Message {
  id: string;
  chatRoom: ChatRoom;
  sender:any;
  content: string;
  attachment: ArrayBuffer | null;
  createdAt: Date;
  seen: boolean;
}
