// src/app/shared/services/blog/comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {StorageService} from "../storage.service";
import { Comment } from '../../model//comment.model';
import {AuthService} from "../auth.service"; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8080/api/v1/comments'; // Update this to the correct API endpoint for comments


  constructor(private http: HttpClient,  private  sto:StorageService,private authService: AuthService) {}

  private createHeaders(): HttpHeaders {
    const token = this.sto.getAccessToken(); // authService should have a method to get the current token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  // Get all comments for a publication
  getCommentsByPublicationId(publicationId: string): Observable<Comment[]> {
    const url = `${this.baseUrl}/publications/${publicationId}`;
    const headers = this.createHeaders();
    return this.http.get<Comment[]>(url, { headers });
  }

  // Add a new comment to a publication
  addComment(comment: Object,publicationId: string,userId: string): Observable<Comment> {
    const url = `${this.baseUrl}/publications/${publicationId}/${userId}`;
    const headers = this.createHeaders();
    return this.http.post<Comment>(url, comment, { headers });
  }

  // Update an existing comment
  updateComment(commentId: string, comment: Object): Observable<Comment> {
    const url = `${this.baseUrl}/${commentId}`;
    const headers = this.createHeaders();
    return this.http.put<Comment>(url, comment, { headers });
  }

  // Delete a comment
  deleteComment(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    const headers = this.createHeaders();
    return this.http.delete(url, { headers });
  }
  // Add a like to a specific comment
  addLikeToComment(commentId: string, userId: string): Observable<any> {
    const url = `${this.baseUrl}/${commentId}/like`;
    const body = JSON.stringify({ userId });
    return this.http.post(url, body, { headers: this.createHeaders() });
  }

  // Remove a like from a specific comment
  removeLikeFromComment(commentId: string,userId: string): Observable<any> {
    const url = `${this.baseUrl}/${commentId}/like`;
    return this.http.delete(url, {
      headers: this.createHeaders(),
      body: { userId }
    });
  }

  // Add more CRUD operations if necessary
}
