import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import { NgbModal, ModalDismissReasons,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from "ngx-toastr";

import {ActivatedRoute, Router} from "@angular/router";
import {AddSubtaskComponent} from "./add-subtask/add-subtask.component";


import Sortable from 'sortablejs';
import {Subtask} from "../../../../shared/model/Subtask";
import {TasksService} from "../../../../shared/services/tasks.service";




@Component({
  selector: 'app-kanban-subtasks',
  templateUrl: './kanban-subtasks.component.html',
  styleUrls: ['./kanban-subtasks.component.scss']
})
export class KanbanSubtasksComponent implements OnInit {
  newTaskDescription: string = ''; // Description de la nouvelle tâche
  boardId: string;
  boardName:string;

  subtasks: Subtask[] = []; // Pour stocker les tâches récupérées

  subtask: Subtask; // Déclarez la variable task

  // Listes de tâches pour chaque colonne
  todoTasks: any[] = [];
  inProgressTasks: any[] = [];
  doneTasks: any[] = [];

  constructor(
    private tasksService: TasksService,
    private toastr: ToastrService,
    private route: ActivatedRoute,

    private modalService: NgbModal, // Injectez NgbModal,
  private router: Router
  ) {}



  ngOnInit(): void {


    // Initialisez la fonctionnalité de tri
    this.initSortable();
    // Initialisation des tâches statiques


    this.route.params.subscribe(params => {
      this.boardId = params['id'];
      // Faites ce que vous voulez avec l'objet Kanban, comme l'afficher dans le template
    });

    this.route.params.subscribe(params => {
      this.boardName = params['name'];
      // Faites ce que vous voulez avec l'objet Kanban, comme l'afficher dans le template
    });

    this.getSubTasks(this.boardId);


  }



  // Supprimer une tâche
  deleteTask(task: any, status: string): void {
    // Supprimer la tâche de la liste correspondante en fonction de son statut
    if (status === 'To Do') {
      this.todoTasks = this.todoTasks.filter(t => t !== task);
    } else if (status === 'In Progress') {
      this.inProgressTasks = this.inProgressTasks.filter(t => t !== task);
    } else if (status === 'Done') {
      this.doneTasks = this.doneTasks.filter(t => t !== task);
    }
  }



  openDialogAddSubTask(boardId: string) {
    const modalRef = this.modalService.open(AddSubtaskComponent , { size: 'sm' }); // Ouvre la popup de notation
    modalRef.componentInstance.boardId = boardId
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      console.log(receivedEntry);
      this.subtasks.push(receivedEntry)
    })
  }
  kanbanList: any;
  onDrop(event: DragEvent, status: string): void {
    event.preventDefault();
    // Implémenter la logique de drop ici
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragStart(event: DragEvent, task: any): void {
    event.dataTransfer.setData('task', JSON.stringify(task));
  }

  getSubTasks(boardId: string): void {
    this.tasksService.retrieveAllSubTasksByBoard(boardId).subscribe(
      subtasks => {
        this.subtasks = subtasks;
      },
      error => {
        console.error('Erreur lors de la récupération des sous-tâches : ', error);
      }
    );
  }


  initSortable(): void {
    const options = {
      group: 'subtasks',
      animation: 150,
      dragoverBubble: true,
      onStart: (event: any) => {
        event.item.classList.add('custom-cursor-drag');
      },
      onEnd: (event: any) => {
        event.item.classList.remove('custom-cursor-drag');
        const taskId = event.item.getAttribute('data-task-id');
        const newStatus = event.to.closest('.card').getAttribute('data-status');
        console.log("id de subtask : " + taskId);
        console.log("status : " + newStatus);
        this.tasksService.updateStatusSubTask(taskId, newStatus).subscribe(
          response => {
            console.log('Statut de la sous-tâche mis à jour avec succès : ', response);
            // Mettez à jour vos données côté client si nécessaire
           // this.loadSubtasks(); // Mettez à jour les sous-tâches après avoir modifié le statut
          },
          error => {
            console.error('Erreur lors de la mise à jour du statut de la sous-tâche : ', error);
          }
        );
      }
    };

    const containers = document.querySelectorAll('.card-body');
    containers.forEach(container => {
      new Sortable(container, options);
    });
  }



  deleteSubTask(id: string): void {
    this.tasksService.deleteSubTask(id).subscribe(
      () => {
        // La sous-tâche a été supprimée avec succès
        this.toastr.success('Subtask deleted successfully !', 'Succès');
        this.getSubTasks(this.boardId);
      },
      error => {
        // Une erreur s'est produite lors de la suppression de la sous-tâche
        this.toastr.error('Erreur lors de la suppression de la sous-tâche.', 'Erreur');
        console.error('Error deleting subtask !', error);
      }
    );
  }



  updateSubtask(boardId: string, id: string) {
    this.tasksService.getSubTaskById(id).subscribe((subtask: Subtask) => {
      const modalRef = this.modalService.open(AddSubtaskComponent , { size: 'sm' });
      modalRef.componentInstance.mode = 'update';
      modalRef.componentInstance.subtaskToUpdate = subtask;
      modalRef.componentInstance.passEntry.subscribe((updatedSubtask) => {
        console.log(updatedSubtask);
        // Trouver l'index de la tâche à mettre à jour dans la liste
        const index = this.subtasks.findIndex(task => task.id === updatedSubtask.id);
        if (index !== -1) {
          // Remplacer la tâche actuelle par la nouvelle tâche mise à jour
          this.subtasks[index] = updatedSubtask;
        }
      });
    });
  }



}
