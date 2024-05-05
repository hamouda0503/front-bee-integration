import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {Subtask} from "../../../../../shared/model/Subtask";
import {Task} from "../../../../../shared/model/Task";
import {TasksService} from "../../../../../shared/services/tasks.service";




@Component({
  selector: 'app-add-subtask',
  templateUrl: './add-subtask.component.html',
  styleUrls: ['./add-subtask.component.scss']
})
export class AddSubtaskComponent implements OnInit {
  tasks: Task[] = [];
  subtaskDescription: string;
  selectedTaskId: string;
  @Input() boardId: string; // Propriété pour recevoir l'ID de la carte
  subtasks: Subtask[] = []; // Pour stocker les tâches récupérées
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  mode: 'add' | 'update' = 'add'; // Par défaut, mode ajout
  subtaskToUpdate: Subtask; // Pour stocker les données de la sous-tâche à mettre à jour

  constructor(
    public activeModal: NgbActiveModal,
    private taskService: TasksService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Récupérer la liste des tâches au chargement du composant
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
    });

    if (this.mode === 'update' && this.subtaskToUpdate) {
      this.subtaskDescription = this.subtaskToUpdate.description;
      this.selectedTaskId = this.subtaskToUpdate.task.id
    }
  }

  onSubmit(): void {
    if (!this.subtaskDescription || !this.selectedTaskId) {
      this.toastr.error('Please provide subtask description and select a task.');
      return;
    }

    const subtask: Subtask = {
      creationDate: "", // Remplir avec la valeur appropriée
      status: "", // Remplir avec la valeur appropriée
      description: this.subtaskDescription
      // Ajoutez d'autres propriétés de la sous-tâche selon votre modèle
    };

    if (this.mode === 'add') {
      this.taskService.addSubTask(subtask, this.selectedTaskId, this.boardId).subscribe(
        (newSubtask) => {
          this.toastr.success('Subtask created successfully.');
          this.activeModal.close();
          this.passEntry.emit(newSubtask);
        },
        (error) => {
          this.toastr.error('Failed to create subtask. Please try again.');
          console.error(error);
        }
      );
    } else if (this.mode === 'update' && this.subtaskToUpdate) {
      // Si le mode est "mise à jour", émettez la sous-tâche mise à jour
      this.taskService.updateSubTask(this.subtaskToUpdate.id, this.subtaskDescription, this.selectedTaskId).subscribe(
        (updatedSubtask) => {
          this.toastr.success('Subtask updated successfully.');
          this.activeModal.close();
          // Émettez la sous-tâche mise à jour au lieu de la nouvelle sous-tâche
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
