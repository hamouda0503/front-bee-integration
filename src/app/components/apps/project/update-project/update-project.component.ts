import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../../../shared/services/project.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Project } from 'src/app/shared/model/project.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {
  projectForm: FormGroup;
  id: string;

  constructor(private fb: FormBuilder, 
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService) {

    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      location: [''],
      industry: [''],
      technologyStack: [''],
      status: [''],
      startDate: [''],
      endDate: [''],
      budget: [''],
      fundingGoal: [''],
      estimatedROI: [''],
      riskLevel: [''],
      description: [''],
      complianceStatus: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.loadProject(params['id']);
      }
    });
   
  }
  loadProject(id: string): void {
    this.projectService.getProjectById(id).subscribe(projectData => {
      this.projectForm.patchValue(projectData);
    });
  }
  updateProject(): void {
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
    this.projectService.updateProject(this.id , newProject).subscribe({
      next: (project) => {
        console.log('Project updated successfully:', project);
        this.router.navigate(['/project/list']);
      },
      error: (error) => {
        console.log("project: ", JSON.stringify(newProject));
        console.error('Failed to update project:', error);
      }
    });

  }

}
