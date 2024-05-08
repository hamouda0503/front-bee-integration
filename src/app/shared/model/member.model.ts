import { User } from '../model/user.model';
import { Team } from './team.model';

export class Member {
  MId: string;
  teamMember: any;
  team: Team;
  memberRole: MemberRole;
}

export enum MemberRole {
  MANAGER = 'MANAGER',
  CHIEF = 'CHIEF',
  MEMBER = 'MEMBER'
}
