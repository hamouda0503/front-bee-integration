import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
// import {environment} from '../../../environments/environment';

import {environment} from "../../../environments/environment";
import {UpdatePasswordRequest} from "../model/upPassReq.model";
import { VerificationRequest } from '../../shared/model/verification-request';
import { AuthenticationResponse } from '../../shared/model/authentication-response';




const AUTH_API = environment.baseUrl + "auth/";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const httpOptions1 = {
  headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})
};

@Injectable({
  providedIn: 'any',
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'authenticate',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  // register(firstName: string, lastName: string, imageUrl: string, email: string, password: string, confirmPassword: string, role: string): Observable<any> {
  //   return this.http.post(
  //     AUTH_API + 'register',
  //     {
  //       firstName,
  //       lastName,
  //       imageUrl,
  //       email,
  //       password,
  //       confirmPassword,
  //       role
  //     },
  //     httpOptions
  //   );
  // }

  register(formData: FormData): Observable<any> {
    return this.http.post(
      AUTH_API + 'register',
      formData
    );
  }

  ForgotPassword(email: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'forgot-password',
      {

        email

      },
      httpOptions
    );
  }

  ResetPasword(request: UpdatePasswordRequest): Observable<any> {
    return this.http.post(
      AUTH_API + 'reset-password',
      {
       request

      },
      httpOptions
    );
  }


  refreshToken() {
    return this.http.post(AUTH_API + 'refreshtoken', {}, httpOptions);
  }
  ActivateAccount(token: string) {
    return this.http.get(AUTH_API + 'activate-account?token='+token);
  }

 


  verifyCode(verificationRequest: VerificationRequest): Observable<any>  {
    return this.http.post<any>
    (AUTH_API+`verify`, verificationRequest);
  }




}
