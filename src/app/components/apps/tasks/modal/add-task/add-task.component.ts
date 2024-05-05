import { Component, OnInit, OnDestroy, TemplateRef, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {TasksComponent} from "../../tasks.component";
import {Task} from "../../../../../shared/model/Task";
import {TasksService} from "../../../../../shared/services/tasks.service";

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit, OnDestroy {
  assignedTo: string;
  dueDate:Date;
  formattedDueDate:String;
  public tagsAsString: string = '';
  @ViewChild("addTask", { static: false }) AddTask: TemplateRef<any>;

  public closeResult: string;
  public modalOpen: boolean = false;
  public task: Task = new Task(); // Initialisez une nouvelle instance de Task
  public usersWithFullName: string[]; // Liste des noms complets des utilisateurs

  constructor(
    private tasksComponent: TasksComponent,
    @Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private taskService: TasksService,
    private toastr: ToastrService // Injection de ToastrService
  ) { }

  ngOnInit(): void {
    // Récupérer la liste des noms complets des utilisateurs lors de l'initialisation du composant
    this.taskService.getUsersWithFullName().subscribe(users => {
      this.usersWithFullName = users;
    });
  }

  openModal(): void {
    this.task = { ...this.task }; // Copiez les détails de la tâche à éditer dans la propriété task
    if (isPlatformBrowser(this.platformId)) { // For SSR
      this.modalService.open(this.AddTask, {
        size: 'lg',
        ariaLabelledBy: 'modal',
        centered: true,
        windowClass: 'modal'
      }).result.then((result) => {
        this.modalOpen = false; // Fermer le modal après l'opération
        console.log(`Result ${result}`);
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }





  // onSubmit(): void {
  //   // Extraire le prénom et le nom de famille de assignedTo
  //   const [firstName, lastName] = this.assignedTo.split(' ');
  //
  //   // Mettre à jour task.tags à partir de tagsAsString
  //   this.task.tags = this.tagsAsString.split(',').map(tag => tag.trim());
  //
  //   // Appeler la méthode addTask du service pour ajouter la tâche
  //   this.taskService.addTask(this.task, firstName, lastName).subscribe({
  //     next: (addedTask) => {
  //       // Récupérer l'e-mail de l'utilisateur assigné depuis le résultat de l'ajout de la tâche
  //       const assignedUserEmail = addedTask.assignedUser.email;
  //
  //       // Envoyer la notification par e-mail à l'utilisateur assigné avec toutes les informations de la tâche
  //       this.sendNotification(assignedUserEmail, addedTask);
  //     },
  //     error: (err) => {
  //       console.error('Error adding task:', err);
  //       // Afficher la notification d'erreur
  //       this.toastr.error('An error occurred while adding the task.', 'Error!');
  //       // Gérer les erreurs si nécessaire
  //     },
  //     complete: () => {
  //       // Afficher la notification de succès
  //       this.toastr.success('Task created successfully.', 'Success!');
  //
  //       // Réinitialiser les champs du formulaire après l'ajout de la tâche
  //       this.resetForm();
  //       // Fermer le formulaire après l'ajout de la tâche
  //       this.modalService.dismissAll();
  //     }
  //   });
  // }
  onSubmit(): void {
    // Vérification du champ titre
    if (!this.task.title) {
      this.toastr.error('Please provide a title.', 'Error!');
      return;
    }

    // Vérification du champ description
    if (!this.task.description) {
      this.toastr.error('Please provide a description.', 'Error!');
      return;
    }

    if (!this.task.priority) {
      this.toastr.error('Please provide a priority.', 'Error!');
      return;
    }

    // Vérification du champ dueDate
    if (!this.task.dueDate) {
      this.toastr.error('Please provide a due date.', 'Error!');
      return;
    }
    // Convertir la chaîne de la date d'échéance en objet Date
    const dueDate: Date = new Date(this.task.dueDate);

    const currentDate: Date = new Date();

    // Vérification si la date d'échéance est ultérieure à la date système
    if (dueDate <= currentDate) {
      this.toastr.error('Due date must be greater than current date.', 'Error!');
      return;
    }

    // Vérification du champ assignedTo
    if (!this.assignedTo) {
      this.toastr.error('Please assign the task to someone.', 'Error!');
      return;
    }

    // Vérification du champ tagsAsString
    if (!this.tagsAsString) {
      this.toastr.error('Please provide at least one tag.', 'Error!');
      return;
    }

    // Vérifier si le titre commence par une lettre
    if (!/^[a-zA-Z]/.test(this.task.title)) {
      this.toastr.error('Title must start with a letter.', 'Error!');
      return;
    }


    // Extraire le prénom et le nom de famille de assignedTo
    const [firstName, lastname] = this.assignedTo.split(' ');

    // Mettre à jour task.tags à partir de tagsAsString
    this.task.tags = this.tagsAsString.split(',').map(tag => tag.trim());

    // Vérifier si le formulaire est en mode d'édition ou d'ajout
    if (this.isEditMode) {
      console.log(this.task);
      // Si en mode édition, appeler la méthode updateTask pour mettre à jour la tâche existante
      this.taskService.updateTask(this.task.id, firstName, lastname,this.task.title,this.task.description,this.task.status,this.task.priority,this.task.dueDate,this.task.tags).subscribe({
        next: (updatedTask) => {
          // Afficher la notification de succès pour la mise à jour de la tâche
          this.toastr.success('Task updated successfully.', 'Success!');
          this.tasksComponent.getTasks();
          // Réinitialiser les champs du formulaire après la mise à jour de la tâche
          this.resetForm();
          // Fermer le modal après la mise à jour de la tâche
          this.modalService.dismissAll();
        },
        error: (err) => {
          console.error('Error updating task:', err);
          // Afficher la notification d'erreur pour les échecs de mise à jour
          this.toastr.error('An error occurred while updating the task.', 'Error!');
          // Gérer les erreurs si nécessaire
        }
      });
    } else {
      // Si en mode ajout, appeler la méthode addTask pour ajouter une nouvelle tâche
      this.taskService.addTask(this.task, firstName, lastname).subscribe({
        next: (addedTask) => {
          // Récupérer l'e-mail de l'utilisateur assigné depuis le résultat de l'ajout de la tâche
          const assignedUserEmail = addedTask.assignedUser.email;

          // Envoyer la notification par e-mail à l'utilisateur assigné avec toutes les informations de la tâche
          this.sendNotification(assignedUserEmail, addedTask);
        },
        error: (err) => {
          console.error('Error adding task:', err);
          // Afficher la notification d'erreur pour les échecs d'ajout de tâche
          this.toastr.error('An error occurred while adding the task.', 'Error!');
          // Gérer les erreurs si nécessaire
        },
        complete: () => {
          // Afficher la notification de succès pour l'ajout de tâche
          this.toastr.success('Task created successfully.', 'Success!');
          // Réinitialiser les champs du formulaire après l'ajout de la tâche
          this.resetForm();
          // Fermer le modal après l'ajout de la tâche
          this.modalService.dismissAll();
          this.tasksComponent.getTasks();
        }
      });
    }
  }


  sendNotification(email: string, task: any): void {
    this.taskService.sendNotification(email, task).pipe(
      catchError((error) => {
        console.error('Error sending notification email:', error);
        return throwError(error);
      })
    ).subscribe(() => {
      console.log('Notification email sent successfully');
    });
  }





  private resetForm(): void {
    // Réinitialiser les valeurs des champs du formulaire
    this.task = {
      creationDate: null, progress: 0,
      id: '',
      title: '',
      description: '',
      status: '',
      priority: null,
      dueDate: null,
      tags: []
    };
    this.assignedTo = '';
    this.tagsAsString = '';
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
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

  // openModal2(taskId: string): void {
  //   // Appeler la méthode du service pour récupérer la tâche par son ID
  //   this.taskService.getTaskById(taskId).subscribe(
  //     (taskToEdit: Task) => {
  //       if (taskToEdit) {
  //         // Copier les détails de la tâche à éditer dans la propriété task
  //         this.task = { ...taskToEdit };
  //
  //         // Convertir la date ISO 8601 complète en format "YYYY-MM-DD"
  //         const isoDate: Date = new Date(taskToEdit.dueDate); // Convertit la date en un objet Date
  //         const year: number = isoDate.getFullYear();
  //         const month: number = isoDate.getMonth() + 1; // Les mois vont de 0 à 11
  //         const day: number = isoDate.getDate();
  //         this.task.dueDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; // Formatage de la date
  //
  //
  //         // Récupérer le nom complet de l'utilisateur assigné
  //         this.assignedTo = `${taskToEdit.assignedUser.firstName} ${taskToEdit.assignedUser.lastName}`;
  //
  //         // Convertir les tags en une chaîne séparée par des virgules
  //         this.tagsAsString = taskToEdit.tags.join(', ');
  //
  //         // Ouvrir le modal
  //         if (isPlatformBrowser(this.platformId)) { // Pour SSR
  //           this.modalService.open(this.AddTask, {
  //             size: 'lg',
  //             ariaLabelledBy: 'modal',
  //             centered: true,
  //             windowClass: 'modal'
  //           }).result.then((result) => {
  //             this.modalOpen = false; // Fermer le modal après l'opération
  //             console.log(`Result ${result}`);
  //           }, (reason) => {
  //             this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //           });
  //         }
  //       } else {
  //         console.error('La tâche avec l\'ID spécifié n\'a pas été trouvée.');
  //       }
  //     },
  //     (error) => {
  //       console.error('Une erreur est survenue lors de la récupération des détails de la tâche :', error);
  //     }
  //   );
  // }

// Définir une variable isEditMode pour contrôler le mode édition
  private isEditMode: boolean = false;


  openModal2(taskId: string): void {
    // Appeler la méthode du service pour récupérer la tâche par son ID
    this.taskService.getTaskById(taskId).subscribe(
      (taskToEdit: Task) => {
        if (taskToEdit) {
          // Copier les détails de la tâche à éditer dans la propriété task
          this.task = { ...taskToEdit };
          console.log( this.task)

          // Convertir la date ISO 8601 complète en format "YYYY-MM-DD"
          const isoDate: Date = new Date(taskToEdit.dueDate); // Convertit la date en un objet Date
          const year: number = isoDate.getFullYear();
          const month: number = isoDate.getMonth() + 1; // Les mois vont de 0 à 11
          const day: number = isoDate.getDate();
          this.task.dueDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; // Formatage de la date

          // Définir le mode édition à true
          this.isEditMode = true;

          // Vérifier si la plateforme est un navigateur
          if (isPlatformBrowser(this.platformId)) {
            // Récupérer le nom complet de l'utilisateur assigné
            this.assignedTo = `${taskToEdit.assignedUser.firstname} ${taskToEdit.assignedUser.lastname}`;
            // this.assignedTo = `${taskToEdit.assignedUser.firstname} ${taskToEdit.assignedUser.lastname}`;


            // Convertir les tags en une chaîne séparée par des virgules
            this.tagsAsString = taskToEdit.tags.join(', ');
            console.log('hhhh  ' +this.assignedTo);

            // Ouvrir le modal
            this.modalService.open(this.AddTask, {
              size: 'lg',
              ariaLabelledBy: 'modal',
              centered: true,
              windowClass: 'modal'
            }).result.then((result) => {
              this.modalOpen = false; // Fermer le modal après l'opération
              console.log(`Result ${result}`);
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
          }
        } else {
          console.error('La tâche avec l\'ID spécifié n\'a pas été trouvée.');
        }
      },
      (error) => {
        console.error('Une erreur est survenue lors de la récupération des détails de la tâche :', error);
      }
    );
  }


}
