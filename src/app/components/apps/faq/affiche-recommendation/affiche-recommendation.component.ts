import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MentalHealthService } from '../../../../shared/services/mentalhealth.service';
import { User } from '../../../../shared/model/user.model'; 
import { ChangeDetectorRef } from '@angular/core';
import { Recommendation } from '../../../../shared/model/recommendation.model'; 
import { SpotifyIFrameAPI } from '../../../../shared/model/spotify-iframe-api.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { AleaMusique } from '../../../../shared/model/alea-musique.model'; 

import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-affiche-recommendation',
  templateUrl: './affiche-recommendation.component.html',
  styleUrls: ['./affiche-recommendation.component.scss']
})

export class AfficheRecommendationComponent implements OnInit {
  recommendations: Recommendation[] = [];
  rated: AleaMusique[] = [];

  constructor(private http: HttpClient,private toaster:ToastrService, private mentalHealthService: MentalHealthService, private cdr: ChangeDetectorRef) { }
  iframeApiLoaded: boolean = false;
  uri: string;
  user: User;
  currentPage: number = 1;
  pageSize: number = 2; // Number of cards per page

  variablePanel:boolean=false 
  private embedController: any;
  p: number = 1;
  p2: number=1; 
  selectedSong: Recommendation;
  selectedRated:AleaMusique;
  panels: { title: string, content: string }[] = [];
  id: string;
 

  ngOnInit() {
    console.log('Hello from ngOnInit before subscribe');
    this.mentalHealthService.getRecommendations()
      .subscribe(data => {
        this.recommendations = data;
        this.cdr.detectChanges();     

        console.log('data', data);
        console.log('Recommendations:', this.recommendations);
      });

  }


  likeEpisode(recommendation: Recommendation): void {
    this.selectedSong=recommendation
    this.id=recommendation.id;

     this.mentalHealthService.sendIdTRack(this.selectedSong.id).subscribe(response => {
  console.log('Response from Flask:', response);
  console.log('les valeurs envoyés :', this.id);

               }); 
               this.panels.push();

this.mentalHealthService.getSimilarsongs()
.subscribe(
  data => {
    console.log('Réponse brute de l\'API:', data);
    if (data) {
      this.variablePanel=true;
      this.rated = data as AleaMusique[];
      console.log('rated:', this.rated);
    } else {
      console.error('Aucune donnée reçue de l\'API');
    }
  },
  error => {
    console.error('Erreur lors de la récupération des données:', error);
  }
);
  }
  dislikeEpisode(recommendation:Recommendation):void{
    this.toaster.error("We are sorry you didn't like it 😔 .We will make sure to improve your experience next time ❤️")


  }

  playSelectedSong(recommendation: Recommendation): void {
    this.selectedSong = recommendation;
    console.log('mohsen' + this.selectedSong.id)
    if (this.embedController) {
      console.log('idd', this.selectedSong)

      this.embedController.loadUri(`spotify:track:${this.selectedSong.id}`);
    } else {
      this.loadSpotifyIframeApi();
    }

  }
  loadSpotifyIframeApi(): void {
    if (!this.iframeApiLoaded) {
      const script = document.createElement('script');
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      document.head.appendChild(script);
      if (typeof window.onSpotifyIframeApiReady !== 'function') {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
          console.log('idd2', this.selectedSong)

          const element = document.getElementById('embed-iframe');
          const options = {
            width: '1000px',
            height: '400px',
            uri: `spotify:track:${this.selectedSong.id}`
          };

          IFrameAPI.createController(element, options, (EmbedController) => {
            const recommendations = document.querySelectorAll('.recommendation')
            recommendations.forEach(recommendation => {
              recommendation.addEventListener('click', () => {
                const spotifyUri = recommendation.getAttribute('data-spotify-id');
                console.log('URI de l\'épisode sélectionné :', spotifyUri);
                EmbedController.loadUri(spotifyUri);
              });
            });
            this.embedController = EmbedController; // Stockez le contrôleur ici
          });
        }
      }
      script.async = true;

    }
  }

  playSelectedSong2(recommendation: AleaMusique): void {
    this.selectedRated = recommendation;
    if (this.embedController) {

      this.embedController.loadUri(`${this.selectedSong.musicUri}`);
    } else {
      this.loadSpotifyIframeApi2();
    }

  }

  loadSpotifyIframeApi2(): void {
    if (!this.iframeApiLoaded) { 
      const script = document.createElement('script');
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      console.log("aaaaaaa")
      document.head.appendChild(script);
      if (typeof window.onSpotifyIframeApiReady !== 'function') {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        console.log("bbbbbbbb")
  
        const element = document.getElementById('embed-iframe');
             const options = { 
               width: '1000px',
              height: '400px',
              uri: `${this.selectedSong.musicUri}`
             };
        
             IFrameAPI.createController(element, options, (EmbedController) => {
          const recommendations = document.querySelectorAll('.recommendation')
          recommendations.forEach(recommendation => {
            recommendation.addEventListener('click', () => {
              const spotifyUri = recommendation.getAttribute('data-spotify-id');
              console.log('URI de l\'épisode sélectionné :', spotifyUri);
              EmbedController.loadUri(spotifyUri);
            });
          });
        this.embedController = EmbedController; // Stockez le contrôleur ici
      });
    }
      }
    }



  

  
  }



}

