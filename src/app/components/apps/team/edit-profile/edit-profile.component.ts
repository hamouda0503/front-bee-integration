import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../../../shared/services/team.service';
import { User } from '../../../../shared/model/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../shared/services/storage.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  users: any[] = [];
  pagedUsers: User[] = [];
  totalUsers: number = 0;
  pageSize: number = 100;  // Changed to 7 users per page
  currentPage: number = 1;

  constructor(
    private teamService: TeamService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.teamService.retrieveAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.totalUsers = this.users.length;
        this.updatePagedUsers();
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
      }
    });
  }

  updatePagedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalUsers);
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.updatePagedUsers();
  }

  addMember(email: string): void {
    this.teamService.getTeamByUserEmail(this.storageService.getUser().email).subscribe({
      next: (team) => {
        const tid = team.id;  // Get the current team's id
        console.log('teamuseremail', team.id)
        this.teamService.isUserInTeam(email).subscribe({
          next: (isInTeam) => {
            if (isInTeam) {
              Swal.fire({
                title: 'User is already in team!',
                icon: 'error'
              });
            } else {
              this.teamService.addMembersToTeam(email, tid).subscribe({
                next: (user) => {
                  console.log('Member added successfully:', user);
                  Swal.fire({
                    title: 'User added successfully!',
                    icon: 'success'
                  });
                  this.router.navigate(['/team/team-details']);
                },
                error: (error) => {
                  console.error('Failed to add User:', error);
                }
              });
            }
          },
          error: (error) => {
            console.error('Failed to check if user is in team:', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to get team by user email:', error);
      }
    });
  }
}
