import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { SharedModule } from '../../../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';

import { ChatComponent } from './chat/chat.component';
import { ChatboxAddModalComponent } from './chatbox-add-modal/chatbox-add-modal.component';
import { RerouteafterjoinComponent } from './rerouteafterjoin/rerouteafterjoin.component';



@NgModule({
  declarations: [ChatComponent, ChatboxAddModalComponent, RerouteafterjoinComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatRoutingModule,
    PickerModule,
    EmojiModule,
    SharedModule
  ]
})
export class ChatModule { }
