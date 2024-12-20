import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgForm } from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http'; // Import HttpClient
import { PublicationService } from '../../../../shared/services/blog/publication.service'; // Adjust the path as necessary
import { StorageService } from 'src/app/shared/services/storage.service';
import {User} from "../../../../shared/model/user.model";
import {UserService} from "../../../../shared/services/user.service";
enum BlogSubject {
  DocumentsAdministratifs = "Paperwork",
  Innovation = "Innovation",
  Reglementations = "Legislation",
  Finance = "Finance",
  Autre = "Other"
}

interface Suggestion {
  word: string;
  score?: number;  // assuming the API might return a relevance score
}



@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {
  myuser: User;
  public subjects = Object.values(BlogSubject);
  public ClassicEditor = ClassicEditor;
  public postModel = {
    content: '',
    sujet: '',
    user: {}
  };
  suggestions : string []=[]; // Array to hold suggestions
  suggestion =''; //
  constructor(private publicationService: PublicationService,private userservice: UserService
,private storage: StorageService, private http: HttpClient) {

  }

  ngOnInit(): void {
   
  }


  handleKeydown(event: KeyboardEvent) {
    const { key } = event;
    if (key === 'Tab' && this.suggestion) {
      event.preventDefault(); // Prevent default Tab key behavior
      this.postModel.content += this.suggestion; // Append suggestion to content
      this.suggestion = ''; // Clear suggestion
    } else if (key.length === 1 || key === 'Backspace') {
      this.fetchSuggestions(this.postModel.content);
    }
  }
  acceptSuggestion(suggestion: string): void {
    const words = this.postModel.content.split(' ');
    words[words.length - 1] = suggestion;
    this.postModel.content = words.join(' ');
    this.suggestions = []; // Clear suggestions
  }




  fetchSuggestions(input: string): void {
    const apiUrl = 'https://api.datamuse.com/sug';
    const params = new HttpParams().set('s', input);

    this.http.get<any[]>(apiUrl, { params })
      .subscribe({
        next: (response) => {
          this.suggestions = response.map((item: any) => item.word);
        },
        error: (error) => console.error('Error fetching suggestions', error)
      });
  }



  onSubmit(form: NgForm) {
    console.log('Form submit attempted', form.value);
    if (!form.valid) {
      console.error('Form is not valid', form);
      return;
    }
    const newPost = {
      content: form.value.content,
      sujet: form.value.sujet,
    };

    if (this.storage.getUser()) {

      console.log(newPost);
    } else {
      console.error('No user data found in storage');
      // Handle the error appropriately, e.g., redirect to login or show an error message
      return;
    }

    console.log('Sending publication with user info',newPost);
    this.publicationService.addPublication(newPost,this.storage.getUser().id).subscribe({
      next: (response) => {
        console.log('Publication added', response);
        form.reset();
        // Optionally navigate to another route or perform other actions upon success
      },
      error: (error) => {
        console.error('Error adding publication', error);
      }
    });
  }


}
