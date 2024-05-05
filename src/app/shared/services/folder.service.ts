import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../model/folder.model';
import { UserService } from './user.service';  
import { Project } from '../model/project.model';


@Injectable({
    providedIn: 'root'
  })
  export class FolderService {
    private baseUrl = 'http://localhost:8080/api/v1/folders';  
  
    constructor(private http: HttpClient, private userService: UserService) { }
  
    addSubFolder(parentId: string, folder: Folder): Observable<Folder> {
      const headers = this.userService.getHeaders();  
      return this.http.post<Folder>(this.baseUrl+ "/create-sub-folder/" + parentId , folder, { headers });

    }
    getParentFolder(projectid: string): Observable<Folder> {
      const headers = this.userService.getHeaders();  
      return this.http.get<Folder>(this.baseUrl+ "/ParentFolder/" + projectid, { headers });

    }
    getFoldersByProject(projectFolderID: string): Observable<Folder[]> {
      const headers = this.userService.getHeaders();  
      return this.http.get<Folder[]>(this.baseUrl+ "/ProjectFolders/" + projectFolderID, { headers });
    }
    getFolder(folderID: string): Observable<Folder> {
      const headers = this.userService.getHeaders();  
      return this.http.get<Folder>(this.baseUrl+ "/" + folderID, { headers });
    }
    deleteFolder(folderID: string): Observable<Folder> {
      const headers = this.userService.getHeaders();  
      return this.http.delete<Folder>(this.baseUrl+ "/" + folderID, { headers });
    }
    getFoldersByParent(folderID: string): Observable<Folder[]> {
      const headers = this.userService.getHeaders();  
      return this.http.get<Folder[]>(this.baseUrl+ "/byParent/" + folderID, { headers });
    }
    
  
  }
  