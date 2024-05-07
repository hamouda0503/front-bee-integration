import { Component, OnInit,ViewChild   } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MentalHealth } from '../../../../shared/model/mentalhealth.model';
import { MentalHealthService } from '../../../../shared/services/mentalhealth.service';
import { User } from '../../../../shared/model/user.model';
import {Mood}from '../../../../shared/model/mood.model';
import{Interests}from '../../../../shared/model/intrests.model'
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from '@angular/forms'; // Import FormControl
import { MatChipSelectionChange  } from '@angular/material/chips'; // Import the correct event type
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-addmentalhealth',
  templateUrl: './addmentalhealth.component.html',
  styleUrls: ['./addmentalhealth.component.scss'],
  providers: [NgbPaginationConfig],  
})

export class AddmentalhealthComponent implements OnInit {

  color: string = 'blue'; 
  energyLevel !:number;
  stressLevel !:number;
  private concernedUser: User;
  private user:User;
  message:string ;
  moods : Mood[];
  mood! :Mood ;
  intrests:Interests[];
  intrest!:Interests ;
  
  
  value1 :number =30
  value2 :number =30
  valueA :number=20
  valueV:number=20
  arousal:number=0
  valence:number=0
  data : any ;

  langue :string ;
  successMessage: string | null = null;
  selectedCategories: string[] = [];
  panels: { title: string, content: string }[] = [];
  panels2: { title: string, content: string }[] = [];



  selectedPreference: string = '';
  paginationSide = ["start", "center", "end"];
  pagination = ["primary", "secondary", "success", "info", "warning", "danger"];


  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  FourthFormGroup: FormGroup;
  SixthFormGroup: FormGroup;
  SeventhFormGroup: FormGroup;
  isEditable = true;


 constructor(private formBuilder: FormBuilder,
  private mentalHealthService: MentalHealthService,
   private cdr: ChangeDetectorRef,private  r : Router ,private toaster:ToastrService
   ) {
 
 }

  ngOnInit() {
 
    this.moods = Object.values(Mood) as Mood[];
    this.moods = [
      Mood.Trés_Bien,
      Mood.Bien,
      Mood.Neutre,
      Mood.PasSiBien,
      Mood.Mauvais
    ];
   this.intrests=Object.values(Interests)as Interests[]
   this.intrests=[
    Interests.Business,
    Interests.Entertainment,
    Interests.Health,
    Interests.Humanities,
    Interests.Sports,
    Interests.IT,
    Interests.Lifestyle,
    Interests.Society,
    Interests.Technology,
    Interests.Science,
    Interests.Relationships,
   ]
    const email = 'chayma.bensaad@esprit.tn'
    this.mentalHealthService.findUserByUsername(email)
      .subscribe(user => {
        console.log('User found:', user);
        this.concernedUser=user;
      }, error => {
        console.error('Error finding user:', error);
      });

      this.firstFormGroup = this.formBuilder.group({
        mood: ['', Validators.required],
      });
    
      this.secondFormGroup = this.formBuilder.group({
        prefrence: ['', Validators.required],
      });
    
      this.thirdFormGroup = this.formBuilder.group({
        value1: [0, Validators.required],

      });
    
      this.FourthFormGroup = this.formBuilder.group({
        value2:[0,Validators.required],
      });
    
      this.SixthFormGroup = this.formBuilder.group({
        valueA: [0, Validators.required],
        valueV: [0, Validators.required],
      });
    
      this.SeventhFormGroup = this.formBuilder.group({
        intrest: ['', Validators.required],
        language: ['', Validators.required],
      });
    
  }



  moodToString(mood: Mood): string {
    switch (mood) {
      case Mood.Trés_Bien:
        return "Excellent";
      case Mood.Bien:
        return "Good";
      case Mood.Neutre:
        return "Neutral";
      case Mood.PasSiBien:
        return "Not So Good";
      case Mood.Mauvais:
        return "Bad";
    }}

  selectMood(mood: Mood) {
   this.mood=mood;
   this.firstFormGroup.get('mood').setValue(mood);
    console.log("Humeur sélectionnée :", mood);
   }
   onRadioClick(event: any) {
    this.langue = event.target.value;
    this.SeventhFormGroup.get('language').setValue(event.target.value);

    console.log("Selected language:", this.langue);
  }

