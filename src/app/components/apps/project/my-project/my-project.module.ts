import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProjectRoutingModule } from './my-project-routing.module';
import { MyProjectComponent } from './my-project.component';
import { SharedModule } from "../../../../shared/shared.module";
import { AppDashboardComponent } from './dashboard/dashboard.component';
import { CalenderComponent } from './calender/calender.component';
//import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

@NgModule({
  declarations: [
    MyProjectComponent,
    AppDashboardComponent
  ],
  imports: [
    CommonModule,
    MyProjectRoutingModule,
    SharedModule,
    TablerIconsModule.pick(TablerIcons),
    CalenderComponent
  ],
  exports: [TablerIconsModule]
})
export class MyProjectModule { }
