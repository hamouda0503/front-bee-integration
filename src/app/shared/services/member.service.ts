import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member.model';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private baseUrl = 'http://localhost:8080/api'; // Replace with your API base URL

  constructor(private http: HttpClient, private storageservice: StorageService, private userService: UserService) { }
//test






  retrieveMemberById(MId: string): Observable<Member> {
    const url = `${this.baseUrl}/teams/retrieveMemberById/${MId}`;
    const headers = this.userService.getHeaders();
    return this.http.get<Member>(url, { headers });
  }

  updateMemberRole(mid: string, newRole: Member): Observable<Member> {
    const url = `${this.baseUrl}/teams/updateMemberRole/${mid}`;
    const headers = this.userService.getHeaders();
    return this.http.put<Member>(url, newRole, { headers });
  }

  retrieveAllMembers(): Observable<Member[]> {
    const url = `${this.baseUrl}/teams/retrieveAllMembers`;
    const headers = this.userService.getHeaders();
    return this.http.get<Member[]>(url, { headers });
  }

  deleteMember(mid: string): Observable<void> {
    const url = `${this.baseUrl}/teams/deleteMember/${mid}`;
    const headers = this.userService.getHeaders();
    return this.http.delete<void>(url, { headers });
  }
}
