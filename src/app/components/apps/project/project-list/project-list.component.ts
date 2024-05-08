import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../shared/services/project.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

import { Project } from 'src/app/shared/model/project.model';
import { Task } from 'src/app/shared/model/Task';

import { AddInvestmentComponent } from '../modal/add-investment/add-investment.component';
import { InvestmentService } from '../../../../shared/services/investment.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  @ViewChild('addInvestment') AddInvestment: AddInvestmentComponent;
  public projectID: string;
  public active = 1;
  projects: Project[] = [];
  currentUserId: string;
  currentUserRole: string;

  constructor(
    private tasksService: TasksService,
    private projectService: ProjectService,
    private storageService: StorageService,
    private router: Router,
    private investmentservice: InvestmentService
  ) {}

  ngOnInit() {
    this.loadAllProjects();
    this.currentUserId = this.storageService.getUser().id;
    this.currentUserRole = this.storageService.getUser().role;
    console.log(this.projects);
    console.log(this.storageService.getUser());
  }
  checkInvestment(projectId: string): any {
    this.investmentservice
      .checkInvestment(this.storageService.getUser().id, projectId)
      .subscribe({
        next: (bool) => {
          console.log("Check Investor: PID"+projectId+" | "+bool);
          return bool;
        },
        error: (err) => {
          console.error('Failed to fetch projects', err);
        },
      });
  }
  tasksPerProject: { [projectId: string]: number } = {};

  loadTasksPerProject(projectid: string): void {
    this.tasksService.getTasksByProject(projectid).subscribe({
      next: (tasks) => {
        this.tasksPerProject[projectid] = tasks.length;
      },
      error: (err) => {
        console.error('Failed to fetch projects', err);
        this.tasksPerProject[projectid] = -1; // Set a default value or handle the error as needed
      },
    });
  }
  loadAllProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        console.log(this.projects);
      },
      error: (err) => {
        console.error('Failed to fetch projects', err);
      },
    });
  }
  updateProject(projectId: string): void {
    this.router.navigate(['/project/update', projectId]);
  }
  manageFiles(projectId: string): void {
    this.router.navigate(['/project/file-manager', projectId]);
  }
  goToTasks(projectId: string): void {

    this.router.navigate(['tasks', projectId]);
  }
  myProject(projectId: string): void {
    this.router.navigate(['/project/my-project', projectId]);
  }
  deleteProject(project: Project): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          this.projects = this.projects.filter((p) => p.id !== project.id);
          console.log('Project deleted successfully');
        },
        error: (err) => console.error('Error deleting project', err),
      });
    }
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'badge badge-primary';
      case 'IN_PROGRESS':
        return 'badge badge-primary';
      case 'COMPLETED':
        return 'badge badge-success';
      default:
        return 'badge badge-primary'; // Default class if status is unrecognized
    }
  }
  getFontClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'col-6 font-primary';
      case 'IN_PROGRESS':
        return 'col-6 font-primary';
      case 'COMPLETED':
        return 'col-6 font-success';
      default:
        return 'col-6 font-primary'; // Default class if status is unrecognized
    }
  }
  getBarClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'progress-bar-animated bg-primary progress-bar-striped';
      case 'IN_PROGRESS':
        return 'progress-bar-animated bg-primary progress-bar-striped';
      case 'COMPLETED':
        return 'progress-bar-animated bg-success';
      default:
        return 'progress-bar-animated bg-primary progress-bar-striped'; // Default class if status is unrecognized
    }
  }
}
