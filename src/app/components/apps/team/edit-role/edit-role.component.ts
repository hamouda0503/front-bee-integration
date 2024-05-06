import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../shared/services/modal.service';
import { Subscription } from 'rxjs'; // Import Subscription
import { TeamService } from '../../../../shared/services/team.service';
import { Member, MemberRole } from '../../../../shared/model/member.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit, OnDestroy {

  @ViewChild("editrole", { static: false }) EditRole: TemplateRef<any>;

  public closeResult: string;
  public modalOpen: boolean = false;
  public selectedRole: MemberRole; // Add this line
  public currentMemberId: string;
  private memberDeletedSubscription: Subscription; // Add this line
  private roleUpdatedSubscription: Subscription; // Add this line
  public memberRoles = Object.values(MemberRole); // Add this line

  private modalSubscription: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private modalService: ModalService, private ngbModal: NgbModal,
    private teamService: TeamService) { } // Inject NgbModal

    ngOnInit(): void {
      this.modalSubscription = this.modalService.showEditRoleModal$.subscribe((member: Member) => this.openModal(member));
      this.memberDeletedSubscription = this.modalService.memberDeleted.subscribe(() => {
        this.refreshPage();
        this.roleUpdatedSubscription = this.teamService.roleUpdated.subscribe(() => {
          this.refreshPage();
        });
      });
    }
    saveRole(): void {
      if (this.currentMemberId) {
        this.teamService.retrieveMemberById(this.currentMemberId).subscribe(member => {
          member.memberRole = this.selectedRole;
          this.teamService.updateMemberRole(this.currentMemberId, member).subscribe(() => {
            console.log('Member role updated successfully');
            Swal.fire({
              title: 'Role updated Successfully!',
              text: 'Role has been updated successfully.',
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          }, error => {
            console.error('Failed to update member role:', error);
          });
        }, error => {
          console.error('Failed to retrieve member:', error);
        });
      } else {
        console.error('No member selected');
      }
    }

  openModal(member: any) {
    const mappedMember: Member = {
      ...member,
      MId: member.mid // Map mid to MId
    };
    console.log('Received member in modal:', JSON.stringify(mappedMember, null, 2));
    this.currentMemberId = mappedMember.MId; // Store the member's ID
    this.selectedRole = mappedMember.memberRole;
    if (isPlatformBrowser(this.platformId)) { // For SSR
      console.log('Current member ID:', this.currentMemberId);
      this.ngbModal.open(this.EditRole, { // Use ngbModal to open the modal
        size: 'lg',
        ariaLabelledBy: 'modal',
        centered: true,
        windowClass: 'modal'
      }).result.then((result) => {
        this.modalOpen = true;
        this.closeResult = `Result ${result}`; // Assign the result to closeResult
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

  ngOnDestroy() {
    if(this.modalOpen){
      this.modalSubscription.unsubscribe();
    }
    this.memberDeletedSubscription.unsubscribe(); // Add this line
    this.roleUpdatedSubscription.unsubscribe(); // Add this line
  }
  refreshPage(): void {
    // Your logic to refresh the page goes here
  }

}
