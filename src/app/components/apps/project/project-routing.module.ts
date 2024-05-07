import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectListComponent } from './project-list/project-list.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { UpdateProjectComponent } from './update-project/update-project.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { MyProjectComponent } from './my-project/my-project.component';
import {TasksComponent} from "../tasks/tasks.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ProjectListComponent
      },
      {
        path: 'create',
        component: CreateProjectComponent
      },
      {
        path: 'update/:id',
        component: UpdateProjectComponent
      },
      {
        path: 'file-manager/:projectid',
        component: FileManagerComponent
      },
      {
        path: 'file-manager/:projectid/:folderId',
        component: FileManagerComponent
      },
      {
        path: 'my-project',
        component: MyProjectComponent
      },
      {
        path: 'my-project/:projectid',
        component: MyProjectComponent
      },
      {
        path: 'tasks/:projectid',
        component: TasksComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
