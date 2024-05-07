import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProjectRoutingModule } from './my-project-routing.module';
import { MyProjectComponent } from './my-project.component';
import { SharedModule } from "../../../../shared/shared.module";
//import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DefaultComponent } from './default/default.component';



@NgModule({
  declarations: [
    MyProjectComponent,
    DefaultComponent
  ],
  imports: [
    NgApexchartsModule,
    CommonModule,
    MyProjectRoutingModule,
    SharedModule,
    TablerIconsModule.pick(TablerIcons)
  ],
  exports: [TablerIconsModule]
})
export class MyProjectModule { }
