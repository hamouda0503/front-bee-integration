import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/chatbox/message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{UserService} from './user.service';
import{StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = 'http://localhost:8080/';
  private token =this.storageservice.getAccessToken();
  constructor(private http: HttpClient, private storageservice: StorageService, private userService: UserService) { }

  getMessages(chatID: string): Observable<Message[]> {
    const headers = this.userService.getHeaders();
    return this.http.get<Message[]>(`${this.baseUrl}get/${chatID}`, { headers });
  }
}
