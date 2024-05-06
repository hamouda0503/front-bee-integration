import { User } from '../model/user.model';

export interface ChatRoom {
    id: string;
    name: string | null;
    users: User[];
  }
