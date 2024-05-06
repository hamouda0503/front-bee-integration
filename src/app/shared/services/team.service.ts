import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Team } from '../model/team.model';
import { Member, MemberRole } from '../model/member.model';
import { catchError, map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';
import { tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { UserService } from './user.service';



@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://localhost:8080/api'; // Replace with your API base URL

  roleUpdated = new EventEmitter<void>();

  constructor(private http: HttpClient, private storageservice: StorageService, private userService: UserService) { }

  // Utilize this method to set the token when needed

  // Check if a user has a team

  isUserInTeam(email: string): Observable<boolean> {
    const headers = this.userService.getHeaders();
    return this.http.get<boolean>(`${this.baseUrl}/teams/isUserInTeam/${email}`, { headers });
  }

  // Method to check if a user is in a specific team
  isUserInCurrentTeam(teamId: string, email: string): Observable<boolean> {
    const headers = this.userService.getHeaders();
    return this.http.get<boolean>(`${this.baseUrl}/isUserInCurrentTeam/${teamId}/${email}`, { headers });
  }


  addTeam(team: Team, id: string, teamImageFile: File, coverImageFile: File): Observable<Team> {
    const url = `${this.baseUrl}/teams/AddTeam/${id}`;

    const formData = new FormData();
    formData.append('name', team.name);
    formData.append('description', team.description);
    formData.append('Uid', id);
    formData.append('Imageteam', teamImageFile);
    formData.append('Coverteam', coverImageFile);

    // Create headers
    const headers = this.userService.getHeaders();

    // Make the HTTP request and return the result
    return this.http.post<Team>(url, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error in addTeam:', error);
        return throwError(error);
      })
    );
  }


  updatTeam(team: Team, teamImageFile: File, coverImageFile: File): Observable<Team> {
    const url = `${this.baseUrl}/teams/UpdateTeam/${team.id}`;

    const formData = new FormData();
    formData.append('name', team.name);
    formData.append('description', team.description);
    formData.append('Imageteam', teamImageFile);
    formData.append('Coverteam', coverImageFile);

    // Create headers
    const headers = this.userService.getHeaders();

    // Make the HTTP request and return the result
    return this.http.put<Team>(url, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error in updateTeam:', error);
        return throwError(error);
      })
    );
  }

  updateTeam(updatedTeam: Team, teamImageFile: File, coverImageFile: File): Observable<Team> {
    const url = `${this.baseUrl}/teams/updateTeam/${updatedTeam.id}`;

    const formData = new FormData();
    formData.append('name', updatedTeam.name);
    formData.append('description', updatedTeam.description);
    if (teamImageFile) {
      formData.append('Imageteam', updatedTeam.teamImage);
    }
    if (coverImageFile) {
      formData.append('Coverteam', updatedTeam.coverImage);
    }

    // Create headers
    const headers = this.userService.getHeaders();

    // Make the HTTP request and return the result
    return this.http.put<Team>(url, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error in updateTeam:', error);
        return throwError(error);
      })
    );
  }


  retrieveMemberByUserId(userId: string): Observable<Member> {
    const url = `${this.baseUrl}/teams/memberByUserId/${userId}`;
    const headers = this.userService.getHeaders();
    return this.http.get<Member>(url, { headers }).pipe(
      tap(response => console.log('Raw response:', response)),  // Log the raw response
      map(response => {
        let member = new Member();
        // ... assign other properties of the member
        member.team = new Team(response.team); // Assign the team data from the response
        return member;
      })
    );
  }

  // Retrieve a team by ID
  retrieveById(id: string): Observable<Team> {
    const url = `${this.baseUrl}/teams/retrieveById/${id}`;
    const headers = this.userService.getHeaders();
    return this.http.get<Team>(url, { headers });
  }


// Get team by user email
getTeamByUserEmail(email: string): Observable<Team> {
  const url = `${this.baseUrl}/teams/getTeamByUserEmail/${email}`;
  const headers = this.userService.getHeaders();
  return this.http.get<Team>(url, { headers });
}

retrieveMemberById(id: string): Observable<Member> {
  const url = `${this.baseUrl}/teams/member/${id}`;
  const headers = this.userService.getHeaders();
  return this.http.get<Member>(url, { headers }).pipe(
    map(response => {
      let member = new Member();
      // ... assign other properties of the member
      member.team = new Team(response.team); // Assign the team data from the response
      return member;
    })
  );
}

  // Add members to a team
addMembersToTeam(email: string, tid: string): Observable<Team> {
  const url = `${this.baseUrl}/teams/AddMembers/${email}/${tid}`;
  const headers = this.userService.getHeaders();
  return this.http.post<Team>(url, {}, { headers });
}


  updateMemberRole(mid: string, newRole: Member): Observable<Member> {
    const url = `${this.baseUrl}/teams/updateMemberRole/${mid}`;
    const headers = this.userService.getHeaders();
    return this.http.put<Member>(url, newRole, { headers }).pipe(
      tap(() => {
        this.roleUpdated.emit();
      })
    );
  }


  // Retrieve all teams
  retrieveAll(): Observable<Team[]> {
    const url = `${this.baseUrl}/teams/retrieveAll`;
    const headers = this.userService.getHeaders();
    return this.http.get<Team[]>(url, { headers });
  }

   // Retrieve all teams
   retrieveAllUsers(): Observable<Team[]> {
    const url = `${this.baseUrl}/teams/allUsers`;
    const headers = this.userService.getHeaders();
    return this.http.get<Team[]>(url, { headers });
  }

  // Retrieve all members
  retrieveAllMembers(): Observable<Member[]> {
    const url = `${this.baseUrl}/teams/members`;
    const headers = this.userService.getHeaders();
    return this.http.get<Member[]>(url, { headers });
  }

  // Delete a team
  deleteTeam(id: string): Observable<void> {
    const url = `${this.baseUrl}/teams/deleteTeam/${id}`;
    const headers = this.userService.getHeaders();
    return this.http.delete<void>(url, { headers });
  }

  // Delete a member
  deleteMember(mid: string): Observable<void> {
    const url = `${this.baseUrl}/teams/DeleteMember/${mid}`;
    const headers = this.userService.getHeaders();
    return this.http.delete<void>(url, { headers });
  }
}
