import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../../shared/shared.module";
import { ProjectRoutingModule } from './project-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AddFolderComponent } from './modal/add-folder/add-folder.component';
import { CreateTagComponent } from './modal/create-tag/create-tag.component';

import { ProjectListComponent } from './project-list/project-list.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { UpdateProjectComponent } from './update-project/update-project.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { MyProjectComponent } from './my-project/my-project.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { AppDashboardComponent } from './my-project/dashboard/dashboard.component';
//import { MaterialModule } from '../../../material.module';
import { CalenderComponent } from './my-project/calender/calender.component';

import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProjectRoutingModule,
    NgxDropzoneModule,
    NgApexchartsModule,
    TablerIconsModule.pick(TablerIcons)
  ],
  declarations: [CalenderComponent,AppDashboardComponent, 
    MyProjectComponent, ProjectListComponent, CreateProjectComponent, 
    UpdateProjectComponent,FileManagerComponent, AddFolderComponent, CreateTagComponent],
    exports: [TablerIconsModule]

})
export class ProjectModule { }
