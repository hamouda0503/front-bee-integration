import { Component } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ActivatedRoute , Router } from '@angular/router';
@Component({
  selector: 'app-rerouteafterjoin',
  templateUrl: './rerouteafterjoin.component.html',
  styleUrls: ['./rerouteafterjoin.component.scss']
})
export class RerouteafterjoinComponent {

  chatID: string = this.ar.snapshot.params['id'] || null;
  constructor(
    private ar: ActivatedRoute,
    private router: Router,
    private ChatService: ChatService
  ) { }

  ngOnInit(): void {
    
    if(this.chatID){
      this.ChatService.joinConversation(this.chatID).subscribe(
        (res) => {
          this.router.navigate(['/chat', this.chatID]);
        },
        (err) => {
          console.log(err);
        }
      );
    }else{
      this.router.navigate(['/chat']);
    }
  }


}
