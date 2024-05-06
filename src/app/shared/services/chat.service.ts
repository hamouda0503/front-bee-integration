import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { chat, ChatUsers } from '../model/chat.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatRoom } from '../model/chatroom';
import { User } from '../model/user.model';
import { Message } from '../model/message';
import { Team } from '../model/team.model';
import { Member, MemberRole } from '../model/member.model';
import { EventEmitter } from '@angular/core';
import { tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

var today = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = 'http://localhost:8080'; // Replace with your API base URL


  public observer: Subscriber<{}>;
  public chat: any[] = []
  public users: any[] = []


  constructor(private http: HttpClient, private storageservice: StorageService, private userService: UserService) {

  }




  getUserChatRooms(): Observable<ChatRoom[]> {
    const getUserChatRoomsUrl = `${this.baseUrl}/chat/rooms`;
    const headers = this.userService.getHeaders();
    return this.http.get<ChatRoom[]>(getUserChatRoomsUrl,{ headers } );
  }
  getUserChatRoomsByTeamId(id: string): Observable<ChatRoom[]> {
    const getUserChatRoomsUrl = `${this.baseUrl}/chat/rooms/${id}`;
    const headers = this.userService.getHeaders();
    return this.http.get<ChatRoom[]>(getUserChatRoomsUrl,{ headers } );
  }
  getchatroomMessages(id: string): Observable<Message[]> {
    const url = `${this.baseUrl}/chat/rooms/${id}/messages`;
    const headers = this.userService.getHeaders();
    return this.http.get<Message[]>(url,{ headers } );
  }
  /////////////////////////////
  getLastMessages(chatRoomIds: string[]): Observable<Message[]> {
    const url = `${this.baseUrl}/chat/rooms/last`;
    const headers = this.userService.getHeaders();
    return this.http.post<Message[]>(url, chatRoomIds);
  }



  getChatRoomLastMessage(chatrooms: ChatRoom[]): Observable<Message[]> {
    const getChatRoomLastMessageUrl = `${this.baseUrl}/chat/rooms/last`;
    const headers = this.userService.getHeaders();
    return this.http.post<Message[]>(getChatRoomLastMessageUrl, chatrooms);
  }



  searchChatRooms(search: string): Observable<ChatRoom[]> {
    const searchChatRoomsUrl = `${this.baseUrl}/chat/rooms/search`;
    const headers = this.userService.getHeaders();
    return this.http.post<ChatRoom[]>(searchChatRoomsUrl, { search });
  }




  // Retrieve all teams
  retrieveAllUsers(): Observable<Team[]> {
    const url = `${this.baseUrl}/teams/allUsers`;
    const headers = this.userService.getHeaders();
    return this.http.get<Team[]>(url, { headers });
  }

  // Get User Data
  public getUsers(): Observable<ChatUsers[]> {
    const users = new Observable(observer => {
      observer.next(this.users);
      observer.complete();
    });
    return <Observable<ChatUsers[]>>users;
  }

  retrieveAllMembers(): Observable<Member[]> {
    const url = `${this.baseUrl}/teams/retrieveAllMembers`;
    const headers = this.userService.getHeaders();
    return this.http.get<Member[]>(url, { headers });
  }

  // Get cuurent user
  public getCurrentUser() {
    return this.getUsers().pipe(map(users => {
      return users.find((item) => {
        return item.authenticate === 0;
      });
    }));
  }

  // chat to user
  public chatToUser(id: number) {
    return this.getUsers().pipe(map(users => {
      return users.find((item) => {
        return item.id === id;
      });
    }));
  }

  // Get users chat
  public getUserChat(): Observable<chat[]> {
    const chat = new Observable(observer => {
      observer.next(this.chat);
      observer.complete();
    });
    return <Observable<chat[]>>chat;
  }

  // Get chat History
  public getChatHistory(id: number) {
    return this.getUserChat().pipe(map(users => {
      return users.find((item) => {
        return item.id === id;
      });
    }));
  }

  getChatRoomMessages(chatRoomId: string): Observable<Message[]> {
    const url = `${this.baseUrl}/chat/rooms/${chatRoomId}/messages`;
    return this.http.get<Message[]>(url);
  }


  // Modify the sendMessage method in ChatService
  public sendMessage(message: string, chatRoomId: string): Observable<any> {
    const url = `${this.baseUrl}/send`;
    const headers = this.userService.getHeaders();
    const body = { message, chatRoomID: chatRoomId };
    return this.http.post(url, body, { headers });
  }


  public responseMessage(chat) {

    this.chat.filter(chats => {
      if (chats.id == chat.receiver) {
        setTimeout(() => {
          chats.message.push({ sender: chat.receiver, time: today.toLowerCase(), text: 'Hey This is ' + chat.receiver_name + ', Sorry I busy right now, I will text you later' })
        }, 2000);
        setTimeout(function () {
          document.querySelector(".chat-history").scrollBy({ top: 200, behavior: 'smooth' });
        }, 2310)
      }
    })
  }

}
