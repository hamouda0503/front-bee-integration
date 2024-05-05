import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogEvent } from '../../model/BlogEvent.model';
import {AuthService} from "../auth.service";
import {StorageService} from "../storage.service";
import {Publication} from "../../model/publication.model"; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class BlogEventService {
  private apiUrl = 'http://localhost:8080/api/v1/blog-events'; // Replace with your actual API endpoint

  constructor(private http: HttpClient, private  sto:StorageService,private authService: AuthService) {}

  private createHeaders(): HttpHeaders {
    const token = this.sto.getAccessToken(); // authService should have a method to get the current token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }
  public addBlogEvent(event: BlogEvent): Observable<BlogEvent> {
    const body = JSON.stringify(event);
    return this.http.post<BlogEvent>(this.apiUrl+'/', body, { headers: this.createHeaders() });
  }
  public addPublicationAndUpdateParticipants(eventId: string, publication: Publication): Observable<void> {
    const body = JSON.stringify(publication);
    return this.http.post<void>(`${this.apiUrl}/${eventId}/publications`, body, { headers: this.createHeaders() });
  }
  public getBlogEvents(): Observable<BlogEvent[]> {
    return this.http.get<BlogEvent[]>(this.apiUrl+'/', { headers: this.createHeaders() });
  }

  public getBlogEventById(id: string): Observable<BlogEvent> {
    return this.http.get<BlogEvent>(`${this.apiUrl}/${id}`, { headers: this.createHeaders() });
  }

  public updateBlogEvent(id: string, event: BlogEvent): Observable<BlogEvent> {
    return this.http.put<BlogEvent>(`${this.apiUrl}/${id}`, event);
  }

  public deleteBlogEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


}
