import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/shared/services/project.service';
import { Project } from 'src/app/shared/model/project.model';
import { FileBee } from 'src/app/shared/model/file.model';
import { Storage } from 'src/app/shared/model/storage.model';
import { Folder } from 'src/app/shared/model/folder.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AddFolderComponent } from '../modal/add-folder/add-folder.component';
import { FolderService } from '../../../../shared/services/folder.service';
import { FileService } from '../../../../shared/services/file.service';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
})


export class FileManagerComponent implements OnInit {
  @ViewChild('addFolder') AddFolder: AddFolderComponent;
  private routeSub: Subscription;
  project: Project = new Project();
  pageTitle: string;
  projectId: string;
  parentFolder: Folder;
  projectStorage: Storage;
  folders: Folder[];
  files: File[] = [];
  retrieved_files: FileBee[];
  upload: boolean;
  elementWidth: string = '0%'; 
  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private folderservice: FolderService,
    private fileservice: FileService
  ) {}

  ngOnInit() {
    this.upload = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.projectId = params['projectid'];
      this.loadProjectAndDependencies(this.projectId, params['folderId']);
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe(); // Proper cleanup to avoid memory leaks
    }
  }

  loadProjectAndDependencies(projectId: string, folderId?: string) {
    this.loadProject(projectId);
    this.loadStorage(projectId);
    if (folderId) {
      this.loadFolder(folderId);
    } else {
      this.loadParent(projectId);
    }
  }
  
  openFolder(projectId: string, folderId: string): void {
    this.router.navigate(['/project/file-manager', projectId, folderId]);
  }
  //refresh folders
  onFolderAdded() {
    this.loadFolders(this.parentFolder.folderID);
  }
  onFiledAdded() {
    this.loadFiles2(this.parentFolder.folderID);
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }
  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  toggleUpload(): void{
    console.log('before: ',this.upload);
    if(this.upload)
        this.upload = false;
    else
        this.upload = true;

        console.log('after: ',this.upload);
  }

  onFileDownload(fileId: string): void {
    this.fileservice.downloadFile(fileId).subscribe({
      next: blob => {
        console.log('File download initiated.'); 
      },
      error: err => console.error('Error downloading the file:', err)
    });
  }
 
  uploadFile(): void {
    if (this.files) {

      this.fileservice.uploadFile(this.files[0], this.parentFolder.absolutePath+"/", this.projectId, this.parentFolder.folderID)
        .subscribe({
          next: (event) => {
            console.log('Upload progress:', event);
            this.loadFiles2(this.parentFolder.folderID);
            this.loadStorage(this.projectId);
          },
          error: (error) => {
            console.error('Upload failed:', error);
          }
        });
        this.upload = false;

    }
  }
  //Loaders
  loadProject(id: string): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project;
        this.pageTitle = project.name;
      },
      error: (err) => console.error('Error fetching project', err),
    });
  }
  loadStorage(id: string): void {
    this.projectService.getProjectStorage(id).subscribe({
      next: (storage) => {
        this.projectStorage = storage;
        // Assuming storage.usedCapacity is a percentage; adjust if it's a different format
        this.elementWidth = (storage.usedCapacity * 1 )+ '%';
        console.log('Storage: ' + JSON.stringify(storage));
      },
      error: (err) => console.error('Error fetching storage', err)
    });
  }
 
  loadParent(id: string): void {
    this.folderservice.getParentFolder(id).subscribe({
      next: (folder) => {
        this.parentFolder = folder;
        this.loadFolders(folder.folderID);
        this.loadFiles(id,folder.folderID);
        // this.parentFolder = folder.parentFolderID;
      },
      error: (err) => console.error('Error fetching parent folder', err),
    });
  }
  loadFolder(id: string): void {
    this.folderservice.getFolder(id).subscribe({
      next: (folder) => {
        this.parentFolder = folder;
        this.loadFolders(folder.folderID);
        this.loadFiles2(folder.folderID);
        // this.parentFolder = folder.parentFolderID;
      },
      error: (err) => console.error('Error fetching parent folder', err),
    });
  }
  loadFolders(id: string): void {
    this.folderservice.getFoldersByParent(id).subscribe({
      next: (folders) => {
        this.folders = folders;
        console.log('Folders:');
        this.folders.forEach((folder) => {
          console.log(folder);
        });
      },
      error: (err) => console.error('Error fetching folders', err),
    });
  }
  loadFiles(projectid: string, folderid: string): void {
    console.log("Attempting to load files for project ID:", projectid, "and folder ID:", folderid);
    this.fileservice.getFilesByFolder(projectid, folderid).subscribe({
      next: (files) => {
        console.log("Files loaded successfully:", files);
        this.retrieved_files = files;
        this.retrieved_files.forEach(file => {
          file.fileSize = this.formatFileSize(file.fileSize);
        });
      },
      error: (err) => {
        console.error('Error fetching files', err);
        console.log('Error details:', err.message);
      }
    });
  }
  loadFiles2(folderid: string): void {
    this.fileservice.getFilesByOneFolder( folderid).subscribe({
      next: (files) => {
        console.log("Files loaded successfully:", files);
        this.retrieved_files = files;
        this.retrieved_files.forEach(file => {
          file.fileSize = this.formatFileSize(file.fileSize);
        });
      },
      error: (err) => {
        console.error('Error fetching files', err);
        console.log('Error details:', err.message);
      }
    });
  }
  onDeleteFolder(event: MouseEvent, folderId: string): void {
    event.preventDefault(); // Prevents the default context menu from opening
    if (confirm("Are you sure you want to delete this folder?")) {
      this.folderservice.deleteFolder(folderId).subscribe({
        next: (result) => {
          console.log('Folder deleted', result);
          this.folders = this.folders.filter(folder => folder.folderID !== folderId);
          this.loadStorage(this.projectId);
        },
        error: (error) => {
          console.error('Error deleting folder:', error);
        }
      });
    }
  }
  onDeleteFile(event: MouseEvent, fileId: string): void {
    event.preventDefault(); // Prevents the default context menu from opening
    if (confirm("Are you sure you want to delete this file?")) {
      this.fileservice.deleteFile(fileId).subscribe({
        next: (result) => {
          console.log('File deleted', result);
          this.retrieved_files = this.retrieved_files.filter(file => file.fileID !== fileId);
          this.loadStorage(this.projectId);
        },
        error: (error) => {
          console.error('Error deleting file:', error);
        }
      });
    }
  }
  getFileIcon(file: FileBee): string {
    const extension = file.fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'ppt': case 'pptx':
            return 'fa fa-file-powerpoint-o txt-info';
        case 'xls': case 'xlsx':
            return 'fa fa-file-excel-o txt-info';
        case 'doc': case 'docx':
            return 'fa fa-file-word-o txt-info';
        case 'pdf':
            return 'fa fa-file-pdf-o txt-danger';
        case 'txt':
            return 'fa fa-file-text-o txt-info';
        case 'jpg': case 'jpeg':
            return 'fa fa-file-photo-o txt-success'; // or 'fa fa-file-image-o txt-info'
        case 'png':
            return 'fa fa-file-image-o txt-success';
        case 'gif':
            return 'fa fa-file-image-o txt-info';
        case 'csv':
            return 'fa fa-file-text-o txt-info';
        case 'zip': case 'rar':
            return 'fa fa-file-archive-o txt-info';
        case 'mp3':
            return 'fa fa-file-audio-o txt-info';
        case 'wav':
            return 'fa fa-file-audio-o txt-info';
        case 'mp4': case 'avi': case 'mkv':
            return 'fa fa-file-video-o txt-info';
        case 'js': case 'json': case 'css': case 'html': case 'php':
            return 'fa fa-file-code-o txt-info';
        case 'xml':
            return 'fa fa-file-code-o txt-info';
        default:
            return 'fa fa-file-o txt-info'; // Default icon for unknown file types
    }
}


