import { NgModule } from '@angular/core';
import { SharedModule } from "../../../shared/shared.module";
import { FaqRoutingModule } from './faq-routing.module';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSwitch, NgSwitchCase, AsyncPipe } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { FaqComponent } from './faqcomponent';
import { AddmentalhealthComponent } from './addMentalHealth/addmentalhealth.component';
import { GetMentalHealthByUserComponent } from './get-mental-health-by-user/get-mental-health-by-user.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';
import { AfficheRecommendationComponent } from './affiche-recommendation/affiche-recommendation.component'
import {MatRadioModule} from '@angular/material/radio';
import { PodcastsAfficheComponent } from './podcasts-affiche/podcasts-affiche.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReandomRecComponent } from './reandom-rec/reandom-rec.component';
import { CarouselModule } from "ngx-owl-carousel-o";
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [FaqComponent, DashboardComponent,ReandomRecComponent, AddmentalhealthComponent, GetMentalHealthByUserComponent, AfficheRecommendationComponent ,PodcastsAfficheComponent],
  imports: [
    MatChipsModule,
    CarouselModule,
    CommonModule,
    MatSelectModule,
    NgxPaginationModule,
    SharedModule,
    NgChartsModule,
    MatRadioModule,
    NgSelectModule,
    FaqRoutingModule,
    NgbModule,
    NgbAccordionModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    NgSwitch,
    NgSwitchCase,
    AsyncPipe,
  ]
})
export class FaqModule { }