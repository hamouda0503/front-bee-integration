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
import { InvestmentService } from '../../../../../shared/services/investment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-add-investment',
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.scss'],
})
export class AddInvestmentComponent implements OnInit, OnDestroy {
  @ViewChild('addInvestment', { static: false })
  AddTransaction: TemplateRef<any>;
  @Input('projectID') projectID: string;
  @Output() transactionAdded: EventEmitter<void> = new EventEmitter<void>();

  investmentForm: FormGroup;
  public closeResult: string;
  public modalOpen: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private investmentservice: InvestmentService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.investmentForm = this.fb.group({
      amount: ['', Validators.required],
    });
    console.log("the clicked Project Id: "+this.projectID);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectID) {
      console.log(
        'Add Investment Project ID:',
        changes.projectID.currentValue
      );
    }
  }
  test(): void {
    console.log('test: ' + this.projectID);
  }

  submit(): void {
 
      const investment = {
        amount: this.investmentForm.value.amount,
      };
      this.investmentservice.addInvestment(this.storage.getUser().id ,this.projectID, investment).subscribe({
        next: (exp) => {
          console.log('Investment added successfully:', exp);
          this.transactionAdded.emit();
        },
        error: (error) => {
          console.error('Failed to add Investment:', error);
        },
      });
    
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
