import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashadminComponent} from "./dashadmin/dashadmin.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "dashboard",
        component: DashadminComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
