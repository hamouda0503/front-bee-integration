import { User } from './user.model';
export class Project {
    id?: string;
    name: string;
    description: string;
    startDate: Date; 
    endDate: Date; 
    status: string;
    budget: number;
    ownerId: User;
    estimatedROI: number;
    actualROI: number;
    riskLevel: string;
    fundingGoal: number;
    fundingRaised: number;
    investorCount: number;
    progressUpdates: string;
    complianceStatus: string;
    location: string;
    industry: string;
    technologyStack: string;
    constructor() {}
  }
  