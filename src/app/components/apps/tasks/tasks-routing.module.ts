import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasksComponent } from './tasks.component';
import {KanbanSubtasksComponent} from "../kanban/kanban-subtasks/kanban-subtasks.component";
import {KanbanComponent} from "../kanban/kanban.component";
import {TaskChartComponent} from "./task-chart/task-chart.component";
import {CalenderComponent} from "../calender/calender.component";

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: ':projectid',
        component: TasksComponent
      },
      {
        path : 'boards/:userId',
        component: KanbanComponent
      },
      {
        path: 'boards/:userId/:id/:name',
        component: KanbanSubtasksComponent
      },
      {
        path: 'dashboard',
        component: TaskChartComponent
      },
      {
        path: 'calender',
        component: CalenderComponent
      }



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
