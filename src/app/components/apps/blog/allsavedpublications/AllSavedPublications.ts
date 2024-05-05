import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import { PublicationService } from '../../../../shared/services/blog/publication.service'; // Ajustez ce chemin pour pointer vers votre service de publication // Ajustez ce chemin pour pointer vers votre service de publication
import { Router } from '@angular/router';
import { SavedPublication } from '../../../../shared/model/SavedPublication.model';
import {StorageService} from "../../../../shared/services/storage.service";
import {SavedPublicationService} from "../../../../shared/services/blog/SavedPublication.service";
import {Publication} from "../../../../shared/model/publication.model";
import {catchError, tap} from "rxjs/operators";
@Component({
  selector: 'app-details',
  templateUrl: './AllSavedPublications.component.html',
  styleUrls: ['./AllSavedPublications.component.scss']
})
export class AllSavedPublications implements OnInit {
  // Le type de 'publications' doit correspondre à celui défini pour les publications dans votre service
  // Si vous n'avez pas de type défini, vous pouvez utiliser 'any[]' mais il est préférable de définir un type
  publications: any[] = [];



  constructor(private publicationService: PublicationService,private savedpublicationService: SavedPublicationService,private router: Router ,private storage: StorageService,) {

  }

  ngOnInit(): void {
    this.loadPublications();
  }

  loadPublications(): void {
    const currentUser = this.storage.getUser(); // Assuming this method returns the current user object
    if (currentUser && currentUser.id) {
      this.savedpublicationService.getAllPublicationsByUser(currentUser.id).subscribe(
        (data: Publication[]) => {
          this.publications = data;
        },
        (error) => {
          console.error('Error fetching saved publications:', error);
        }
      );
    } else {
      console.error('No user found in storage');
    }
  }

  navigateToSingle(id: string): void {
    this.router.navigate(['/blog/single', id]);
  }

  deletePublication(event, id: string, userid: string): void {
    event.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
      this.savedpublicationService.deletePublication(id, userid).pipe(
        tap(() => {
          // Navigate after successful deletion
          // this.router.navigate(['/blog/details']);
        }),
        catchError((error) => {
          console.error('Error deleting publication:', error);
          return of([]); // Handle error gracefully by returning an observable with empty array or appropriate error handling logic
        })
      ).subscribe();
    }
  }
}
