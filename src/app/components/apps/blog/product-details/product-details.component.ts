import { Component, OnInit } from '@angular/core';
import { Image } from '@ks89/angular-modal-gallery';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import {BlogEventService} from "../../../../shared/services/blog/blogEvent.service";
import {BlogEvent} from "../../../../shared/model/BlogEvent.model";
import {PublicationService} from "../../../../shared/services/blog/publication.service";
import {StorageService} from "../../../../shared/services/storage.service";
import {NgForm} from "@angular/forms";
import {Publication} from "../../../../shared/model/publication.model";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {
  public postModel = {
    AmIevent:'1',
    content: '',
    user: {}
  };
  public Mypublication:Publication;
  public blogEvent:BlogEvent;
  eventId: string;
  isVisible = false; // Initially hidden
  active = 1;
  public imagesRect: Image[] = [
    new Image(0, { img: 'assets/images/blog/t1.jpg' }, { img: 'assets/images/blog/t1.jpg' }),
    new Image(1, { img: 'assets/images/blog/t2.jpg' }, { img: 'assets/images/blog/t2.jpg' }),
    new Image(2, { img: 'assets/images/blog/t3.jpg' }, { img: 'assets/images/blog/t3.jpg' }),
    new Image(3, {  img: 'assets/images/blog/t4.jpg' }, {  img: 'assets/images/blog/t4.jpg' })]

  constructor(private storage: StorageService,public config: NgbRatingConfig,private route: ActivatedRoute,private blogEventService: BlogEventService,private publicationService: PublicationService) {
    config.max = 5;
		config.readonly = true;
   }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
     this.eventId = params['eventId'];
      console.log('We are in with the id',this.eventId);
      this.blogEventService.getBlogEventById(this.eventId).subscribe(
        (blogEvent: BlogEvent) => {
          this.blogEvent = blogEvent;
        },
        error => {
          console.error('Error retrieving blog event:', error);
        }
      );
    });
  }

  enableSubmitBtn() {
    this.isVisible = true; // Make div visible
  }



  onSubmit(form: NgForm) {
    console.log('Form submit attempted', form.value);
    if (!form.valid) {
      console.error('Form is not valid', form);
      return;
    }

    const user = this.storage.getUser();
    if (!user) {
      console.error('No user data found in storage');
      // Example redirection or error handling:
     // this.router.navigate(['/login']); // Assuming you have a Router imported and set up
      return;
    }

    const publication: Publication = {
      ...form.value,
      user: user,
      AmIevent:'1'
    };

    console.log('Sending publication with user info', publication);

    this.publicationService.addPublication(publication).subscribe({
      next: (response) => {
        console.log('Publication added', response);
        console.log('Going in the blogevent');
        this.updateBlogEventWithPublication(response);
        form.reset();
      },
      error: (error) => {
        console.error('Error adding publication', error);
      }
    });
  }

  private updateBlogEventWithPublication(publication: Publication) {
    console.log('INSIDE blogevent',publication);
    if (!this.eventId) {
      console.error('No event ID specified for updating BlogEvent');
      // Handle this error more effectively, maybe redirect or a notification
      return;
    }
    console.log('Calling for service blogevent');
    this.blogEventService.addPublicationAndUpdateParticipants(this.eventId, publication).subscribe({
      next: () => {
        console.log('Publication added to event and participants updated');
        // Success handling: navigate or update UI state
      },
      error: (error) => {
        console.error('Error updating BlogEvent with publication', error);
        // Error handling: display a notification or modal
      }
    });
  }
}
