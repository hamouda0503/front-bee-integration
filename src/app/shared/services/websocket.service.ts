import { Injectable } from '@angular/core';
import { Stomp, CompatClient } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from '../model/message';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private url = 'http://localhost:8080'; // Replace with your API base URL

  private stompClient!: CompatClient;
  private messageSubject = new BehaviorSubject<Message | null>(null);
  private token =this.storageservice.getAccessToken();

  constructor(private storageservice: StorageService) { }

  connect(id: String): void {
    const socketUrl = `${this.url}/ws?channelId=${id}&Authorization=${this.token}`;
    const socket = new SockJS(socketUrl);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/user/room/messages', (message) => {
        this.messageSubject.next(JSON.parse(message.body));
      });

    });
  }

  sendPrivateMessage(msg: String, channelId: string): void {
    this.stompClient.send("/chat/send", {}, JSON.stringify({
      "chatRoom": { "id": channelId },
      "content": msg
    }
    ));
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }
}
