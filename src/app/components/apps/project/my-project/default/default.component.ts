import { Component, OnInit, TemplateRef, ViewChild,Input } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart } from './data';
import { ChartType } from './dashboard.model';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { Expense } from 'src/app/shared/model/expense.model';
import { Revenue } from 'src/app/shared/model/revenue.model';
import { EventService } from './event.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';

import { ConfigService } from './config.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  modalRef?: BsModalRef;
  isVisible: string;

  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  transactions: any;
  statData: any;
  config:any = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  isActive: string;
  
  @Input('projectID') projectID: string;
  @ViewChild('content') content;
  @ViewChild('center', { static: false }) center?: ModalDirective;
  constructor(private modalService: BsModalService, private configService: ConfigService, private eventService: EventService,private transactionService: TransactionService) {
  }

  ngOnInit() {

    /**
     * horizontal-vertical layput set
     */
    const attribute = document.body.getAttribute('data-layout');

    const vertical = document.getElementById('layout-vertical');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (attribute == 'horizontal') {
      const horizontal = document.getElementById('layout-horizontal');
      if (horizontal != null) {
        horizontal.setAttribute('checked', 'true');
      }
    }

    /**
     * Fetches the data
     */
    this.fetchData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
     this.center?.show()
    }, 2000);
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;

    this.isActive = 'year';
    this.configService.getConfig().subscribe(data => {
      this.transactions = data.transactions;
      this.statData = data.statData;
    });
  }
  opencenterModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  // Function to group expenses/revenues by month
  groupByMonth(data: any[]): { [month: string]: any[] } {
    const groupedData = {};
  
    for (const item of data) {
      const date = new Date(item.date);
      const month = date.toLocaleString('en-US', { month: 'long' });
  
      if (!groupedData[month]) {
        groupedData[month] = [];
      }
  
      groupedData[month].push(item);
    }
  
    return groupedData;
  }
  weeklyreport() {
    this.isActive = 'week';

    this.transactionService.getExpensesByProjectId(this.projectID).subscribe((expenses: Expense[]) => {
      this.transactionService.getRevenuesByProjectId(this.projectID).subscribe((revenues: Revenue[]) => {
        const monthlyExpenses = this.groupByMonth(expenses); // Group expenses by month
        const monthlyRevenues = this.groupByMonth(revenues); // Group revenues by month
    
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        this.emailSentBarChart.series = [
          {
            name: 'Expenses',
            data: months.map(month => monthlyExpenses[month] ? monthlyExpenses[month].reduce((sum, expense) => sum + expense.amount, 0) : 0)
          },
          {
            name: 'Revenues',
            data: months.map(month => monthlyRevenues[month] ? monthlyRevenues[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
          }
        ];
      });
    });
    
    
  
}


  monthlyreport() {
    this.isActive = 'month';
    this.emailSentBarChart.series =
      [{
        name: 'Series A',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        name: 'Series B',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Series C',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }];
  }

  yearlyreport() {
    this.isActive = 'year';
    this.emailSentBarChart.series =
      [{
        name: 'Series A',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Series B',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Series C',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }];
  }


  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}