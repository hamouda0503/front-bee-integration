import { Comment } from './comment.model';
import { User } from './user.model';
export interface SavedPublication {
  id?: string;
  publicationid: string;
  userId: string;
}
