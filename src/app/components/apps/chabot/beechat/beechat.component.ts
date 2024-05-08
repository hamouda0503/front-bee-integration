import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormGroup and Validators
import { ChatBotService} from "../../../../shared/services/chatbot.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface ChatMessage {
  user: string;
  message: string;
}

@Component({
  selector: 'app-beechat',
  templateUrl: './beechat.component.html',
  styleUrls: ['./beechat.component.scss']
})
export class BeechatComponent {

  messageForm: FormGroup; // Create a FormGroup

  constructor(private fb: FormBuilder,
              private chatbot: ChatBotService,
              public router: Router,
              private toastr: ToastrService) {

    this.messageForm = this.fb.group({
      message: ['', Validators.required] // Add validation if needed
    });
  }

  messages: ChatMessage[] = [];

  sendMessage() {
    const message = this.messageForm.get('message')?.value; // Access message from FormGroup
    if (message) {
      this.messages.push({ user: 'You', message });

      this.chatbot.chatbot(message).subscribe((content) => {

        console.log(content);
        this.messages.push({ user: 'Bot', message: content.message});
      }, (error) => {
        console.error('Error:', error); // Handle errors from service call
        this.toastr.error('An error occurred. Please try again.', 'Chatbot Error'); // Display error message
      });

      this.messageForm.reset(); // Reset the form after sending
    } else {
      console.error('Message is required.');
      this.toastr.error('Please enter a message.', 'Chatbot Error');
    }
  }

}
