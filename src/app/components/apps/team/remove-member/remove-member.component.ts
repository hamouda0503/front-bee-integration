import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../shared/services/modal.service';
import { Subscription } from 'rxjs';
import { TeamService } from '../../../../shared/services/team.service';
import { Member } from '../../../../shared/model/member.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-remove-member',
  templateUrl: './remove-member.component.html',
  styleUrls: ['./remove-member.component.scss']
})
export class RemoveMemberComponent implements OnInit, OnDestroy {

  @ViewChild("removemember", { static: false }) RemoveMember: TemplateRef<any>;

  public closeResult: string;
  public modalOpen: boolean = false;
  public currentMemberId: string;
  public currentTeamId: string; // Add this line
  public currentMemberName: string; // Add this line
  private router: Router
  private modalSubscription: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private modalService: ModalService, private ngbModal: NgbModal,
    private teamService: TeamService) { }

    ngOnInit(): void {
      this.modalSubscription = this.modalService.showRemoveMemberModal$.subscribe(member => this.openModal(member));
    }

    deleteMember(): void {
      if (this.currentMemberId) {
        this.teamService.deleteMember(this.currentMemberId).subscribe(() => {
          console.log('Member deleted successfully');
          this.ngbModal.dismissAll();
          this.modalService.memberDeleted.emit(this.currentMemberId);
          Swal.fire({
            title: 'Member removed Successfully!',
            text: 'The member has been successfully deleted.',
            icon: 'success'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        }, error => {
          console.error('Failed to delete member:', error);
        });
      } else {
        console.error('No member selected');
      }
    }




    openModal(member: any) {
      const mappedMember: Member = {
        ...member,
        MId: member.mid
      };
      console.log('Received member in modal:', JSON.stringify(mappedMember, null, 2));
      this.currentMemberId = mappedMember.MId;

      this.currentMemberName = `${mappedMember.teamMember.firstname} ${mappedMember.teamMember.lastname}`; // Store the member's name
      if (isPlatformBrowser(this.platformId)) {
        console.log('Current member ID:', this.currentMemberId);
        this.ngbModal.open(this.RemoveMember, {
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

  ngOnDestroy() {
    if(this.modalOpen){
      this.modalSubscription.unsubscribe();
    }
  }
  refreshPage(): void {
    window.location.reload();
  }
}
