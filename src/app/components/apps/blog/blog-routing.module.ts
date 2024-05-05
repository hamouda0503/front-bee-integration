import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { SingleComponent } from './single/single.component';
import { AddPostComponent } from './add-post/add-post.component';
import {ModifyPostComponent} from "./modify-post/modify-post.component";
import {SocialAppComponent} from "./social-app/social-app.component";
import {AddEventComponent} from "./add-event/add-event.component";
import {AllSavedPublications} from "./allsavedpublications/AllSavedPublications";
import {ProductDetailsComponent} from "./product-details/product-details.component";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'details',
        component: DetailsComponent
      },
      {
        path: 'single/:id',  // Add :id here to accept a route parameter
        component: SingleComponent
      },
      {
        path: 'add-post',
        component: AddPostComponent
      },
      {
        path: 'modify-post/:id',
        component: ModifyPostComponent
      },

      {
        path: 'social-app/:id',
        component: SocialAppComponent
      },
      {
        path: 'add-event',
        component: AddEventComponent
      },
      {
        path: 'allsavedpublications',
        component: AllSavedPublications
      },
      {
        path: 'product-details',
        component: ProductDetailsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
