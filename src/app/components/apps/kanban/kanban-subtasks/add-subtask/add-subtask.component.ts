import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subtask } from "../../../../../shared/model/Subtask";
import { Task } from "../../../../../shared/model/Task";
import { TasksService } from "../../../../../shared/services/tasks.service";

@Component({
  selector: 'app-add-subtask',
  templateUrl: './add-subtask.component.html',
  styleUrls: ['./add-subtask.component.scss']
})
export class AddSubtaskComponent implements OnInit {
  currentFile?: File; // Change currentFile to accept a single file
  tasks: Task[] = [];
  subtaskDescription: string;
  selectedTaskId: string;
  coverImage:string;
  @Input() boardId: string;
  subtasks: Subtask[] = [];
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  mode: 'add' | 'update' = 'add';
  subtaskToUpdate: Subtask;

  constructor(
    public activeModal: NgbActiveModal,
    private taskService: TasksService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
    });

    if (this.mode === 'update' && this.subtaskToUpdate) {
      this.subtaskDescription = this.subtaskToUpdate.description;
      this.selectedTaskId = this.subtaskToUpdate.task.id;
    }
  }

  onFileSelect(event: any): void {
    this.currentFile = event.target.files[0]; // Store the selected file
    console.log(this.currentFile);
  }

  onSubmit(): void {
    if (!this.subtaskDescription || !this.selectedTaskId) {
      this.toastr.error('Please provide subtask description and select a task.');
      return;
    }

    const subtask: Subtask = {
      id: "", // Assuming this will be generated by the server
      creationDate: "", // You should populate this with an appropriate value
      status: "", // You should populate this with an appropriate value
      description: this.subtaskDescription,
      coverImage:this.coverImage
      // Add other properties of the subtask as per your model
    };

    if (this.mode === 'add') {
      this.taskService.addSubTask(subtask, this.selectedTaskId, this.boardId, this.currentFile).subscribe(
        (newSubtask) => {
          this.toastr.success('Subtask created successfully.');
          this.activeModal.close();
          console.log(this.coverImage)
          this.passEntry.emit(newSubtask);
        },
        (error) => {
          this.toastr.error('Failed to create subtask. Please try again.');
          console.error(error);
        }
      );
    } else if (this.mode === 'update' && this.subtaskToUpdate) {
      // Assuming you have an updateSubTask method in your TasksService
      this.taskService.updateSubTask(this.subtaskToUpdate.id, this.subtaskDescription, this.selectedTaskId).subscribe(
        (updatedSubtask) => {
          this.toastr.success('Subtask updated successfully.');
          this.activeModal.close();
          this.passEntry.emit(updatedSubtask);
        },
        (error) => {
          this.toastr.error('Failed to update subtask. Please try again.');
          console.error(error);
        }
      );
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
