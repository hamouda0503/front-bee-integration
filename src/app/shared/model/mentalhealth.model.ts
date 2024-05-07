import { Inject } from '@angular/core';
import { User } from './user.model'; 
import { Mood } from './mood.model';
Inject({ providedIn: 'User' })
Inject({ providedIn: 'mood' })
export enum Preference {
    Musique = 'MUSIC',
    Podcast = 'PODCAST',
    AudioBook = 'AUDIOBOOK',

  }

  

export interface MentalHealth {
    idMH?: String; 
    concernedUser:  User ; 

    date :Date; 
    preference: string | Preference;
    mood:   Mood;
   
    energyLevel: number;
    stressLevel: number;
  }