import {Component, ViewEncapsulation, ViewChild, TemplateRef, signal, ElementRef} from '@angular/core';
import { startOfDay, endOfDay, isSameMonth, isSameDay } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
//import { DatePipe } from '@angular/common'; // Importez DatePipe
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

import { ToastrService } from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {ConfirmationModalComponent} from "../tasks/confirmation-modal/confirmation-modal.component";
import {TasksService} from "../../../shared/services/tasks.service";
import {Task} from "../../../shared/model/Task";

const colors: any = {
  red: {
    primary: '#4466f2',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalenderComponent {
  private modalRef: NgbModalRef;

  event = { end: null };
  @ViewChild('inputField') inputField: ElementRef;

  @ViewChild('modalContent', {static: false})
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
    task: Task;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({event}: { event: CalendarEvent }): void => {
        //this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;



  onUpdateClick(event: CalendarEvent) {
    // Ouvrir la modal et stocker la référence
    this.modalRef = this.modalService.open(ConfirmationModalComponent);
    this.modalRef.componentInstance.message = 'Are you sure you want to update the due date?';

    // Gérer les événements d'émission de confirmation et d'annulation de la modal
    this.modalRef.componentInstance.confirm.subscribe(() => {
      const taskId = String(event.id);
      const newDueDate = new Date(event.end);

      this.tasksService.updateDueDate(taskId, newDueDate).subscribe(
        (updatedTask: Task) => {
          this.loadTasks();
          this.toastr.success('Due date updated successfully.');
          this.modalRef.close();
        },
        (error) => {
          this.toastr.error('Task creation date exceeds 24 hours. You cannot modify the due date!', 'Error');
          this.modalRef.close();
        }
      );
    });

    this.modalRef.componentInstance.cancel.subscribe(() => {
      console.log('Operation cancelled.');
    });
  }

  handleTaskClick(event: CalendarEvent): void {
    const taskId = String(event.id);
    this.tasksService.deleteTask(taskId).subscribe({
      next: () => {
        // Si la suppression réussit, mettez à jour la liste des tâches en récupérant à nouveau les tâches
        this.loadTasks();
        this.toastr.success('Task deleted successfully !', '');
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.toastr.error('An error occurred while deleting the task ! ', '');
      }
    });
  }


  deleteClick(event: CalendarEvent) {
    const taskId = String(event.id);
    // Ouvrir la modal et stocker la référence
    this.modalRef = this.modalService.open(ConfirmationModalComponent);
    this.modalRef.componentInstance.message = 'Are you sure you want to delete the task?';

    // Gérer les événements d'émission de confirmation et d'annulation de la modal
    this.modalRef.componentInstance.confirm.subscribe(() => {
      const taskId = String(event.id);

      this.tasksService.deleteTask(taskId).subscribe({
        next: () => {
          // Si la suppression réussit, mettez à jour la liste des tâches en récupérant à nouveau les tâches

          this.toastr.success('Task deleted successfully!', '');
          this.modalRef.close();
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          this.toastr.error('An error occurred while deleting the task!', '');
        }
      });
    });

    this.modalRef.componentInstance.cancel.subscribe(() => {
      console.log('Operation cancelled.');
    });
  }


  // DeleteClick(id: string) {
  //   // Ouvrir la modal et stocker la référence
  //   this.modalRef = this.modalService.open(ConfirmationModalComponent);
  //   this.modalRef.componentInstance.message = 'Are you sure you want to delete this task ?';
  //
  //   // Gérer les événements d'émission de confirmation et d'annulation de la modal
  //   this.modalRef.componentInstance.confirm.subscribe(() => {
  //
  //     this.tasksService.deleteTask(id).subscribe({
  //       next: () => {
  //         // Si la suppression réussit, mettez à jour la liste des tâches en récupérant à nouveau les tâches
  //
  //         this.toastr.success('Task deleted successfully !', '');
  //         this.modalRef.close();
  //         this.getTasks();
  //       },
  //       error: (err) => {
  //         console.error('Error deleting task:', err);
  //         this.toastr.error('An error occurred while deleting the task ! ', '');
  //         this.modalRef.close();
  //       }
  //     });
  //
  //
  //   });
  //
  //   this.modalRef.componentInstance.cancel.subscribe(() => {
  //     console.log('Operation cancelled.');
  //     this.getTasks();
  //   });
  // }









  constructor(
    private datePipe: DatePipe,
    private modal: NgbModal,
    private tasksService: TasksService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.loadTasks();
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  // eventTimesChanged({
  //                     event,
  //                     newStart,
  //                     newEnd
  //                   }: CalendarEventTimesChangedEvent): void {
  //   event.start = newStart;
  //   event.end = newEnd;
  //  // this.handleEvent('Dropped or resized', event);
  // }
  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    const taskId = String(event.id);

    // Mettez à jour la date d'échéance (due date) de la tâche avec la nouvelle date de fin (newEnd)
    this.tasksService.updateDueDate(taskId, newEnd).subscribe(
      (updatedTask: Task) => {
        // Mettez à jour l'affichage ou effectuez d'autres actions si nécessaire
        this.toastr.success('La date d\'échéance a été mise à jour avec succès.');
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la date d\'échéance :', error);
        this.toastr.error('Erreur lors de la mise à jour de la date d\'échéance.', 'Erreur');
      }
    );
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const taskId = String(event.id);
    const task$ = this.tasksService.getTaskById(taskId);

    task$.subscribe(
      (task: Task) => {
        this.modalData = {action, event, task};
        this.modal.open(this.modalContent, {size: 'lg'});
      },
      (error) => {
        console.error('Error retrieving task:', error);
      }
    );
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
  }

  loadTasks(): void {
    this.tasksService.getAllTasks().subscribe(
      (tasks: Task[]) => {
        this.events = tasks.map(task => ({
          id: task.id, // Add unique id for each event
          start: new Date(task.creationDate),
          end: new Date(task.dueDate),
          title: task.title,
          color: colors.red,
          actions: this.actions,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true
          }
        }));
        this.refresh.next(null);
      },
      error => {
        console.error('Error retrieving tasks:', error);
      }
    );
  }





  // updateTask(taskId: string, updatedTask: Task) {
  //   const firstName = 'chaima';
  //   const lastName = 'lotfi';
  //   this.tasksService.updateTask(taskId, updatedTask).subscribe({
  //     next: (updatedTask) => {
  //       // Gérer la réponse après la mise à jour de la tâche
  //       console.log('Task updated successfully:', updatedTask);
  //     },
  //     error: (error) => {
  //       // Gérer les erreurs
  //       console.error('Error updating task:', error);
  //     }
  //   });
  // }

  ngAfterViewInit() {
    // Après que la vue a été initialisée, accédez à l'élément inputField et ajoutez un écouteur d'événement
    this.inputField.nativeElement.addEventListener('input', () => {
      console.log('Valeur actuelle de l\'input :', this.inputField.nativeElement.value);
    });
  }



}
