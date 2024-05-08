import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conversation } from '../model/chatbox/conversation.model';
import { ConversationType } from '../model/chatbox/conversation-type.enum';
import { UserService } from './user.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  baseUrl = 'http://localhost:8080/api/conversations';
  authToken: string = this.storageservice.getAccessToken();
  headers:HttpHeaders = this.userservice.getHeaders();

  constructor(private http: HttpClient, private userservice: UserService, private storageservice: StorageService) { }

  createConversation(conversationData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, conversationData, {
      headers: { 'enctype': 'multipart/form-data', "Authorization": `Bearer ${this.authToken}` }
    });
  }

  joinConversation(conversationId: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.baseUrl}/join/${conversationId}`, { headers : this.headers });
  }

  leaveConversation(conversationId: string): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/leave/${conversationId}`,  { headers : this.headers });
  }

  addUser(conversationId: string, userId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/add/${conversationId}/${userId}`,  { headers : this.headers });
  }

  kickUser(conversationId: string, userId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/kick/${conversationId}/${userId}`,  { headers : this.headers });
  }

  promoteUser(conversationId: string, userId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/promote/${conversationId}/${userId}` ,  { headers : this.headers });
  }

  demoteUser(conversationId: string, userId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/demote/${conversationId}/${userId}`, { headers : this.headers });
  }

  getConversation(conversationId: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.baseUrl}/${conversationId}`, { headers : this.headers });
  }

  updateConversation(conversationId: string, conversation: Conversation): Observable<Conversation> {
    return this.http.put<Conversation>(`${this.baseUrl}/update/${conversationId}`, conversation ,  { headers : this.headers });
  }

  deleteConversation(conversationId: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete/${conversationId}` ,  { headers : this.headers });
  }

  getAllConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/all` ,  { headers : this.headers });
  }

  searchConversations(search: string): Observable<Conversation[]> {
    return this.http.post<Conversation[]>(`${this.baseUrl}/search`, search ,  { headers : this.headers });
  }

}
