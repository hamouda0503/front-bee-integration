import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyProjectComponent } from "./my-project.component";

const routes: Routes = [
  {
    path: "",
    component: MyProjectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProjectRoutingModule {}
