import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Member } from '../model/member.model';
import { EventEmitter } from '@angular/core';
import { Team } from '../model/team.model';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private _showEditRoleModal: Subject<Member> = new Subject<Member>();
  public showEditRoleModal$ = this._showEditRoleModal.asObservable();

  private _showRemoveMemberModal: Subject<Member> = new Subject<Member>();
  public showRemoveMemberModal$ = this._showRemoveMemberModal.asObservable();
  public showCreateTeamModal$ = new Subject<void>(); // Add this line
  public showUpdateTeamModal$ = new Subject<Team>(); // Change void to string


  constructor() { }

  public triggerEditRoleModal(member: Member): void {
    this._showEditRoleModal.next(member);
  }
  public triggerRemoveMemberModal(member: Member): void {
    this._showRemoveMemberModal.next(member);
  }
  triggerCreateTeamModal(): void {
    this.showCreateTeamModal$.next();
  }
  triggerUpdateTeamModal(team: Team): void { // Add teamId parameter
    this.showUpdateTeamModal$.next(team);
  }


  roleUpdated = new EventEmitter<Member>();
  memberDeleted = new EventEmitter<string>();
}
