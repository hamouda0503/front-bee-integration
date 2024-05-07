import { Comment } from './comment.model';
import { User } from './user.model';
export interface Publication {
  id?: string; // Optional because it may not be present when creating a new Publication
  content?: string;
  sujet?: string;
  createdAt?: Date;
  AmIevent?:number;
  user?: User;
  likes?: string[];
  likeCount?: number; // Number of likes
  comments?: Comment[]; // An array of Comment objects, assuming you have a Comment interface defined
  // Add other necessary fields as needed
}
