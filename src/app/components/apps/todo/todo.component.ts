import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


import {Router} from "@angular/router";
import {TasksService} from "../../../shared/services/tasks.service";

import {Task} from "../../../shared/model/Task";
import {User} from "../../../shared/model/User";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.scss"],
})
export class TodoComponent implements OnInit {
  todos: Task[] = []; // Initialise la variable todos pour stocker les tâches récupérées
  text: string = "";
  myDate: string = ""; // Initialise la variable myDate si nécessaire
  completed: boolean = false;
  red_border: boolean = false;
  visible: boolean = false;
  completedTasksCount: number = 0; // Initialise le nombre de tâches terminées à 0
  pendingTasksCount: number = 0; // Initialise le nombre de tâches en attente à 0
  firstName: string = ''; // Ajoutez une variable pour stocker le prénom de l'utilisateur
  email: string = ''; // Ajoutez une variable pour stocker l'e-mail de l'utilisateur
  currentUser: User;

  constructor(
    private tasksService: TasksService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTasks(); // Appelle la méthode getTasks() au chargement du composant,
    this.getCurrentUser();

  }



  getTasks(): void {
    this.tasksService.getUserTasks().subscribe({
      next: (tasks) => {
        console.log(tasks); // Affiche les données récupérées dans la console pour vérification
        this.todos = tasks; // Met à jour la liste des tâches avec celles récupérées depuis le service
        // Met à jour le nombre de tâches terminées et en attente
        this.completedTasksCount = this.todos.filter(task => task.status === 'Done').length;
        this.pendingTasksCount = this.todos.filter(task => task.status === 'To Do').length;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      }
    });
  }

  taskCompleted(task: Task): void {
    // Modifier l'état de la tâche

    this.tasksService.markTaskAsDone(task.id).subscribe(
      (updatedTask) => {
        this.toastr.success('Well done, you\'ve successfully completed this task!', '');
        task.status = 'Done';
        // Mettre à jour l'interface utilisateur ou effectuer d'autres actions nécessaires
      },
      (error) => {
        this.toastr.error('It\'s too early to complete this task! :', '');
      }
    );
  }



  taskDeleted(task: Task): void {
    const index = this.todos.indexOf(task);
    if (index !== -1) {
      this.todos.splice(index, 1); // Supprime la tâche de la liste des tâches affichées
      }
  }

  markAllAction(action: boolean): void {
    // Modifier l'état de chaque tâche
    this.todos.forEach(task => {
      task.status = action ? 'Done' : 'In Progress';
    });

    // Appeler le service pour mettre à jour toutes les tâches de l'utilisateur
    this.tasksService.updateAllUserTasksAsDone().subscribe(
      (updatedTasks) => {
        console.log('Tâches mises à jour avec succès:', updatedTasks);
        // Mettre à jour la variable completed
        this.completed = action;

        // Afficher un message toast si toutes les tâches sont terminées
        if (this.completed) {
          this.toastr.success('You have completed all your tasks! Congratulations!', '');
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des tâches:', error);
        // Gérer l'erreur si nécessaire
      }
    );
  }

  get allTasksCompleted(): boolean {
    return this.todos.every(task => task.status === 'Done');
  }
  filterTasksByStatus(status: string): void {
    this.tasksService.getTasksByStatus(status).subscribe(
      tasks => {
        this.todos = tasks;
        // Mettre à jour les compteurs de tâches terminées et en attente
        this.completedTasksCount = this.todos.filter(task => task.status === 'Done').length;
        this.pendingTasksCount = this.todos.filter(task => task.status === 'To Do').length;
      },
      error => {
        console.error('Error filtering tasks by status:', error);
      }
    );
  }
  getAllTasks(): void {
    this.getTasks(); // Cette méthode récupère toutes les tâches sans filtre
  }

  getCurrentUser(): void {
    this.tasksService.getCurrentUser()
      .subscribe(
        user => {
          this.currentUser = user;
          console.log('Utilisateur actuel:', user);
        },
        error => {
          console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
        }
      );
  }


  openRatingPopup(task: any) {

  }
}
