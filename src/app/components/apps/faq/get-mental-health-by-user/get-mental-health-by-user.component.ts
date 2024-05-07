import { Component, OnInit } from '@angular/core';
import { MentalHealth } from '../../../../shared/model/mentalhealth.model';
import { MentalHealthService } from '../../../../shared/services/mentalhealth.service';
import { Mood } from '../../../../shared/model/mood.model';
import { User } from '../../../../shared/model/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-get-mental-health-by-user',
  templateUrl: './get-mental-health-by-user.component.html',
  styleUrls: ['./get-mental-health-by-user.component.scss']
})
export class GetMentalHealthByUserComponent implements OnInit {
   dateComplete :String ;
  email = 'chayma.bensaad@esprit.tn';
  mentalHealthRecords: MentalHealth[] = [];
      preference: string;
      username:String;
      mood:Mood;
      currentUser : User ;
    content_recommendations='';
    dateVariable: Date;
    energyLevel: number; 
    stressLevel: number;
    

  constructor( private mentalHealthService: MentalHealthService ){
   
  }

  ngOnInit() {
   this.getMentalHealthByUser(this.email);
   this.getCurrentUser();
    
  }

  getCurrentUser(): void {
    this.mentalHealthService.findUserByUsername(this.email)
      
      .subscribe(
        user => {
          this.currentUser = user;
          console.log('Utilisateur actuel:', user);
        },
        error => {
          console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
        }
      );
  }

  moodToString(mood: Mood): string {
    switch (mood) {
      case Mood.Trés_Bien:
        return "Très Bien";
      case Mood.Bien:
        return "Bien";
      case Mood.Neutre:
        return "Neutre";
      case Mood.PasSiBien:
        return "Pas Si Bien";
      case Mood.Mauvais:
        return "Mauvais";
    }}
  getMentalHealthByUser(email: string): void {

  this.mentalHealthService.getMentalHealthByUser(email).subscribe(data => {
    if (data && data.length > 0) {
      data.forEach((record) => {
      this.mentalHealthRecords.push(record);
      this.preference = record.preference;
      this.mood=record.mood;
      
      this.dateVariable = new Date(); 
      const dateFormatee = this.dateVariable.toLocaleDateString();
      const [jour, mois,annee] = dateFormatee.split("/");
      this.dateComplete = jour + "/" + mois + "/" + annee;
      this.energyLevel = record.energyLevel; 
      this.stressLevel = record.stressLevel;
      console.log(`Record processed: Preference=${this.preference}, Content Recommendations=${this.content_recommendations}, Date=${this.dateVariable.toISOString()}, Energy Level=${this.energyLevel}, Stress Level=${this.stressLevel}`);
console.log('Recrds ',this.mentalHealthRecords)
console.log('datecompléte' ,record.date)
    })
  }
  else {
    console.log('No data found for this user.');
  }} )}
}
  

