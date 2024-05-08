import { Component, OnInit, ViewChild, TemplateRef, PLATFORM_ID, Inject } from '@angular/core';
import { NgbModal, NgbDateStruct, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TeamService } from '../../../../shared/services/team.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../shared/services/storage.service';
import { UserService } from '../../../../shared/services/user.service';
import { User } from '../../../../shared/model/user.model';
import { isPlatformBrowser } from '@angular/common';
import { Team } from '../../../../shared/model/team.model';

@Component({
  selector: 'app-update-team',
  templateUrl: './update-team.component.html',
  styleUrls: ['./update-team.component.scss']
})
export class UpdateTeamComponent implements OnInit {
  @ViewChild("updateTeam", { static: false }) UpdateTeam: TemplateRef<any>;
  team: Team = new Team();
  currentFile1?: File;
  currentFile2?: File;
  teamForm: FormGroup;
  isSuccessful = false;
  isUpdateFailed = false;
  teamImage: File;
  coverImage: File;
  currentTeamImage: string; // Add this line
  currentTeamCoverImage: string; // Add this line
  errorMessage = '';
  userId: string;
  currentTeamId: string; // Add this line
  currentTeamName: string; // Add this line
  currentTeamDescription: string; // Add this line
  currentTeamFile1: File;
  currentTeamFile2: File;
  modalOpen = false; // Add this line
  closeResult: string; // Add this line
  teamImageFile: File;
  coverImageFile: File;

  constructor(private fb: FormBuilder, private http: HttpClient, private teamService: TeamService, private modalService: ModalService, private ngbModal: NgbModal,private storageservice: StorageService, @Inject(PLATFORM_ID) private platformId: Object) { } // Add platformId injection

  ngOnInit(): void {
    this.modalService.showUpdateTeamModal$.subscribe((team) => {
      this.openModal(team); // Use teamId here
    });

      this.teamForm = this.fb.group({
        name: ['', Validators.required], // Add Validators.required if these fields are required
        description: ['', Validators.required],
        teamOwnerEmail: [''],
        dateCreated: [''],
        Imageteam: [''], // Update the form control name to match the file input name
        Coverteam: ['']
    });
  }

  selectFile1(event: any): void {
    this.currentFile1 = event.target.files[0];
  }

  selectFile2(event: any): void {
    this.currentFile2 = event.target.files[0];
  }

  updateTeamm(updatedTeam: any): void {
    const currentUser = this.storageservice.getUser();
    this.userId = currentUser.id;
    if (this.teamForm.valid) {
      this.team.description = this.teamForm.value["description"];
      this.team.name = this.teamForm.value["name"];
      this.team.teamOwnerEmail = currentUser.email;
      this.teamImageFile = this.currentFile1; // Store the file object for team image
      this.coverImageFile = this.currentFile2; // Store the file object for cover image
      console.log('hedha houwa team', updatedTeam);
      this.teamService.updateTeam(this.team, this.teamImageFile, this.coverImageFile).subscribe({
        next: data => {
          console.log(data);
          this.isSuccessful = true;
          this.isUpdateFailed = false;
          // Assuming that the API response contains updated team details with new image URLs
          this.team.teamImage = data.teamImage; // Update team image URL
          this.team.coverImage = data.coverImage; // Update cover image URL
          Swal.fire({
            title: 'Team Update Successful!',
            text: 'Your team has been updated successfully.',
            icon: 'success'
          });
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isUpdateFailed = true;
          console.log(this.isUpdateFailed)
        }
      });
    }
  }



  openModal(updatedTeam: Team) { // Specify the type of team as Team
    // Log the received team details
    console.log('Received team in modal:', JSON.stringify(updatedTeam, undefined, 2));

    // Store the team's id and name
    this.currentTeamId = updatedTeam.id;
    this.currentTeamName = updatedTeam.name;
    this.currentTeamDescription = updatedTeam.description;
    this.currentTeamImage = updatedTeam.teamImage; // Store the team's image URL
    this.currentTeamCoverImage = updatedTeam.coverImage;

    // Log the current team ID
    console.log('Current team ID:', this.currentTeamId);

    // Set the form values with the old team details
    this.teamForm.patchValue({
      name: updatedTeam.name,
      description: updatedTeam.description,
      teamImage: updatedTeam.teamImage,
      coverImage: updatedTeam.coverImage,

    });

    // Open the modal
    if (isPlatformBrowser(this.platformId)) {
      this.ngbModal.open(this.UpdateTeam, {
        size: 'lg',
        ariaLabelledBy: 'modal',
        centered: true,
        windowClass: 'modal'
      }).result.then((result) => {
        this.modalOpen = true;
        this.closeResult = `Result ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
