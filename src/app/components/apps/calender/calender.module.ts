import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Importez DatePipe
import { CalenderRoutingModule } from './calender-routing.module';

import { CalenderComponent } from './calender.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import {ConfirmationModalComponent} from "../tasks/confirmation-modal/confirmation-modal.component";

@NgModule({
  declarations: [CalenderComponent, ConfirmationModalComponent],
  imports: [
    CommonModule,
    CalenderRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FlatpickrModule.forRoot()
  ],
  providers: [DatePipe] // Ajoutez DatePipe ici
})
export class CalenderModule { }
