import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DropzoneConfigInterface, DropzoneModule, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { SharedModule } from '../../../shared/shared.module';

import { AddPostComponent } from './add-post/add-post.component';
import { BlogRoutingModule } from './blog-routing.module';
import { DetailsComponent } from './details/details.component';
import { SingleComponent } from './single/single.component';
import { Router } from '@angular/router';
import {ModifyPostComponent} from "./modify-post/modify-post.component";
import {SocialAppComponent} from "./social-app/social-app.component";
import {CalendarCommonModule, CalendarDayModule, CalendarMonthModule, CalendarWeekModule} from "angular-calendar";
import {FlatpickrModule} from "angularx-flatpickr";
import {AddEventComponent} from "./add-event/add-event.component";
import { AllSavedPublications} from "./allsavedpublications/AllSavedPublications";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {GalleryModule} from "@ks89/angular-modal-gallery";


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  acceptedFiles: 'image/*',
  createImageThumbnails: true
};


@NgModule({
  declarations: [DetailsComponent, SingleComponent, AddPostComponent,ModifyPostComponent, SocialAppComponent,AddEventComponent,AllSavedPublications,ProductDetailsComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    NgxDropzoneModule,
    DropzoneModule,
    CKEditorModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
    FlatpickrModule,
    GalleryModule
  ],
  providers: [
    { provide: DROPZONE_CONFIG, useValue: DEFAULT_DROPZONE_CONFIG },
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class BlogModule { }