   selectIntrest(intrest: Interests){
    this.intrest=intrest;
    this.SeventhFormGroup.get('intrest').setValue(intrest);

    console.log("Intrest sélectionnée :", this.intrest);
   }
  selectPreference(preference: string) {
    this.selectedPreference = preference;
   
    console.log("Selected preference:", preference);
    if (preference === 'MUSIC') {
    this.panels.push();
    }
    if (preference === 'PODCAST') 
      this.panels2.push();
    this.secondFormGroup.get('prefrence').setValue(preference);
  }

  
  moodEmojis: { [key in Mood]: string } = {
    [Mood.Trés_Bien]: './assets/svg/joy-emoji.png',
    [Mood.Bien]: './assets/svg/happy-emoji.png',
    [Mood.Neutre]: './assets/svg/flat-emoji.png',
    [Mood.PasSiBien]: './assets/svg/sad-emoji.png',
    [Mood.Mauvais]: './assets/svg/dissapointed-emoji.png'
  };
  getMoodEmoji(mood: Mood): string {
    return this.moodEmojis[mood];
  }
 
  
  saveMentalHealth() {    
    
      console.log('Form is valid'); 
       const mood =this.mood;
      const energyLevel = this.value1;
      const stressLevel = this.value2;
      const preference = this.selectedPreference;
      const date = new Date();

      console.log('Values retrieved:', {
        mood,
        energyLevel ,
        stressLevel,
        preference,
        date
      }); 

      const mentalHealthData: MentalHealth = {
        concernedUser:this.user,
        mood,
        energyLevel ,
        stressLevel,
        preference,
        date,
      };
       this.data = {
        mentalHealthData, 
        arousal: this.arousal,
        valence: this.valence,
        intrest : this.intrest,
        langue :this.langue
      };

      console.log('MentalHealth data created:', this.data ); 

      this.mentalHealthService.addMentalHealth(this.data,"chayma.bensaad@esprit.tn")
        .subscribe({
          next: (response) => {
         this.toaster.success("We are preparing a surprise for you, get ready! 😎✨")
            console.log('Data saved successfully:', response);
            this.arousal=this.valueV/100;
            this.valence=this.valueA/100;
           
            this.mentalHealthService.sendArousalValence(this.arousal, this.valence).subscribe(response => {
              console.log('Response from Flask:', response);
              console.log('les valeurs envoyés :', this.arousal , this.valence);
    
            }); 
            this.mentalHealthService.sendIntrestAndlangue(this.langue,this.intrest).subscribe(response => {
              console.log('Response from Flask:', response);
              console.log('les valeurs envoyés :', this.langue , this.intrest);
    
            }); 
            if (this.selectedPreference==="MUSIC"){
              this.r.navigate(['/faq/afficheRecommendation'])
            }
            if(this.selectedPreference === "PODCAST"){
              this.r.navigate(['/faq/podcastsAffiche'])
            }
          },
          error: (error) => {
            console.error('Error saving data:', error); 
          }
        });
      
        
      console.log('Data saved successfully (local message)'); 
  
    }
  
  

  getEnergyMessage(value1): string {
    if (value1 < 10) {
      return "😴 Need more energy!";
  } else if (value1 < 20) {
      return "🥱 Starting slowly.";
  } else if (value1 < 30) {
      return "😌 Still a bit tired.";
  } else if (value1 < 40) {
      return "🙂 Waking up gradually.";
  } else if (value1 < 50) {
      return "😀 Ready for the day.";
  } else if (value1 < 60) {
      return "😃 Energy rising!";
  } else if (value1 < 70) {
      return "🤩 Feeling powerful.";
  } else if (value1 < 80) {
      return "💪 Full steam ahead!";
  } else if (value1 < 90) {
      return "🚀 Ready for takeoff!";
  } else {
      return "⚡ Maximum energy reached!";
  }

  }
  getStressMessage(value2): string {
    if (value2 <= 10) {
      return "🍃 Total calm, zen.";
  } else if (value2 <= 20) {
      return "🌤 Gentle breeze, serene.";
  } else if (value2 <= 30) {
      return "☁️ A bit cloudy, but it's okay.";
  } else if (value2 <= 40) {
      return "🌥 Gathering clouds, slight tension.";
  } else if (value2 <= 50) {
      return "🌦 Moderate stress, take a breath.";
  } else if (value2 <= 60) {
      return "⛈ Rising pressure, take a break.";
  } else if (value2 <= 70) {
      return "🌪 It's swirling, time to refocus.";
  } else if (value2 <= 80) {
      return "🔥 High level of stress, be cautious.";
  } else if (value2 <= 90) {
      return "🌋 Near eruption, seek support.";
  } else {
      return "💥 Maximum stress, it's crucial to relax now.";
  }

  }
}