import { Component, OnInit } from '@angular/core';
import { MentalHealthService } from '../../../../shared/services/mentalhealth.service';
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { User } from '../../../../shared/model/user.model';
import { ChangeDetectorRef } from '@angular/core';
import { Podcast } from '../../../../shared/model/podcast.model';
import { Episode } from '../../../../shared/model/episode.model';
import {SpotifyIFrameAPI} from'../../../../shared/model/spotify-iframe-api.model';
import { ToastrService } from 'ngx-toastr';




declare var require
const Swal = require('sweetalert2')


@Component({
 selector: 'app-podcasts-affiche',
 templateUrl: './podcasts-affiche.component.html',
 styleUrls: ['./podcasts-affiche.component.scss'],
providers: [NgbPaginationConfig], 
})
export class PodcastsAfficheComponent implements OnInit {
 podcasts: Podcast[];
 episodes: Episode[] =[];
constructor(private mentalHealthService: MentalHealthService , private cdr: ChangeDetectorRef,private toaster:ToastrService){
}
iframeApiLoaded: boolean = false;
selectedEpisode?: Episode ;
selectedPodcast: Podcast | null = null;
uri : string ;
user: User;
private embedController: any; 
p: number = 1;
email='chayma.bensaad@esprit.tn';

showMoreInfo(podcast: Podcast): void {
  const shortDescription = podcast.description.length > 200
  ? podcast.description.substring(0, 300) + '...'
  : podcast.description;
  const content = `
  <div style="display: flex; align-items: center; justify-content: center;">
    <img src="${podcast.image_url}" style="width: 400px; height: 250px; margin-right: 20px;">
    <div>
      <h2>${podcast.title}</h2>
      <p>${shortDescription}</p>
    </div>
  </div>
`;

  Swal.fire({
    html: content,

    /*type: 'info',
    title: podcast.title,
    text: podcast.description,
    imageUrl: podcast.image_url,
    imageAlt: 'Image du podcast',*/
   
    footer: `<a href="${podcast.lien}" target="_blank">More on spotify</a>`
  });
}


dislikeTrack() {

  const maintenanceContent = `
    <div class="error-wrapper maintenance-bg">
      <div class="container">
        <ul class="maintenance-icons">
          <li><i class="fa fa-cog"></i></li>
          <li><i class="fa fa-cog"></i></li>
          <li><i class="fa fa-cog"></i></li>
        </ul>
        <div class="maintenance-heading">
          <h2 class="headline">MAINTENANCE</h2>
        </div>
        <h4 class="sub-content">Our Site is Currently under maintenance We will be back Shortly<br> 
          Thank You For Patience</h4>
      </div>
    </div>
  `;

  Swal.fire({
    html: `
      ${maintenanceContent}
      <p>While we're under maintenance, we're also working on similar features to improve your experience!</p>
    `,
    width: '600px', // Adjust width as desired
    height: 'auto',
    icon: 'warning', // Adjust the icon based on your preference (e.g., 'info')
    confirmButtonText: 'OK',
  });
}


ngOnInit(): void {
    this.mentalHealthService.getPodcasts().subscribe(podcastsData => {
      this.podcasts = podcastsData;

      console.log('Podcasts:', this.podcasts); 
  
      this.mentalHealthService.getEpisodes().subscribe(episodesData => {
        this.episodes = episodesData;
  this.cdr.detectChanges(); //      

        console.log('episodes:', this.episodes);
  
        for (let p of this.podcasts){
          p.Episodes = [];
          for (let episode of this.episodes) {
            if (p.id === episode.podcast_id) {
              p.Episodes.push(episode);
            }
          }
        }
      });
    });
  const email = 'chayma.bensaad@esprit.tn'
  this.mentalHealthService.findUserByUsername(email)
    .subscribe(user => {
      console.log('User found:', user);
      this.user=user;
    }, error => {
      console.error('Error finding user:', error);
    });
  }
  selectPodcast(podcast: Podcast): void {
    this.selectedPodcast=podcast;
  }


  likeEpisode(){         
    this.toaster.success("We're thrilled that you liked it  🎉We're actively working to further enhance your personal experience😊")
}
  dislikeEpisode(){
this.dislikeTrack();
  }

  
playEpisode(episoda: Episode): void {
this.selectedEpisode = episoda;
          console.log('Épisode sélectionné :', this.selectedEpisode);

          if (this.embedController) {
            // Mettez à jour l'URI avec le nouvel épisode sélectionné
            this.embedController.loadUri(`spotify:episode:${this.selectedEpisode.id}`);
          } else {
            // Si le contrôleur n'existe pas, chargez l'API et créez le contrôleur
            this.loadSpotifyIframeApi();
          }
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
             width: '700px',
            height: '700px',
            uri: `spotify:episode:${this.selectedEpisode.id}`,
           };
           console.log(this.selectedEpisode.description);

           IFrameAPI.createController(element, options, (EmbedController) => {
        const episodes = document.querySelectorAll('.episode')
        episodes.forEach(episode => {
          episode.addEventListener('click', () => {
            const spotifyUri = episode.getAttribute('data-spotify-id');
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

}