import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { FileBee } from '../model/file.model';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
  })
  export class FileService {
    private baseUrl = 'http://localhost:8080/api/v1/files';  
  
    constructor(private http: HttpClient, private userService: UserService) { }
  
    deleteFile(fileid: string): Observable<FileBee> {
      const headers = this.userService.getHeaders();  
      return this.http.delete<FileBee>(this.baseUrl+ "/delete/" + fileid, { headers });
    }
    getFilesByFolder(projectid: string , folderid: string): Observable<FileBee[]> {
      const headers = this.userService.getHeaders();  
      return this.http.get<FileBee[]>(this.baseUrl+ "/ByFolder/" + projectid+ "/" + folderid, { headers });
    }
    getFilesByOneFolder(folderid: string): Observable<FileBee[]> {
      const headers = this.userService.getHeaders();  
      return this.http.get<FileBee[]>(this.baseUrl+ "/ByOneFolder/" + folderid, { headers });
    }
    uploadFile(file: File, folderPath: string, projectId: string, parentFolder: string): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('folderPath', folderPath);
      formData.append('projectId', projectId);
      formData.append('parentFolder', parentFolder);
      const headers = this.userService.getHeaders();
      return this.http.post(this.baseUrl + "/upload", formData, {
        headers: headers,
        responseType: 'text',
        reportProgress: true,
        observe: 'events'
      });
    }
    
    downloadFile(fileId: string): Observable<HttpResponse<Blob>> {
      const url = `${this.baseUrl}/download/${fileId}`;
      const headers = this.userService.getHeaders();
      return this.http.get(url, {
        headers: headers,
        observe: 'response',
        responseType: 'blob' as 'json'
      }) as Observable<HttpResponse<Blob>>;
    }
    
   
    /*downloadFile(fileId: string): Observable<Blob> {
      const headers = this.userService.getHeaders();
      return this.http.get<Blob>(`${this.baseUrl}/download/${fileId}`, {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response'
      }).pipe(
          tap((response: HttpResponse<Blob>) => {
              this.downloadBlob(response.body, response.headers.get('Content-Disposition'));
          }),
          map(response => response.body) // Extract the Blob from the HttpResponse
      );
  }
  
  
    private downloadBlob(blob: Blob, contentDisposition: string | null): void {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      if (contentDisposition) {
        const filename = contentDisposition.split(';')[1].split('=')[1].replace(/\"/g, '');
        link.download = filename;
      }
      link.click();
      window.URL.revokeObjectURL(url);
    }*/

  }
  
  
  