import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Task} from "../../../../shared/model/Task";
import {ToastrService} from "ngx-toastr";
import {TasksService} from "../../../../shared/services/tasks.service";

@Component({
  selector: 'app-rating-popup',
  templateUrl: './rating-popup.component.html',
  styleUrls: ['./rating-popup.component.scss']
})
export class RatingPopupComponent {
  @Input() task: Task; // Tâche à évaluer
  rating: number = 0;
  comment: string = '';
  @Output() ratingSaved: EventEmitter<number> = new EventEmitter<number>(); // Événement émis après l'enregistrement de la note

  constructor(public activeModal: NgbActiveModal, private tasksService: TasksService, private toastr: ToastrService) {
  }

  rateTask(rating: number) {
    this.rating = rating; // Met à jour la note lorsque l'utilisateur clique sur une étoile
  }

  onCancel(): void {
    // Fermer la modal sans enregistrer la note
    this.activeModal.dismiss();
  }

  saveRating() {
    // Enregistrer la note
    this.tasksService.Rating(this.task.id, this.rating).subscribe(() => {
      console.log('Note enregistrée pour la tâche:', this.task.title, 'Note:', this.rating);
      // Afficher un toast de succès
      this.toastr.success('Task rating saved successfully!', 'Success');

      // Récupérer le contenu du champ de commentaires
      const comment = this.comment;


      // Envoyer le contenu du champ de commentaires par e-mail
      // Vérifier si la note est inférieure à 3
      if (this.rating < 3) {
        // Envoyer un e-mail d'alerte à l'utilisateur assigné
        this.tasksService.sendAlertNotification(this.task.assignedUser.email, this.task, comment).subscribe(() => {
          console.log('Alert notification email sent successfully to:', this.task.assignedUser.email);
          console.log(comment);
        }, error => {
          console.error('Error sending alert notification email:', error);
          // Afficher un toast d'erreur
          this.toastr.error('An error occurred while sending the alert notification email.', 'Error');
        });
      } else {
        // Envoyer un e-mail de succès à l'utilisateur assigné
        this.tasksService.sendSuccessNotification(this.task.assignedUser.email, this.task, comment).subscribe(() => {
          console.log('Success notification email sent successfully to:', this.task.assignedUser.email);
          console.log(comment);
        }, error => {
          console.error('Error sending success notification email:', error);
          // Afficher un toast d'erreur
          this.toastr.error('An error occurred while sending the success notification email.', 'Error');
        });
      }

      this.ratingSaved.emit(this.rating);
      this.activeModal.close();
    }, error => {
      console.error('Erreur lors de l\'enregistrement de la note:', error);
      // Afficher un toast d'erreur
      this.toastr.error('An error occurred while saving the task rating.', 'Error');
    });
  }



}
