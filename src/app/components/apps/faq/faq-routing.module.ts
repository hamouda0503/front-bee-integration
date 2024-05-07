import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faqcomponent';
import {GetMentalHealthByUserComponent} from './get-mental-health-by-user/get-mental-health-by-user.component' ;
import { AddmentalhealthComponent } from './addMentalHealth/addmentalhealth.component';
import { AfficheRecommendationComponent } from './affiche-recommendation/affiche-recommendation.component';
import { PodcastsAfficheComponent } from './podcasts-affiche/podcasts-affiche.component';
import { ReandomRecComponent } from './reandom-rec/reandom-rec.component';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [
  {
    path: '',
    children:[
      {
        path:'AddMentalHealth',
        component:AddmentalhealthComponent
      },
      {
        path:'GetMyMentalHealth',
        component:GetMentalHealthByUserComponent
      },
      {
        path:'afficheRecommendation',
        component:AfficheRecommendationComponent
      },
      {
        path:'podcastsAffiche',
        component:PodcastsAfficheComponent

      },
      {
        path:'ReandomRec',
        component:ReandomRecComponent
      }
      ,
      {
        path:'Dashboard',
        component:DashboardComponent
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
