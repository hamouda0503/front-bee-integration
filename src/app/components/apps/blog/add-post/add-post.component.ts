import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgForm } from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http'; // Import HttpClient
import { PublicationService } from '../../../../shared/services/blog/publication.service'; // Adjust the path as necessary
import { StorageService } from 'src/app/shared/services/storage.service';
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
  public subjects = Object.values(BlogSubject);
  public ClassicEditor = ClassicEditor;
  public postModel = {
    content: '',
    sujet: ''
  };
  suggestions : string []=[]; // Array to hold suggestions
  suggestion =''; //
  constructor(private publicationService: PublicationService
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

    // Assuming this.storage.getUser() returns the user data or null if not logged in
    const user = this.storage.getUser();
    if (user) {
      // Set the user data to the postModel user property
      // Ensure your postModel has a property to hold user data, e.g., 'user'
     // this.postModel.user = user;
      console.log(this.postModel);
    } else {
      console.error('No user data found in storage');
      // Handle the error appropriately, e.g., redirect to login or show an error message
      return;
    }

    console.log('Sending publication with user info', this.postModel);
    this.publicationService.addPublication(this.postModel).subscribe({
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
