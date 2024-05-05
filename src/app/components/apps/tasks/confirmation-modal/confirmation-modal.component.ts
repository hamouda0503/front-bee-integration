import { Component, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) { }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    // Fermer la modal en émettant l'événement d'annulation
    this.cancel.emit();
    this.activeModal.dismiss();
  }
}
