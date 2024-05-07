import { User } from './user.model';
import { Project } from './project.model';

export class Investment {
    investmentID?: string;
    projectID: Project;
    investorID: User;
    amount: number; 
    date: Date; 
    ROI: number;
    constructor() {}
  }
  