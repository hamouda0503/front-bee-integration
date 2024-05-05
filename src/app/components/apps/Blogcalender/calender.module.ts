import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalenderRoutingModule } from './calender-routing.module';

import { BlogcalenderComponent } from './blogcalender.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [BlogcalenderComponent],
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
  ]
})
export class CalenderModule { }
