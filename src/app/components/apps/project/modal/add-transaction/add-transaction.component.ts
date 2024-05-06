import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  PLATFORM_ID,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from '../../../../../shared/services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Folder } from 'src/app/shared/model/folder.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit, OnDestroy {
  @ViewChild('addTransaction', { static: false })
  AddTransaction: TemplateRef<any>;
  @Input('projectID') projectID: string;
  @Output() transactionAdded: EventEmitter<void> = new EventEmitter<void>();

  transactionForm: FormGroup;
  public transaction: string;
  public closeResult: string;
  public modalOpen: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private transactionservice: TransactionService
  ) {}

  ngOnInit(): void {
    this.transaction = '';
    this.transactionForm = this.fb.group({
      amount: ['', Validators.required],
      date: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectID) {
      console.log(
        'AddTeaansaction Project ID:',
        changes.projectID.currentValue
      );
    }
  }
  test(): void {
    console.log('test: ' + JSON.stringify(this.transactionForm.value));
  }

  submit(): void {
    let dateee = new Date(
      this.transactionForm.value.date.year,
      this.transactionForm.value.date.month - 1,
      this.transactionForm.value.date.day
    );

    let formateddate = dateee.toISOString().split('T')[0];

    if (this.transaction == 'EXPENSE') {
      const expense = {
        projectID: this.projectID,
        amount: this.transactionForm.value.amount,
        date: formateddate,
        category: this.transactionForm.value.category,
        description: this.transactionForm.value.description,
      };
      this.transactionservice.addExpense(this.projectID, expense).subscribe({
        next: (exp) => {
          console.log('Expense added successfully:', exp);
          this.transactionAdded.emit();
        },
        error: (error) => {
          console.error('Failed to add Expense:', error);
        },
      });
    }
    if (this.transaction == 'REVENUE') {
      const revenue = {
        projectID: this.projectID,
        amount: this.transactionForm.value.amount,
        date: formateddate,
        category: this.transactionForm.value.category,
        description: this.transactionForm.value.description,
      };
      this.transactionservice.addRevenue(this.projectID, revenue).subscribe({
        next: (exp) => {
          console.log('Revenue added successfully:', exp);
          // this.transactionAdded.emit();
        },
        error: (error) => {
          console.error('Failed to add Revenue:', error);
        },
      });
    }
  }

  openModal() {
    if (isPlatformBrowser(this.platformId)) {
      // For SSR
      this.modalService
        .open(this.AddTransaction, {
          size: 'lg',
          ariaLabelledBy: 'modal',
          centered: true,
          windowClass: 'modal',
        })
        .result.then(
          (result) => {
            this.modalOpen = true;
            `Result ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
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
}
