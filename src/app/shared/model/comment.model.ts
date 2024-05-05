// src/app/models/comment.model.ts
import { User } from './user.model';
import { Publication } from './publication.model';

export interface Comment {
  id?: string;
  content: string;
  likeCount?: number;
  PublicationId?: string; // You might only need the publication ID here
  user?: User; // And possibly only the user ID or a subset of user info
  isEditing?: boolean;
  likes?: string[];
  createdAt?: Date;
  editableContent?: string;
}