formatFileSize(size: number): number {
  if (!size) return -1; // Return a special value indicating unavailable size
  return parseFloat((size / 1024 / 1024).toFixed(2)); // Convert bytes to MB and ensure it's a number
}

downloadFile(fileId: string): void {
  this.fileservice.downloadFile(fileId).subscribe({
    next: (response: HttpResponse<Blob>) => {
      this.downloadBlob(response.body, response.headers.get('Content-Disposition')?.split('filename=')[1].replace(/"/g, ''));
    },
    error: (error: any) => {
      console.error('Error downloading the file.', error);
    },
    complete: () => console.log('File download completed.') // Optional: handle any actions after completion
  });
}

private downloadBlob(blob: Blob | null, fileName: string): void {
  if (blob) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();

    window.URL.revokeObjectURL(url);
    anchor.remove();
  }
}
/*
downloadFile(fileId: string): void {
  this.fileservice.downloadFile(fileId).subscribe({
    next: (response) => {
      const headers = response.headers;

      console.log('Response headers:', response.headers.keys());
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log('Content-Disposition:', contentDisposition);
      let filename = this.extractFilename(contentDisposition) || 'default-filename';

      const blob = new Blob([response.body], { type: response.body.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Download failed:', error);
    }
  });
}

private extractFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) {
    return null;
  }
  const filenameRegex = /filename="([^"]+)"/;
  const matches = filenameRegex.exec(contentDisposition);
  if (matches && matches[1]) {
    return matches[1];
  }
  return null;
}
*/
  
}
