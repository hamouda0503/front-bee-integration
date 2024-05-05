import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
// import {environment} from '../../../environments/environment';

import {environment} from "../../../environments/environment";
import {UpdatePasswordRequest} from "../model/upPassReq.model";
import { VerificationRequest } from '../../shared/model/verification-request';
import { AuthenticationResponse } from '../../shared/model/authentication-response';


interface ChatResponse {
    message: string;
  }

const AUTH_API = environment.baseUrl + "chatbot/";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const httpOption2s = {
    headers: new HttpHeaders({'Content-Type': 'text/plain'})
  };
const httpOptions1 = {
  headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})
};

@Injectable({
  providedIn: 'any',
})
export class ChatBotService {
  constructor(private http: HttpClient) {
  }

 
//   chatbot(message: string):Observable<any> {
//     return this.http.get(AUTH_API + 'ai/chat?message='+message,httpOptions);
//   }


chatbot(message: string): Observable<ChatResponse> {
    return this.http.get<ChatResponse>(AUTH_API + 'ai/chat?message=' + message,httpOption2s);
  }





}
