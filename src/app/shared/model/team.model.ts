import { User } from '../model/user.model';
import { Member } from './member.model';

export class Team {
  id?: string;
  name?: string;
  description?: string;
  dateCreated?: Date;
  teamImage?: string;
  coverImage?: string;
  teamOwnerEmail?: string;
  users?: User[];
  members?: Member[];
  teamOwner?: User; // Add this line

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
      this.dateCreated = data.dateCreated;
      this.teamImage = data.teamImage;
      this.coverImage = data.coverImage;
      this.teamOwnerEmail = data.teamOwnerEmail;
      this.users = data.users ? data.users.map((userData: any) => new User(userData)) : [];
      this.members = data.members ? data.members.map((memberData: any) => {
        const member = new Member();
        member.MId = memberData.MId;
        member.teamMember = new User(memberData.teamMember);
        member.team = this; // Assign the current Team object to the team property of each member
        member.memberRole = memberData.memberRole;
        return member;
      }) : [];
      this.teamOwner = data.teamOwner ? new User(data.teamOwner) : null; // Add this line
    }
  }
}
