  // src/app/services/project.service.ts

  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Project } from '../model/project.model';
  import { Storage } from '../model/storage.model';
  import { UserService } from './user.service';

  @Injectable({
    providedIn: 'root'
  })
  export class ProjectService {
    private baseUrl = 'http://localhost:8080/api/v1/projects';

    constructor(private http: HttpClient, private userService: UserService) { }

    addProject(userId: string, project: Object): Observable<Project> {
      const headers = this.userService.getHeaders();
      return this.http.post<Project>(this.baseUrl + '/' + userId, project, { headers });
    }
    getAllProjects(): Observable<Project[]> {
      const headers = this.userService.getHeaders();
      return this.http.get<Project[]>(this.baseUrl, { headers });
    }
    getProjectById(id: string): Observable<Project> {
      const headers = this.userService.getHeaders();
      return this.http.get<Project>(this.baseUrl + "/" + id , { headers });
    }
    getProjectStorage(id: string): Observable<Storage> {
      const headers = this.userService.getHeaders();
      return this.http.get<Storage>(this.baseUrl + "/getStorage/" + id , { headers });
    }
    deleteProject(id: string): Observable<any> {
      const headers = this.userService.getHeaders();
      return this.http.delete(this.baseUrl+ "/" + id, { headers });
    }
    updateProject(id: string, project: Object): Observable<Project> {
      const headers = this.userService.getHeaders();
      return this.http.put<Project>(this.baseUrl + '/' + id, project, { headers });
    }
  }
