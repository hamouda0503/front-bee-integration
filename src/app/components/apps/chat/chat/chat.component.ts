import { Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import { ChatService } from '../../../../shared/services/chat.service';
import { TeamService } from 'src/app/shared/services/team.service';
import { MemberService } from 'src/app/shared/services/member.service';
import { Member } from 'src/app/shared/model/member.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { User } from 'src/app/shared/model/user.model';
import { Team } from 'src/app/shared/model/team.model';
import { Router } from '@angular/router';
import { Message } from 'src/app/shared/model/chatbox/message.model';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { Conversation } from 'src/app/shared/model/chatbox/conversation.model';
import{MessageService} from 'src/app/shared/services/message.service';
import { ConversationType } from 'src/app/shared/model/chatbox/conversation-type.enum';
import{ShowJoinURLComponent } from '../show-join-url/show-join-url.component';
import { ChatboxAddModalComponent } from '../chatbox-add-modal/chatbox-add-modal.component';
import Swal from 'sweetalert2';


declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messageInput')
  messageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('chatFrame')
  chatFrame!: ElementRef;
  currentChatRoom1: any = {};
  currentChatRoom: Conversation = {} as Conversation;
  lastMessages: Message[] = [];
  chatID: string = this.ar.snapshot.params['id'];
  roomHistory: Message[] = [];

  chatRooms: Conversation[] = [];
  userid: string;

  private routeSub!: Subscription;
  private messageSubscription!: Subscription;

  //user: User = JSON.parse(localStorage.getItem('user') || '{}');

  public openTab: string = "profile";
  public chatUser: any;
  public profile: any;
  public team1: Team;
  public member: Member;
  public chats: any;
  public chatText: string;
  public error: boolean = false;
  public notFound: boolean = false;
  public currentMemberId: string;
  public id: any;
  public team: Team;
  allMembers: Member[] = [];
  public searchText: string;
  public showEmojiPicker: boolean = false;
  public emojies: any;
  public currentImage: string;
  teamMembers: Member[] = [];
  public mobileToggle: boolean = false
  userId: string;
  conversation: Message[];
  users: any[] = [];
  pagedUsers: any[] = [];
  totalUsers: number = 0;
  pageSize: number = 100;  // Changed to 7 users per page
  currentPage: number = 1;

  userImage: any;
  public userName: string;
  showCreateTeamButton = false;
  currentUser = this.storageservice.getUser();
  currentMember: Member;

  constructor(private dialog: MatDialog, private ar: ActivatedRoute, private chatService: ChatService, private teamService: TeamService, private memberService: MemberService, private storageservice: StorageService, private router: Router,  private webSocketService: WebsocketService, private MessageService: MessageService,) {
    const currentUser = this.storageservice.getUser();
    this.userId = currentUser.id;

  }
user:User;
  ngOnInit() {
    this.routeSub = this.ar.params.subscribe(params => {
      this.chatID = params['id'] || 'GLOBAL';
      this.roomHistory = [];
      this.webSocketService.disconnect();
      this.messageSubscription?.unsubscribe();
      this.storageservice.getUser();
      const currentUser = this.storageservice.getUser();
      this.userId = currentUser.id;
      this.user= currentUser;
    this.currentImage = currentUser.imageUrl;
    this.teamService.getTeamByUserEmail(currentUser.email).subscribe(team => {
      this.team1 = team;
      console.log('Team Retrieved', this.team1);
    });
    this.loadChatRoomHistory();
      this.getUserChatRooms();
      this.loadSelectedChatRoom();
      this.connectToChatRoom();
      this.teamService.retrieveMemberByUserId(this.userId).subscribe(member => {
        this.currentMember = member; // Assign the member data to the variable
        console.log('Current member:', this.currentMember); // Log the current member
      });

      this.teamService.isUserInTeam(currentUser.email).subscribe(isUserInTeam => {
        console.log(isUserInTeam);
        if (isUserInTeam) {
          this.loadTeamMembers();
        } else {
          this.showCreateTeamButton = true;
        }
      });
    });



    this.teamService.retrieveMemberByUserId(this.currentUser.id).subscribe(member => {
      this.currentMember = member; // Assign the member data to the variable
      console.log('Current member:', this.currentMember); // Log the current member
    });
    const currentUser = this.storageservice.getUser();
    this.teamService.isUserInTeam(currentUser.email).subscribe(isUserInTeam => {
      console.log(isUserInTeam);
      if (isUserInTeam) {
        this.loadTeamMembers();
      } else {
        this.showCreateTeamButton = true;
      }
    });
  }

  public toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

   //Connect to chatroom
   connectToChatRoom() {
    if(this.chatID === 'GLOBAL' || this.chatID=="chat") {
     this.currentChatRoom = {
       id : '0',
       name: 'Professor Mental',
       type: ConversationType.PUBLIC,
       imageUrl : 'Image123456.webp',
       lastMessage: '',
       participants: [],
       createdAt: new Date(),
     };
     return;
    }
   this.webSocketService.connect(this.chatID);
   this.messageSubscription = this.webSocketService.getMessageSubject().subscribe(message => {
     if (message) {
       this.currentChatRoom.lastMessage = message.text;
       console.log('Received message:', message);
       this.roomHistory.push(message);
       console.log('Room history:', this.roomHistory);
       setTimeout(() => {
         this.scrollToBottom();
       }, 100);
     }
   });
 }




 openChatDialog() {
  const dialogRef = this.dialog.open(ChatboxAddModalComponent, {
    width: '500px',
    data: {} // You can pass data to your dialog if needed
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Chat created successfully:', result);
      // Handle the result if needed
    }
  });
}

