import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TodoComponent } from "./todo.component";
import {KanbanComponent} from "../kanban/kanban.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: TodoComponent,
      },




    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}
