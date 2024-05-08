import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatService } from 'src/app/shared/services/chat.service';
import { ConversationType } from 'src/app/shared/model/chatbox/conversation-type.enum';
import { Participant } from 'src/app/shared/model/chatbox/participant.model';
import { TeamService } from 'src/app/shared/services/team.service';
import { Member } from 'src/app/shared/model/member.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Team } from 'src/app/shared/model/team.model';
@Component({
  selector: 'app-chatbox-add-modal',
  templateUrl: './chatbox-add-modal.component.html',
  styleUrls: ['./chatbox-add-modal.component.css']
})
export class ChatboxAddModalComponent implements OnInit {
  chatName: string = '';
  chatImageFile: File | null = null;
  selectedParticipants: Member[] = [];
  teamMembers: Member[] = [];
  team:Team;
  member:Member;

  constructor(
    private storageservice: StorageService,
    private teamService: TeamService,
    private chatService: ChatService,
    private dialogRef: MatDialogRef<ChatboxAddModalComponent>
  ) {}

  ngOnInit(): void {
   this.loadTeamMembers();
  }

  loadTeamMembers(): void {
    const currentUser = this.storageservice.getUser();

    // Retrieve the team of the current user
    this.teamService.getTeamByUserEmail(currentUser.email).subscribe(team => {
      this.team = team;
      console.log('Retrieved team:', this.team);

      // Retrieve members of the team
      this.teamService.retrieveAllMembers().subscribe({
        next: (members) => {
          console.log('Retrieved members:', members);

          // Filter members to include only those who belong to the current team
          this.teamMembers = members.filter(member =>
            this.team.members.some(teamMember => teamMember.teamMember.email === member.teamMember.email)
          );

          // Remove the current user from the list of team members
          this.teamMembers = this.teamMembers.filter(member => member.teamMember.email !== currentUser.email);

          // Select the current member by default
          this.member = this.teamMembers.find(member => member.teamMember.email === currentUser.email);
          if (this.member) {
            this.selectedParticipants.push(this.member);
          }

          console.log('Team members:', this.teamMembers);
          console.log('Selected participants:', this.selectedParticipants);
        },
        error: (err) => {
          console.error('Failed to fetch members', err);
        }
      });
    }, error => {
      console.error('Failed to fetch team for user', error);
    });
  }



  toggleParticipant(member: Member): void {
    console.log('Member clicked:', member);
    console.log('Selected participants before toggle:', this.selectedParticipants);
    const index = this.selectedParticipants.findIndex(p => p.teamMember.id === member.teamMember.id);
    if (index !== -1) {
      this.selectedParticipants.splice(index, 1); // Remove participant if already selected
    } else {
      this.selectedParticipants.push(member); // Add participant if not selected
    }
    console.log('Selected participants after toggle:', this.selectedParticipants);
  }
  
  isParticipant(member: Member): boolean {
    console.log('Checking if member is a participant:', member);
    console.log('Selected participants:', this.selectedParticipants);
    return this.selectedParticipants.some(p => p.teamMember.id === member.teamMember);
  }


  addNewChat(): void {
    console.log(this.chatImageFile)
    if (!this.chatName.trim()) {
      alert('Please enter a chat name');
      return;
    }
    const currentuser1= this.storageservice.getUser();
    this.teamService.getTeamByUserEmail(currentuser1.email).subscribe(team => {
      this.team = team;
    });
    let chatRoom = {
      name: this.chatName,
      type: ConversationType.PUBLIC,
      imageUrl: this.team.teamImage, // Assign team image directly to chat room image URL
      participants: this.selectedParticipants.map(participant => ({
        userId: participant.teamMember.id,
        role: participant.memberRole
      }))
    };

    const formData = new FormData();

    formData.append('conversation', JSON.stringify(chatRoom));

    this.chatService.createConversation(formData).subscribe(
      response => {
        this.dialogRef.close(response);
      },
      error => {
        alert('An error occurred while creating the chat. Please try again.');
        console.error('Error creating conversation:', error);
      }
    );
  }


  cancel(): void {
    this.dialogRef.close();
  }
}
