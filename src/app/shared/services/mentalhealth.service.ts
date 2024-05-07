import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MentalHealth } from '../model/mentalhealth.model';
import { User } from '../model/user.model';
import{Recommendation} from'../model/recommendation.model';
import {Podcast} from '../model/podcast.model'
import { Episode } from '../model/episode.model';
import {AleaMusique} from '../model/alea-musique.model';
import {Ep} from '../model/ep.model';
import {AudioBook}from '../model/audio-book.model';



export interface HealthSummary {
  date: Date;
  totalEnergyLevel: number;
  totalStressLevel: number;
}


@Injectable({ providedIn: 'root' })
export class MentalHealthService {
  private baseUrl = 'http://localhost:8080/api/v1/mentalHealth/';
  private baseUrlF = 'http://localhost:5000/api/recommendations'; 
  private authUrl = 'https://accounts.spotify.com/authorize'; // Authorization endpoint
  private tokenUrl = 'https://accounts.spotify.com/api/token'; // Token exchange endpoint

  private token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjaGF5bWEuYmVuc2FhZEBlc3ByaXQudG4iLCJpYXQiOjE3MTUwODQzNzYsImV4cCI6MTcxNTE3MDc3Nn0.ABDEZRGGGdDn6WXAC57YO95FFn26X-7nNaOvKtPowxI";
           constructor(private http: HttpClient) {}
  setToken(token: string) {
    this.token = token;
  }
  getMoodDistribution(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}mood-distribution`);
  }
  addMentalHealth(data: any, email: string): Observable<MentalHealth> {
    const url = `${this.baseUrl}addMentalhealth/chayma.bensaad@esprit.tn`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` });
    const body = JSON.stringify(data);

    return this.http.post<MentalHealth>(url, body, { headers });
  }
  sendArousalValence(arousal: number, valence: number) {
    const url = `${this.baseUrlF}/sendAV`;
    console.log(`Sending request with method: ${this.http.post.name}`);  
    return this.http.post(url, { arousal, valence })  }

   
  getRecommendations(): Observable<Recommendation[]> {
     return  this.http.get<any>(this.baseUrlF) 
      .pipe(
        map(data => data.tracks as Recommendation[]) 
      );
  }
  getRandomMusic(): Observable<AleaMusique[]> {
    return this.http.get<any>(`${this.baseUrlF}/getmusic`)
    .pipe(
      map(data => data.music_recommendations as AleaMusique[])
    )
  }
  sendIdTRack(id: string) {
    const url = `${this.baseUrlF}/getIdTrack`;
    console.log(`Sending request with method: ${this.http.post.name}`);  
    return this.http.post(url, { id })  }
    
  getSimilarsongs(): Observable<AleaMusique[]> {
    return this.http.get<any>(`${this.baseUrlF}/RateMusic`)
    .pipe(
      map(data => data.recs as AleaMusique[])

    )

  }

  getaudibooks(): Observable<AudioBook[]> {
    return this.http.get<any>(`${this.baseUrlF}/getAudiobooks`)
    .pipe(
      map(data => data.audiobooks as AudioBook[])
    )
  }

  geteps(): Observable<Ep[]> {
    return this.http.get<any>(`${this.baseUrlF}/getrandomEP`)
    .pipe(
      map(data => data.ep_recommendations as Ep[])
    )
  }


  getPodcasts(): Observable<Podcast[]> {

    return this.http.get<any>(`${this.baseUrlF}/getpodcasts`)
     .pipe(map(data=>data.podcasts as Podcast[]))
    }
getEpisodes(): Observable<Episode[]> {
  return this.http.get<any>(`${this.baseUrlF}/getepisodes`)
   .pipe(map(data=>data.episodes as Episode[]))
}
  
  sendIntrestAndlangue(intrest: string, langue: string) {
    const url = `${this.baseUrlF}/sendIntrestLangue`;
    console.log(`Sending request with method: ${this.http.post.name}`);  
    return this.http.post(url, { intrest, langue })  }


  findUserByUsername(email: string): Observable<User> {
    const url = `${this.baseUrl}getUserByEmail/chayma.bensaad@esprit.tn`;
    const headers =new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` });
    return this.http.get<User>(url, { headers });
 
  }
  

  
  getMentalHealthByUser(email: string): Observable<MentalHealth[]> {
    const url = `${this.baseUrl}findMentalHealthByUser/chayma.bensaad@esprit.tn`;
    const headers =new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` });

    return this.http.get<MentalHealth[]>(url,{ headers });
      
  }
  getHealthSummaries(): Observable<HealthSummary[]> {
    const url = `${this.baseUrl}health-summaries`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<HealthSummary[]>(url, { headers });
  }
  getAccessToken(code: string): Observable<string> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${window.location.origin}/callback`,
     
      client_id: 'cb84d95c07e949b1989116513fac8878',
      client_secret: '2797c5caa2604ea19042b82934a258e4' 
    });

    return this.http.post(this.tokenUrl, body.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .pipe(
        map((response: any) => response.access_token),
        catchError(error => {
          console.error('Access token retrieval error:', error);
          return throwError(error);
        })
      );
  }
}