showJoinURLdialog(id: string) {
  const diagRef = this.dialog.open(ShowJoinURLComponent, {
    width: '500px',
    data: {id: id}
  });

  diagRef.afterClosed().subscribe(result => {
    console.log('Join URL dialog closed:', result);
  });

}

  filterChatRooms(e: Event) {

  }

 loadChatRoomHistory() {
  this.MessageService.getMessages(this.chatID).subscribe(
    messages => {
      this.roomHistory = messages;
    },
    error => {
      console.error('Error fetching chat room history:', error);
    }
  );
}

deleteConversation(conversationId: string) {
  this.chatService.deleteConversation(conversationId).subscribe(
    () => {
      // Handle successful deletion
      Swal.fire({
        title: 'Conversation Deleted!',
        text: 'The conversation has been deleted successfully.',
        icon: 'success'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload(); // Reload the page after deletion
        }
      });
    },
    (error) => {
      // Handle error
      console.error('Conversation Deleted',);
      Swal.fire({
        title: 'Deleted',
        text: 'Deleted.',
        icon: 'success'
      });
    }
  );
}


sendMessage(_event?:KeyboardEvent): void {
  if (_event && _event.key !== 'Enter') {
    return;
  }
  const message = this.messageInput.nativeElement.value.trim();
  if (message) {
    this.webSocketService.sendPrivateMessage(message, this.chatID);
    this.messageInput.nativeElement.value = '';
    this.loadChatRoomHistory();
  }
}

  //Load selected chatroom
  loadSelectedChatRoom() {
    if(this.chatID === 'GLOBAL' || this.chatID == "chatbot") {
      return
    };
    this.chatService.getConversation(this.chatID).subscribe(
      chatRoom => {
        this.currentChatRoom = chatRoom;
        this.loadChatRoomHistory();
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      },
      error => {
        console.error('Error fetching chat room:', error);
      }
    );
  }

  addEmoji(event) {
    const text = `${event.emoji.native}`;
    this.chatText = text;
    this.showEmojiPicker = false;
  }

  loadTeamMembers(): void {
    const currentUser = this.storageservice.getUser();

    // Retrieve the team of the current user
    this.teamService.getTeamByUserEmail(currentUser.email).subscribe(team => {
      this.team = team;
      console.log('Retrieved team:', this.team);

      // Retrieve members of the team
      this.teamService.retrieveAllMembers().subscribe({
        next: (members) => {
          console.log('Retrieved members:', members);

          // Filter members to include only those who belong to the current team
          this.teamMembers = members.filter(member =>
            this.team.members.some(teamMember => teamMember.teamMember.email === member.teamMember.email)
          );
          console.log('Team members:', this.teamMembers);
        },
        error: (err) => {
          console.error('Failed to fetch members', err);
        }
      });
    }, error => {
      console.error('Failed to fetch team for user', error);
    });
  }

  getUserChatRooms() {
    this.chatService.getAllConversations().subscribe(
      chatRooms => {
        this.chatRooms = chatRooms;
        console.log(this.getUserChatRooms.length);
      },
      error => {
        console.error('Error fetching chat rooms:', error);
      }
    );
  }

  //Load more messages
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const scrollElement = event.target;
    if (scrollElement.scrollTop === 0) {
      this.loadChatRoomHistory()
    }
  }

  scrollToBottom(): void {
    try {
      this.chatFrame.nativeElement.scrollTop = this.chatFrame.nativeElement.scrollHeight;
    } catch (err) { }
  }

  loadAllMembers(): void {
    this.teamService.retrieveAllMembers().subscribe({
      next: (members) => {
        this.allMembers = members;
      },
      error: (err) => {
        console.error('Failed to fetch all Members', err);
      }
    });
  }

  loadAllUsers(): void {
    this.teamService.retrieveAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.totalUsers = this.users.length;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
      }
    });
  }

  getMember(id: string) {
    this.teamService.retrieveMemberByUserId(id).subscribe(member => {

      this.member = member;
      this.currentMemberId = member.MId;
      console.log('hedha houwa el member', this.member);// Assuming the member object has an 'id' property
    }, error => {
      console.error('Failed to get member:', error);
      // Handle error here
    });
  }

  public tabbed(val) {
    this.openTab = val
  }


  mobileMenu() {
    this.mobileToggle = !this.mobileToggle;
  }
  getMessageIdFromRoute(): string | null {
    const idParam = this.ar.snapshot.paramMap.get('id');
    return idParam !== null ? idParam : null;
}
}

