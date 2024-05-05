import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogcalenderComponent } from './blogcalender.component';

const routes: Routes = [
  {
    path: '', // This is the default path for the module when it's loaded
    component: BlogcalenderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild for feature modules
  exports: [RouterModule]
})
export class CalenderRoutingModule { }
