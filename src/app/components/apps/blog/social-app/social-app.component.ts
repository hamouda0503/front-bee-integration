import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationService } from '../../../../shared/services/blog/publication.service';
import { CommentService } from '../../../../shared/services/blog/comment.service'; // Import your Comment Service
import { Publication } from '../../../../shared/model/publication.model';
import { Comment } from '../../../../shared/model/comment.model';
import {StorageService} from "../../../../shared/services/storage.service";
import {User} from "../../../../shared/model/user.model"; // Ensure you have a Comment model
import { ChangeDetectorRef } from '@angular/core';
import {UserService} from "../../../../shared/services/user.service";
import {Image} from "@ks89/angular-modal-gallery";

@Component({
  selector: 'app-social-app',
  templateUrl: './social-app.component.html',
  styleUrls: ['./social-app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SocialAppComponent implements OnInit {

  public url: any;
  public isProfile = false;
  public isProfile2 = false;
  public isProfile3 = false;
  public isProfile4 = false;
  public isProfile5 = false;
  public isProfile6 = false;
  public isProfile7 = false;
  public isProfile8 = false;
  public isProfile9 = false;
  public openTab: string = 'Timeline'
    public active = 1;
  currentUser: User | null = null; // This should be set to the actual current user's ID
  publications: any[] = [];
  mostLikedPublication: Publication;
  constructor( private publicationService: PublicationService,
               private storage: StorageService,
               private userService: UserService,
               private route: ActivatedRoute,
                   private router: Router

  ) {
 }

//<div class="avatar"><img alt="" src="'assets/images/user/' + currentUser.firstname + '.png'" /></div>

  tabbed(val) {
    this.openTab = val;
  }
  public imagesRect: Image[] = [
    new Image(0, { img: 'assets/images/user/company1.png' }, { img: 'assets/images/user/company1.png' }),
    new Image(1, { img: 'assets/images/user/company2.png' }, { img: 'assets/images/user/company2.png' }),
    new Image(2, { img: 'assets/images/user/company3.png' }, { img: 'assets/images/user/company3.png' })]


  ngOnInit() {

    //this.currentUser = this.storage.getUser();

    this.route.params.subscribe(params => {
      const userId = params['id'];
      this.loadUser(userId);
      this.loadUserPublications(userId);




    });


  }

  loadUser(userId: string): void {
    this.userService.getUserById(userId).subscribe(
      (userData) => {

        this.currentUser = userData; // Assuming the response is the user data

        //this.loadUserPublications();

      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }
  loadUserPublications(userId: string): void {

    this.publicationService.getPublicationsByUserId(userId).subscribe(
      (data) => {

        this.publications = data;
        this.mostLikedPublication = this.getMostLikedPublication();
        console.log(this.mostLikedPublication);
      },
      (error) => {
        console.error('Error fetching publications for user:', error);
      }
    );
  }
  getMostLikedPublication(): Publication | null {
    if (this.publications.length === 0) return null;

    let mostLikedPublication = this.publications[0];
    let maxLikes = mostLikedPublication.likes ? mostLikedPublication.likes.length : 0;

    for (let publication of this.publications) {
      const currentLikes = publication.likes ? publication.likes.length : 0;
      if (currentLikes > maxLikes) {
        mostLikedPublication = publication;
        maxLikes = currentLikes;
      }
    }

    return mostLikedPublication;
  }

  navigateToSingle(id: string): void {
    this.router.navigate(['/blog/single', id]);
  }
}
