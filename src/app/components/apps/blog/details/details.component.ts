import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicationService } from '../../../../shared/services/blog/publication.service'; // Ajustez ce chemin pour pointer vers votre service de publication // Ajustez ce chemin pour pointer vers votre service de publication
import { Router } from '@angular/router';
import { SavedPublication } from '../../../../shared/model/SavedPublication.model';
import {StorageService} from "../../../../shared/services/storage.service";
import {SavedPublicationService} from "../../../../shared/services/blog/SavedPublication.service";
import {HttpClient} from "@angular/common/http";
import {Image} from "@ks89/angular-modal-gallery";
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  // Le type de 'publications' doit correspondre à celui défini pour les publications dans votre service
  // Si vous n'avez pas de type défini, vous pouvez utiliser 'any[]' mais il est préférable de définir un type
  publications: any[] = [];

  quote: string;
  public imagesRect: Image[] = [
    new Image(0, { img: 'assets/images/blog/t1.jpg' }, { img: 'assets/images/blog/t1.jpg' }),
    new Image(1, { img: 'assets/images/blog/t2.jpg' }, { img: 'assets/images/blog/t2.jpg' }),
    new Image(2, { img: 'assets/images/blog/t3.jpg' }, { img: 'assets/images/blog/t3.jpg' }),
    new Image(3, {  img: 'assets/images/blog/t4.jpg' }, {  img: 'assets/images/blog/t4.jpg' })]

  constructor(private http: HttpClient,private publicationService: PublicationService,private savedpublicationService: SavedPublicationService,private router: Router ,private storage: StorageService,) {

  }

  ngOnInit(): void {
    this.loadPublications();
    this.fetchRandomQuote();
  }


  fetchRandomQuote() {
    this.http.get<any>('https://api.quotable.io/random', { withCredentials: true }).subscribe(
      {
        next: (quote) => {
          this.quote = quote.content + ' - ' + quote.author;
        },
        error: (err) => console.error('Error fetching storage', err)
      });
  }
  
     
  
  loadPublications(): void {
    // Cette méthode supposerait que votre service a une méthode 'getAllPublications' qui renvoie un Observable des publications
    this.publicationService.getAllPublications().subscribe(
      (data) => {
        // 'data' est ce que le backend renvoie, qui devrait être un tableau de publications
        this.publications = data;
        console.log("testttt +",this.publications);

      },

      (error) => {
        // Ici vous pourriez gérer les erreurs, comme afficher un message à l'utilisateur
        console.error('Error fetching publications:', error);
      }
    );
  }

  navigateToSingle(id: string): void {
    this.router.navigate(['/blog/single', id]);
  }
  savePublication(event: Event,publication: any): void {
    event.stopPropagation();
    const savedPublication: SavedPublication = {
      publicationid: publication.id,
      userId: this.storage.getUser().id
    };
    console.log(savedPublication);
    this.savedpublicationService.savePublication(savedPublication).subscribe(
      () => {

        console.log('Publication saved successfully.');
      },
      (error) => {
        console.error('Error saving publication:', error);
      }
    );
  }


}
