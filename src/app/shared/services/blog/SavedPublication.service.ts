import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SavedPublication } from  '../../model//SavedPublication.model';
import { AuthService } from '../auth.service';
import {Publication} from "../../model//publication.model";
import {tap} from "rxjs/operators";
import {StorageService} from "../storage.service";

@Injectable({
  providedIn: 'root'
})
export class SavedPublicationService {
  private baseUrl = 'http://localhost:8080/api/v1/saved-publications';

  constructor(private http: HttpClient,private  sto:StorageService, private authService: AuthService) {}

  private createHeaders(): HttpHeaders {
    const token = this.sto.getAccessToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  savePublication(savedPublication: SavedPublication): Observable<void> {
    const body = JSON.stringify(savedPublication);
    return this.http.post<void>(this.baseUrl, body, { headers: this.createHeaders() });
  }

  getAllPublicationsByUser(userId: string): Observable<Publication[]> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.get<Publication[]>(url, { headers: this.createHeaders() });
  }


  deletePublication(publicationId: string,userId:string): Observable<any> {
    console.log(publicationId,"test",userId);
    const url = `${this.baseUrl}/${publicationId}/${userId}`;
    return this.http.delete(url, { headers: this.createHeaders() }).pipe(
      tap(response => console.log(response))
    );
  }
}
