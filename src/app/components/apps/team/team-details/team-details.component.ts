import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamService } from '../../../../shared/services/team.service';
import { Member } from '../../../../shared/model/member.model';
import { Router } from '@angular/router';
import { MemberService } from '../../../../shared/services/member.service';
import { EditRoleComponent } from "../../../../components/apps/team/edit-role/edit-role.component";
import { CreateTeamComponent } from "../../../../components/apps/team/create-team/create-team.component";
import { AvatarService } from "../../../../shared/services/avatar.service";
import { DomSanitizer } from "@angular/platform-browser";
import { User } from '../../../../shared/model/user.model';
import { StorageService } from '../../../../shared/services/storage.service';
import { UserService } from '../../../../shared/services/user.service';
import { ModalService } from '../../../../shared/services/modal.service'; // Import the ModalService
import { Subscription } from 'rxjs'; // Import Subscription
import { RemoveMemberComponent } from '../remove-member/remove-member.component';
import { UpdateTeamComponent } from '../update-team/update-team.component';
import { Team } from '../../../../shared/model/team.model';



@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit, AfterViewInit {
  teamMembers: Member[] = [];
  showCreateTeamButton = false;
  userId: string;
  team:Team;
  member:Member;
  isManager: boolean = false;
  private roleUpdatedSubscription: Subscription; // Add this line



  @ViewChild(RemoveMemberComponent) RemoveMember: RemoveMemberComponent;
  @ViewChild(CreateTeamComponent) CreateTeam: CreateTeamComponent;
  @ViewChild(EditRoleComponent) EditRole: EditRoleComponent;
  @ViewChild(UpdateTeamComponent) update: UpdateTeamComponent;

  constructor(private teamService: TeamService, private router: Router, private memberService: MemberService, private storageservice: StorageService, private modalService: ModalService) { } // Inject the ModalService
  ngOnInit(): void {
    const currentUser = this.storageservice.getUser();
    this.userId = currentUser.id;


    this.roleUpdatedSubscription = this.modalService.roleUpdated.subscribe((updatedMember: Member) => {
      // Find the index of the member in the teamMembers array
      const index = this.teamMembers.findIndex(member => member.MId === updatedMember.MId);
      if (index !== -1) {
        // Update the member role in the teamMembers array
        this.teamMembers[index].memberRole = updatedMember.memberRole;
      }
    });

    this.modalService.memberDeleted.subscribe((memberId: string) => {
      // Remove the member from the teamMembers array
      this.teamMembers = this.teamMembers.filter(member => member.MId !== memberId);
    });

    this.teamService.isUserInTeam(currentUser.email).subscribe(isUserInTeam => {
      console.log(isUserInTeam);
      if (isUserInTeam) {
        this.loadTeamMembers();
      } else {
        this.showCreateTeamButton = true;
      }
    });
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

          // Check if the current user is a MANAGER
          this.isManager = this.teamMembers.some(member => member.memberRole === 'MANAGER' && member.teamMember.id === this.userId);

          console.log('Team members:', this.teamMembers);
          this.member = this.teamMembers.find(member => member.teamMember.email === currentUser.email);
          console.log('Current member:', this.member);
        },
        error: (err) => {
          console.error('Failed to fetch members', err);
        }
      });
    }, error => {
      console.error('Failed to fetch team for user', error);
    });
  }

  deleteMember(mid: string): void {
    this.memberService.deleteMember(mid).subscribe(() => {
      // Remove the member from the teamMembers array
      this.teamMembers = this.teamMembers.filter(member => member.MId !== mid);
    }, error => {
      console.error('Failed to delete member:', error);
      // Handle error here
    });
  }


  navigateToMember(id: string): void {
    // Adjust the router navigation path as per your application's routing configuration
    this.router.navigate(['/team/member', id]);
  }

  ngAfterViewInit() {
    // Now you can safely access the openModal method
  }

  openCreateTeamModal(): void {
    this.modalService.triggerCreateTeamModal();
  }
  openEditRoleModal(member: Member): void {
    this.modalService.triggerEditRoleModal(member);
  }
  openRemoveMemberModal(member: Member): void {
    console.log(member);
    if (member) { // Check if member is not undefined
      this.modalService.triggerRemoveMemberModal(member);
    } else {
      console.error('Member is not defined:', member);
    }
  }
  ngOnDestroy() {
    // Unsubscribe from the roleUpdated event to avoid memory leaks
    this.roleUpdatedSubscription.unsubscribe();
  }

}
