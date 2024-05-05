import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../../../shared/services/project.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Project } from 'src/app/shared/model/project.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  /////////////
  /*
  name: string;//
  description: string;//
  startDate: NgbDateStruct; //
  endDate: NgbDateStruct; //
  status: string;//
  budget: number;//
  estimatedROI: number;//
  actualROI: number;
  riskLevel: string;//
  fundingGoal: number;//
  fundingRaised: number;
  investorCount: number;
  progressUpdates: string;
  complianceStatus: string;//
  location: string;//
  industry: string;//
  technologyStack: string;
  */
 //////////////////
  projectForm: FormGroup;
  project: Project = new Project();
  files: File[] = [];
	startingDate: NgbDateStruct;
	endingDate: NgbDateStruct;

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  constructor(private fb: FormBuilder,private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', [Validators.required]],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      budget: ['', Validators.required],
      estimatedROI: ['', Validators.required],
      riskLevel: ['', Validators.required],
      fundingGoal: ['', Validators.required],
      complianceStatus: ['', Validators.required],
      location: ['', Validators.required],
      industry: ['', Validators.required],
      technologyStack: ['', Validators.required],
    });
  }

  submitProject(): void {
    // Convert NgbDateStruct to JavaScript Date object
   // const startDate = this.startDate ? new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day) : null;
    //const endDate = this.endDate ? new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day) : null;
    let startDate = new Date(this.projectForm.value.startDate.year, this.projectForm.value.startDate.month - 1, this.projectForm.value.startDate.day);
    let endDate = new Date(this.projectForm.value.endDate.year, this.projectForm.value.endDate.month - 1, this.projectForm.value.endDate.day);

    let formattedStartDate = startDate.toISOString().split('T')[0];
    let formattedEndDate = endDate.toISOString().split('T')[0];
    const newProject = {
      name: this.projectForm.value.name,
      description: this.projectForm.value.description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      status: this.projectForm.value.status,
      ownerId: this.storage.getUser(),
      budget: this.projectForm.value.budget,
      estimatedROI: this.projectForm.value.estimatedROI,
      actualROI: 0,
      riskLevel: this.projectForm.value.riskLevel,
      fundingGoal: this.projectForm.value.fundingGoal,
      fundingRaised: 0,
      investorCount: 0,
      progressUpdates: " ",
      complianceStatus: this.projectForm.value.complianceStatus,
      location: this.projectForm.value.location,
      industry: this.projectForm.value.industry,
      technologyStack: this.projectForm.value.technologyStack
    };
    console.log("project: ", newProject);

    this.projectService.addProject(this.storage.getUser().id , newProject).subscribe({
      next: (project) => {
        console.log('Project added successfully:', project);
        this.router.navigate(['/project/list']);
      },
      error: (error) => {
        console.log("project: ", JSON.stringify(newProject));
        console.error('Failed to add project:', error);
      }
    });
    
  }
  cancel(): void {
    this.router.navigate(['/project/list']);
  }

}
