import { Component, OnInit, ViewChild } from '@angular/core';
import { AddTransactionComponent } from '../modal/add-transaction/add-transaction.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/services/project.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-project',
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.scss']
})
export class MyProjectComponent implements OnInit  {
  @ViewChild('addtransaction') AddTransaction: AddTransactionComponent;
  projectId: string ;
  private routeSub: Subscription;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
  ) {}
  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.projectId = params['projectid'];

    });
    console.log("My Project Id: "+ this.projectId);
  }
}