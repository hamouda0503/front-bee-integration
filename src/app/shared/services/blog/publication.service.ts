import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publication } from '../../model//publication.model';
import { AuthService } from "../auth.service";
import {User} from "../../model//user.model";
import {StorageService} from "../storage.service"; // Make sure the path is correct.

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private baseUrl = 'http://localhost:8080/api/v1/publications';

  constructor(private http: HttpClient, private  sto:StorageService,private authService: AuthService) {}

  private createHeaders(): HttpHeaders {
    const token = this.sto.getAccessToken();  // Retrieves the token from AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  getAllPublications(): Observable<Publication[]> {
    return this.http.get<Publication[]>(this.baseUrl, { headers: this.createHeaders() });
  }

  getPublicationById(id: string): Observable<Publication> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Publication>(url, { headers: this.createHeaders() });
  }

  addPublication(publication: Object, id: string): Observable<Publication> {
    const body = JSON.stringify(publication);
    return this.http.post<Publication>(this.baseUrl+"/"+id, body, { headers: this.createHeaders() });
  }

  deletePublication(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, { headers: this.createHeaders() });
  }

  updatePublication(id:string,publication: Object): Observable<Publication> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Publication>(url, publication, { headers: this.createHeaders() });
  }

  addLikeToPublication(publicationId: string, userId: string): Observable<any> {
    const url = `${this.baseUrl}/${publicationId}/like`;
    return this.http.post(url, { userId }, { headers: this.createHeaders() });
  }

  removeLikeFromPublication(publicationId: string,  userId: string): Observable<any> {
    const url = `${this.baseUrl}/${publicationId}/like`;
    return this.http.request('delete', url, {
      headers: this.createHeaders(),
      body: { userId }
    });
  }

  getPublicationsByUserId(userId: string): Observable<Publication[]> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.get<Publication[]>(url, { headers: this.createHeaders() });
  }
}
