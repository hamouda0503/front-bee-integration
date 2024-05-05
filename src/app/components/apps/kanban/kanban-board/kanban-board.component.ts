import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import {KanbanComponent} from "../kanban.component";
import {Board} from "../../../../shared/model/Board";
import {TasksService} from "../../../../shared/services/tasks.service";

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {

  usersWithFullName: string[] = []; // Liste des noms complets des utilisateurs
  assignedTo: string;
  public board: Board = new Board();
  @Output() passEntry: EventEmitter<any> = new EventEmitter();


  constructor(
    //private kanbanComponent: KanbanComponent,
    public activeModal: NgbActiveModal,
              private taskService: TasksService,
              private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    // Récupérer la liste des noms complets des utilisateurs lors de l'initialisation du composant
    this.taskService.getUsersWithFullName().subscribe(users => {
      this.usersWithFullName = users;
    });
  }



  onSubmit() {
    // Logique à exécuter lorsque le formulaire est soumis
    const [firstName, lastName] = this.assignedTo.split(' ');


    this.taskService.addBoard(this.board, firstName, lastName).subscribe({
      next: (addedBoard) => {
        // Afficher un toast pour indiquer que le tableau a été créé avec succès
        this.toastr.success('Board was successfully created', 'Success');
        this.passEntry.emit(addedBoard)

        //this.kanbanComponent.getKanbanList()


        // Vous pouvez également exécuter d'autres actions après la création du tableau si nécessaire
        // Par exemple, rediriger l'utilisateur vers une autre page, mettre à jour l'affichage, etc.
      },
      error: (error) => {
        // Gérer l'erreur ici
        console.error('Error occurred while adding board:', error);
        // Afficher un toast d'erreur en cas d'échec de la création du tableau
        this.toastr.error('An error occurred while adding the board', 'Error');
      }
    });

    // Vous pouvez ajouter ici la logique pour créer le tableau avec le nom saisi

    // Ferme la modal après avoir soumis le formulaire
    this.activeModal.close();

  }
  onCancel(): void {
    // Ferme la modal sans enregistrer le nom du tableau
    this.activeModal.dismiss();
  }
}
