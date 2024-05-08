import {Injectable, Optional} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { StorageService } from './storage.service';
import {User} from "../model/user.model";
import {environment} from "../../../environments/environment";

const API_URL = environment.baseUrl;

@Injectable({
  providedIn: 'any'
})
export class UserService {
  private authToken: string | null = null;

  constructor(private http: HttpClient, private storageService: StorageService) {
    this.setAuthToken();
    if (this.authToken) {
      console.log('Auth token retrieved:', this.authToken);
    } else {
      console.log('No auth token found in storage');
    }
  }

  public setAuthToken(): void {
    this.authToken = this.storageService.getAccessToken();
  }



  public getHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization', 'Bearer ' + this.authToken
    )
  }


  getUserById(userId: string): Observable<User> { // Now returns Observable of User type
    console.log(`${API_URL}user/${userId}`);
    return this.http.get<User>( `${API_URL}user/${userId}`, { headers: this.getHeaders() });
  }
  getUserGreeting(): Observable<string> {
    const url = API_URL+"user";
    return this.http.get<string>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }


  getAllUsers(): Observable<any[]> {
    const url = API_URL+"users/all";
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }


  updateUser(email: string, updatedUser: User): Observable<User> {
    const url = API_URL+"user/"+email;


    const httpOptions = {
      headers: this.getHeaders()
    };
    return this.http.put(url, updatedUser, httpOptions)

      .pipe(
        catchError(this.handleError)
      );
  }

  getUserByEmail(email: string): Observable<User> {
    const url = API_URL+"user/"+{email};
    return this.http.get<User>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }


  deactivateAccount(email: string): Observable<any> {
    const url = API_URL+"auth/user/"+{email}+"/deactivate";
    return this.http.put(url, null, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      return throwError('An error occurred: ' + error.error.message);
    } else {
      // Backend returned an unsuccessful response code
      return throwError(
        `Backend returned code ${error.status}, body was: ${error.error}`);
    }
  }





  logout(): Observable<any> {
    return this.http.post<any>(API_URL+ 'auth/logout', {}, { withCredentials: true,headers: this.getHeaders() });
  }
}
