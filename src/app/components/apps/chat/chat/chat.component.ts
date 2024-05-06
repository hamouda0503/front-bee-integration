import { Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import { ChatService } from '../../../../shared/services/chat.service';
import { TeamService } from 'src/app/shared/services/team.service';
import { MemberService } from 'src/app/shared/services/member.service';
import { Member } from 'src/app/shared/model/member.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { User } from 'src/app/shared/model/user.model';
import { Team } from 'src/app/shared/model/team.model';
import { Router } from '@angular/router';
import { Message } from 'src/app/shared/model/message';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { ChatRoom } from 'src/app/shared/model/chatroom';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('chatFrame')
  chatFrame!: ElementRef;

  currentChatRoom: ChatRoom ;
  lastMessages: Message[] = [];
  chatID: string = this.ar.snapshot.params['id'];
  roomHistory: Message[] = [];

  //user: User = JSON.parse(localStorage.getItem('user') || '{}');

  public openTab: string = "profile";
  public chatRooms: ChatRoom[] = [];
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
  conversation:Message[];
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

  constructor(private ar: ActivatedRoute, private chatService: ChatService, private teamService: TeamService, private memberService: MemberService, private storageservice: StorageService, private router: Router,  private webSocketService: WebsocketService) {
    const currentUser = this.storageservice.getUser();
    this.userId = currentUser.id;

  }
user:User;
  ngOnInit() {

    console.log('user chatrooms ',this.getUserChatRooms);
    //this.webSocketService.connect(this.chatID);
    this.webSocketService.connect("662f0008c217940796255428");
    this.webSocketService.getMessageSubject().subscribe(message => {
      if (message) {
        this.roomHistory.push(message);
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    });
    this.getProfile();
    this.user = this.storageservice.getUser();
    const currentUser = this.storageservice.getUser();
    this.userId = currentUser.id;
    this.currentImage = currentUser.imageUrl;
    this.userImage = this.storageservice.getUser().imageUrl;
    this.teamService.getTeamByUserEmail(currentUser.email).subscribe(team => {
      this.team1 = team;
      console.log('Team Retrieved', this.team1);
    });

    this.teamService.retrieveMemberByUserId(this.user.id).subscribe(member => {
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
   // this.getUserChatRooms();
  }

  public toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    const text = `${event.emoji.native}`;
    this.chatText = text;
    this.showEmojiPicker = false;
  }

  firstLoad() {
    const msgID: string = this.lastMessages.find(msg => msg.chatRoom.id == this.chatID)?.id;
    let msg = this.setUpDummyMessage(msgID, this.chatID);
   // this.loadChatRoomHistory();
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
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
  loadChatRooms(): void {
    const currentUser = this.storageservice.getUser();

    this.chatService.getUserChatRoomsByTeamId(this.team.id).subscribe({
      next: (chatRooms) => {
        this.chatRooms = chatRooms;
        this.currentChatRoom = chatRooms[0];
        this.loadChatRoomMessages(this.chatRooms[0].id);

        console.log('Chat rooms:', this.chatRooms);
      },
      error: (err) => {
        console.error('Failed to fetch chat rooms', err);
      }
    });

  }
  getUserChatRooms() {
    this.chatService.getUserChatRooms().subscribe(
      chatRooms => {
        if (chatRooms.length > 0) {
          console.log('Chat rooms:', chatRooms);
          // Save last messages for chat rooms
          this.lastMessages = []; // Clear previous messages
          this.chatRooms = chatRooms; // Store chat rooms separately
          // Load messages for the first chat room by default
        }
      },
      error => {
        console.error('Error fetching chat rooms:', error);
      }
    );
  }
  loadChatRoomMessages(chatRoomId: string) {
    // Clear previous messages
    this.roomHistory = [];
    // Call your chat service method to load messages for the chat room
    this.chatService.getchatroomMessages(chatRoomId).subscribe(
      messages => {
        // Save loaded messages
        this.roomHistory = messages;
      },
      error => {
        console.error('Error loading messages:', error);
      }
    );
  }




  setUpDummyMessage(messageID: string, chatID: string): Message {
    let msg: Message = {
      id: messageID,
      chatRoom: { id: '0', name: '', users: [] },
      sender: { id: "", firstname: '', imageUrl: '' },
      content: '',
      attachment: null,
      createdAt: new Date(),
      seen: false
    };
    msg.chatRoom.id = chatID;
    return msg;
  }

  /*loadChatRoomHistory(id: string) {
    this.chatService.getChatRoomHistory(id).subscribe(
      messages => {
        this.conversation = messages;
        console.log('Chat room history:', this.conversation);
      },
      error => {
        console.error('Error fetching chat room history:', error);
      }
    );

  }*/

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

  scrollToBottom(): void {
    try {
      this.chatFrame.nativeElement.scrollTop = this.chatFrame.nativeElement.scrollHeight;
    } catch (err) { }
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
  getChatRoomsLastMessages(rooms: ChatRoom[]) {
    const roomIds = rooms.map(room => room.id);
    this.chatService.getLastMessages(roomIds).subscribe(
      messages => {
        this.lastMessages = messages;
        if (this.chatID) {
          this.firstLoad();
        }
      },
      error => {
        console.error('Error fetching last messages:', error);
        // Handle error (optional)
      }
    );
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

  // Get user Profile
  public getProfile() {
    this.chatService.getCurrentUser().subscribe(userProfile => this.profile = userProfile)
  }


  mobileMenu() {
    this.mobileToggle = !this.mobileToggle;
  }
  getMessageIdFromRoute(): string | null {
    const idParam = this.ar.snapshot.paramMap.get('id');
    return idParam !== null ? idParam : null;
}

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const scrollElement = event.target;
    if (scrollElement.scrollTop === 0) {
     // this.loadChatRoomHistory(this.roomHistory[0])
    }
  }

  @ViewChild('messageInput')
  messageInput!: ElementRef<HTMLInputElement>;

  sendMessage(): void {
    const message = this.messageInput.nativeElement.value.trim();
    if (message) {
      this.chatService.sendMessage(message, this.chatID).subscribe(
        () => {
          // Handle success (optional)
          this.messageInput.nativeElement.value = '';
        },
        error => {
          console.error('Error sending message:', error);
          // Handle error (optional)
        }
      );
    }
  }
}
