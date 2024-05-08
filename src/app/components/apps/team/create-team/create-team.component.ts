import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { NgbModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Add this line
import { Team } from '../../../../shared/model/team.model';
import { TeamService } from '../../../../shared/services/team.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../shared/services/storage.service';
import { UserService } from '../../../../shared/services/user.service';
import { User } from '../../../../shared/model/user.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {
  @ViewChild("createTeam", { static: false }) CreateTeam: TemplateRef<any>;
  team: Team = new Team();
  files: File[] = [];
  teamImageFile: File[] = [];
  coverImageFile: File[] = [];
  currentFile1?: File;
  currentFile2?: File; // Add this line
  teamForm: FormGroup; // Add this line
  isSuccessful = false; // Add this line
  isCreationFailed = false; // Add this line
  errorMessage = ''; // Add this line
  userId: string;
  user1: User;
  email1 : String;
  private router: Router


  constructor(private fb: FormBuilder, private http: HttpClient, private teamService: TeamService, private modalService: ModalService, private ngbModal: NgbModal,private storageservice: StorageService) { }

  ngOnInit(): void {
    this.modalService.showCreateTeamModal$.subscribe(() => {
      this.openModal();
    });

    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      teamOwnerEmail: [''],
      dateCreated: [new Date()],
      teamImage: [''],
      coverImage: ['']
    });
  }

  selectFile1(event: any): void { // Add this method
    this.currentFile1 = event.target.files[0];
  }
  selectFile2(event: any): void { // Add this method
    this.currentFile2 = event.target.files[0];
  }

   // For Team Image
   selectTeamImageFile(event: any): void {
    this.teamImageFile = Array.from(event.target.files);
  }

  selectCoverImageFile(event: any): void {
    this.coverImageFile = Array.from(event.target.files);
  }




  createTeamm(): void {
    console.log('Form validity:', this.teamForm.valid);
    const currentUser = this.storageservice.getUser();

    this.userId = currentUser.id;
    if (this.teamForm.valid) {
      this.team.description = this.teamForm.value["description"];
      this.team.name = this.teamForm.value["name"];
      this.team.teamOwnerEmail = currentUser.email;
      this.team.teamImage = this.currentFile1[0];
      this.team.coverImage = this.currentFile2[0];

      this.teamService.addTeam(this.team, this.userId, this.currentFile1, this.currentFile2).subscribe({
        next: data => {
          console.log(data);
          this.isSuccessful = true;
          this.isCreationFailed = false;
          Swal.fire({
            title: 'Team Creation Successful!',
            text: 'Your team has been created successfully.',
            icon: 'success'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isCreationFailed = true;
          console.log(this.isCreationFailed)
        }
      });
    }
  }



  openModal(): void {
    this.ngbModal.open(this.CreateTeam, {
      size: '',
      ariaLabelledBy: 'modal',
      centered: true,
      windowClass: 'modal'
    });
  }
}
