// src/app/models/comment.model.ts
import { User } from './user.model';
import { Publication } from './publication.model';

import {BlogEventType} from "./BlogEventType.enum";

export interface BlogEvent {
  id?: string; // Optional for when creating a new event
  title: string;
  description: string;
  eventType: BlogEventType[];
  startDate: Date;
  endDate: Date;
  participants?: string[]; // Array of user IDs who are participating
  image?: string; // URL to an image for the event
  // ... add any other properties as needed
}

