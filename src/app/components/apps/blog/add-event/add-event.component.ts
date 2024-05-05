import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgForm } from '@angular/forms';
import { BlogEventService } from '../../../../shared/services/blog/blogEvent.service'; // Adjust the import path
import { StorageService } from 'src/app/shared/services/storage.service';
import { BlogEvent } from "../../../../shared/model/BlogEvent.model";
import { BlogEventType } from "../../../../shared/model/BlogEventType.enum";
import {BlogSubject} from "../../../../shared/model/Blogsubject.enum"; // Import your BlogEvent model



@Component({
  selector: 'app-add-event', // Make sure the selector matches the file name and usage
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  public subjects = Object.values(BlogEventType );
  public ClassicEditor = ClassicEditor;
  public eventModel: BlogEvent = {
    description: "", endDate: undefined, eventType: undefined, startDate: undefined, title: "" // Use the actual BlogEvent model structure here
    // Initialize with default values as necessary
  };

  constructor(
    private blogEventService: BlogEventService, // Use the BlogEvent service
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    // Initialize component
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      console.error('Form is not valid:', form);
      return;
    }

    // Additional logic before submission, if needed
    console.log(this.eventModel);
    this.blogEventService.addBlogEvent(this.eventModel).subscribe({ // Use the addBlogEvent method
      next: (response) => {
        console.log('Blog event added:', response);
        form.reset();
        // Navigate or perform success action
      },
      error: (error) => {
        console.error('Error adding blog event:', error);
      }
    });
  }
}
