import { Component, OnInit } from '@angular/core';
import { MentalHealthService } from '../../../../shared/services/mentalhealth.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AleaMusique } from '../../../../shared/model/alea-musique.model';
import { Ep } from '../../../../shared/model/ep.model';
import { AudioBook } from '../../../../shared/model/audio-book.model';
import {SpotifyIFrameAPI} from'../../../../shared/model/spotify-iframe-api.model';




declare var require
const Swal = require('sweetalert2')


@Component({
  selector: 'app-reandom-rec',
  templateUrl: './reandom-rec.component.html',
  styleUrls: ['./reandom-rec.component.scss'],
})
export class ReandomRecComponent implements OnInit {
  aleas : AleaMusique[]=[] ;
  books:AudioBook[]=[];
  eps:Ep[]=[];
  iframeApiLoaded: boolean = false;
  uri : string 
  uri2:string
  selectedBook: AudioBook
  selectedSong:AleaMusique;
  selectedEp:Ep;
  private embedController: any; 


  constructor(private mentalHealthService: MentalHealthService){}
  showMoreInfo(episode: Ep): void {
    const shortDescription = episode.description.length > 600
  ? episode.description.substring(0, 300) + '...'
  : episode.description;
    const content = `
    <div style="display: flex; align-items: center; justify-content: center; max-width: 800px;">
        <img src="${episode.image_url}" style="width: 500px; height: 250px; margin-right: 20px;">
        <div style="text-align: justify; max-width: 380px;">
            <h2>${episode.title}</h2>
            <p>${shortDescription}</p>
        </div>
    </div>
    `;

    Swal.fire({
        html: content,
        footer: `<a href="${episode.episode_url}" target="_blank">More on spotify</a>`,

        width: '800px', // Définir la largeur de la carte
        padding: '3em', // Ajouter du padding autour de la carte
        background: '#fff url(/images/trees.png)', // Optionnel: Ajouter un fond
        backdrop: `
            rgba(0,0,123,0.4)
            url("/images/nyan-cat.gif")
            left top
            no-repeat
        ` // Optionnel: Ajouter un fond pour le backdrop
    });
}

  ngOnInit(): void {
    this.mentalHealthService.getRandomMusic().subscribe(data => { 
        this.aleas = data;
        console.log(this.aleas)
      }
    );
    this.mentalHealthService.getaudibooks().subscribe(data=>{
      this.books=data;
      console.log(this.books)

    })
    this.mentalHealthService.geteps().subscribe(data=>{
      this.eps=data;
      console.log(this.eps)

    })
  }
  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 300,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 300,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  loadSpotifyIframeApi(): void {
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
  script.async = true;
  
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
              uri: `spotify:episode:${this.selectedEp.id}`
             };
        
             IFrameAPI.createController(element, options, (EmbedController) => {
          const recommendations = document.querySelectorAll('.recommendation')
          recommendations.forEach(recommendation => {
            recommendation.addEventListener('click', () => {
              const spotifyUri = recommendation.getAttribute('data-spotify-id');
              console.log('URI de lep  sélectionné :', spotifyUri);
              EmbedController.loadUri(spotifyUri);
            });
          });
        this.embedController = EmbedController; 
      });
    }
  }
  script.async = true;
  
  }
  }
  
  
  playSelectedSong(recommendation: AleaMusique): void {
      this.selectedSong=recommendation;
      if (this.embedController) {
        this.embedController.loadUri(`${this.selectedSong.musicUri}`);
      } else {
        this.loadSpotifyIframeApi();
      }    }
    
      playSelectedep(episode: Ep): void {
        this.selectedEp=episode;
        if (this.embedController) {
          this.embedController.loadUri(`spotify:episode:${this.selectedEp.id}`);
        } else {
          this.loadSpotifyIframeApi2();
        }    }
      



}
  
 

