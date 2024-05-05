import {User} from "./User";


export class Task {
  id?: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  dueDate: string;
  rating?: number;
  creationDate: string;
  estimatedDuration?: number;
  actualDuration?: number;
  tags: string[];
  assignedUser?: any;
  progress:number;
  // project?: Project;

  constructor() {
    this.title = '';
    this.description = '';
    this.status = '';
    this.priority = 0;
    this.dueDate = '';
    this.creationDate = '';
    this.tags = [];


  }
}
