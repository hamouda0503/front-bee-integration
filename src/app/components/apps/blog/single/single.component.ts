import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationService } from '../../../../shared/services/blog/publication.service';
import { CommentService } from '../../../../shared/services/blog/comment.service'; // Import your Comment Service
import { Publication } from '../../../../shared/model/publication.model';
import { Comment } from '../../../../shared/model/comment.model';
import {StorageService} from "../../../../shared/services/storage.service";
import {User} from "../../../../shared/model/user.model"; // Ensure you have a Comment model
import { ChangeDetectorRef } from '@angular/core';

declare var FB: any;
@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit {
  publication: Publication | null = null;
  currentUser: any | null = null;
  newCommentContent: string = '';
  comments: Comment[] = [];

  constructor(
    private publicationService: PublicationService,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const publicationId = params['id'];
      this.loadPublication(publicationId);
      this.loadComments(publicationId);
      this.loadFacebookSDK();
      this.currentUser = this.storage.getUser();
      console.log(this.currentUser);
    });
  }
  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

  private loadPublication(id: string): void {
    this.publicationService.getPublicationById(id).subscribe(
      (data: Publication) => {
        this.publication = data;
      },
      (error) => {
        console.error('Error loading publication:', error);
      }
    );
  }

  private loadComments(publicationId: string): void {
    this.commentService.getCommentsByPublicationId(publicationId).subscribe(
      (data: Comment[]) => {
        this.comments = data;
      },
      (error) => {
        console.error('Error loading comments:', error);
      }
    );
  }
  deletePublication(id: string): void {
    if(confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
      this.publicationService.deletePublication(id).subscribe(() => {
        this.router.navigate(['/blog/details']);
      }, (error) => {
        console.error('Error deleting publication:', error);
      });
    }
  }

  editPublication(id: string): void {
    this.router.navigate(['/blog/modify-post', id]);
  }
  addComment(): void {
    if (this.publication && this.newCommentContent.trim()) {
      const newComment = {
        content: this.newCommentContent
      };


      this.commentService.addComment(newComment, this.publication.id, this.storage.getUser().id).subscribe(
        comment => {

          if (!this.publication.comments) {
            this.publication.comments = [];
          }

          this.publication.comments.push(comment);

          this.newCommentContent = '';
        },
        error => {
          console.error('Error adding comment:', error);
        }
      );
    } else {
      alert('Please write a comment before publishing.');
    }
  }

  deleteComment(commentId: string): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe(
        () => {

          this.comments = this.comments.filter(comment => comment.id !== commentId);

          if (this.publication && this.publication.comments) {
            this.publication.comments = this.publication.comments.filter(comment => comment.id !== commentId);
          }
        },
        error => {
          console.error('Error deleting comment:', error);
        }
      );
    }

}

  enableEditing(comment: Comment, index: number): void {

    comment.editableContent = comment.content;
    comment.isEditing = true;

  }

  cancelEditing(comment: Comment, index: number): void {
    comment.isEditing = false;

  }

  updateComment(comment: Comment, index: number): void {


    if (comment.editableContent.trim()) {
      // Call the service to update the comment
      const updatedComment: Comment = { ...comment, content: comment.editableContent };
      const newComment = {
        content:  comment.editableContent,
      };
      this.commentService.updateComment(comment.id,newComment).subscribe(
        updated => {
          // Replace the comment in the local array with the updated one from the server
          this.comments[index] = updated;

          this.comments[index].isEditing = false;
          window.location.reload();
          this.cd.detectChanges(); // Manually trigger change detection
        },
        error => {
          console.error('Error updating comment:', error);
        }
      );
    } else {
      alert('The comment content cannot be empty.');
    }
  }
  updateLocalLikes(publicationId: string, action: 'add' | 'remove'): void {
    if (this.publication && this.publication.id === publicationId) {
      if (action === 'add') {
        if (!this.publication.likes.includes(this.currentUser.id)) {
          this.publication.likes.push(this.currentUser.id);
        }
      } else {
        this.publication.likes = this.publication.likes.filter(id => id !== this.currentUser.id);
      }
      this.cd.detectChanges();
    }
  }
  toggleLike(publicationId: string): void {
    if (this.isLikedByCurrentUser(publicationId)) {
      this.publicationService.removeLikeFromPublication(publicationId, this.currentUser.id).subscribe(() => {
        this.updateLocalLikes(publicationId, 'remove');
      });
    } else {
      this.publicationService.addLikeToPublication(publicationId, this.currentUser.id).subscribe(() => {
        this.updateLocalLikes(publicationId, 'add');
      });
    }
  }

  isLikedByCurrentUser(publicationId: string): boolean {
    return this.publication?.likes?.includes(this.currentUser.id) || false;
  }
  updateLocalLikesCom(commentId: string, action: 'add' | 'remove'): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      if (action === 'add') {
        if (!comment.likes.includes(this.currentUser.id)) {
          comment.likes.push(this.currentUser.id);
        }
      } else {
        comment.likes = comment.likes.filter(userId => userId !== this.currentUser.id);
      }
      this.cd.detectChanges();
    }
  }

  toggleLikeCom(commentId: string): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment && this.isLikedByCurrentUserCom(commentId)) {
      this.commentService.removeLikeFromComment(commentId, this.currentUser.id).subscribe(() => {
        this.updateLocalLikesCom(commentId, 'remove');
      });
    } else {
      this.commentService.addLikeToComment(commentId, this.currentUser.id).subscribe(() => {
        this.updateLocalLikesCom(commentId, 'add');
      });
    }
  }

  isLikedByCurrentUserCom(commentId: string): boolean {
    const comment = this.comments.find(c => c.id === commentId);
    return comment && comment.likes.includes(this.currentUser.id);
  }
  navigateToSocialApp(userId: string): void {
    this.router.navigate(['/blog/social-app', userId]);

  }

  loadFacebookSDK(): void {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : 'your-app-id', // Replace 'your-app-id' with your Facebook App ID
        cookie     : true,
        xfbml      : true,
        version    : 'v11.0'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  shareOnFacebook(publicationId: string) {
    FB.ui({
      method: 'share',
      href: 'http://localhost:4200/blog/single/' + publicationId,
    }, function(response){
      // Handle the response object here
    });
  }


}
