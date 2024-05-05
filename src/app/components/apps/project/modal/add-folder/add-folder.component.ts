import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, PLATFORM_ID, Inject, Input,OnChanges ,SimpleChanges, Output ,EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FolderService } from '../../../../../shared/services/folder.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Folder } from 'src/app/shared/model/folder.model';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit, OnDestroy {

  @ViewChild("addFolder", { static: false }) AddFolder: TemplateRef<any>;
  @Input("parentFolder") parentFolder: Folder;
  @Output() folderAdded: EventEmitter<void> = new EventEmitter<void>();

  folderForm: FormGroup;

  public closeResult: string;
  public modalOpen: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private fb: FormBuilder,
  private folderservice: FolderService) { }

  ngOnInit(): void {
  //    console.log("ell iddd: "+this.projectId);
  console.log("PRENT FOLDER FROM FILE MANAGER:"+this.parentFolder);
  this.folderForm = this.fb.group({
  name: ['', Validators.required]   
 });  
  }  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.parentFolder) {
      console.log("AddFolderComponent parent ID:", changes.parentFolder.currentValue);
    }
  }
 
  /*
    folderID: string;
    projectID: string;
    parentFolderID: string;
    absolutePath: string;
    name: string;
    creationDate: Date; 
  */
  
  submit(): void {
    console.log("Initial parentFolder check:", this.parentFolder.folderID);

    if (!this.parentFolder || !this.parentFolder.folderID) {
        console.error('Parent folder or folder ID is null');
        return;  // Optionally, handle this case more gracefully
    }
    const folder = {
        name: this.folderForm.value.name,
        folderID: "",
        projectID: "",
        parentFolderID: "",  // Assuming this is the correct attribute
        absolutePath: "",
        creationDate: null 
    };
    console.log("Before HTTP request: Parent Folder ID:", this.parentFolder.folderID);
    console.log("Parent Folder:", folder);
    // Uncomment to perform the action
    this.folderservice.addSubFolder(this.parentFolder.folderID, folder).subscribe({
      next: (project) => {
        console.log('Folder added successfully:', project);
        this.folderAdded.emit();
      },
      error: (error) => {
        console.error('Failed to add folder:', error);
      }
    });
}

  openModal() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.modalService.open(this.AddFolder, { 
        size: 'lg',
        ariaLabelledBy: 'modal',
        centered: true,
        windowClass: 'modal'
      }).result.then((result) => {
        this.modalOpen = true;
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    if(this.modalOpen){
      this.modalService.dismissAll();
    }
  }

}
