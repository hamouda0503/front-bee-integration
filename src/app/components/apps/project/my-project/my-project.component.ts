import { Component, OnInit, ViewChild } from '@angular/core';
import { AddTransactionComponent } from '../modal/add-transaction/add-transaction.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/services/project.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/shared/model/project.model';
import { Storage } from 'src/app/shared/model/storage.model';


@Component({
  selector: 'app-my-project',
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.scss']
})
export class MyProjectComponent implements OnInit  {
  @ViewChild('addtransaction') AddTransaction: AddTransactionComponent;
  projectId: string ;
  private routeSub: Subscription;
  project: Project = new Project();
  projectStorage: Storage;
  reinitializeAppDefault: boolean = true;


  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
  ) {}
  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.projectId = params['projectid'];
      this.loadStorage(params['projectid']);
      this.loadProject(params['projectid']);

    });
    console.log("My Project Id: "+ this.projectId);
  }
  updateDash()
  {
   this.reinitializeAppDefault= false;
   this.reinitializeAppDefault= true;

  }
  manageFiles(): void {
    this.router.navigate(['/project/file-manager', this.projectId]);
  }
  loadProject(id: string): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (err) => console.error('Error fetching project', err),
    });
  }
  loadStorage(id: string): void {
    this.projectService.getProjectStorage(id).subscribe({
      next: (storage) => {
        this.projectStorage = storage;
      },
      error: (err) => console.error('Error fetching storage', err)
    });
  }
}