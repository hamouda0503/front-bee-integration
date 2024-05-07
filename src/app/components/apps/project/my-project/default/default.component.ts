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
   
    this.weeklyreport();
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

    this.isActive = 'week';
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
        console.log("Expenses list After grouping:"+ monthlyExpenses);
        console.log("Revenues list After grouping:"+monthlyRevenues);

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

yearlyreport() {
  this.isActive = 'year';
    this.transactionService.getRevenuesByProjectId(this.projectID).subscribe((revenues: Revenue[]) => {
      const salesRevenues = this.groupByMonthByCatRevenue1(revenues); 
      const subscriptionRevenues = this.groupByMonthByCatRevenue2(revenues); 
      const advertisingRevenues = this.groupByMonthByCatRevenue3(revenues); 
      const licensingRevenues = this.groupByMonthByCatRevenue4(revenues); 
      const otherRevenues = this.groupByMonthByCatRevenue5(revenues); 


      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      this.emailSentBarChart.series = [
        {
          name: 'Sales',
          data: months.map(month => salesRevenues[month] ? salesRevenues[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        },
        {
          name: 'Subscriptions',
          data: months.map(month => subscriptionRevenues[month] ? subscriptionRevenues[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        },
        {
          name: 'Advertising',
          data: months.map(month => advertisingRevenues[month] ? advertisingRevenues[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        },
        {
          name: 'Licencing',
          data: months.map(month => licensingRevenues[month] ? licensingRevenues[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        },
        {
          name: 'Other',
          data: months.map(month => otherRevenues[month] ? otherRevenues[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        }
      ];
    });
 
}
monthlyreport() {
  this.isActive = 'month';
    this.transactionService.getExpensesByProjectId(this.projectID).subscribe((expenses: Expense[]) => {
      const marketingExpenses = this.groupByMonthByCatExpense1(expenses); 
      const softwareExpenses = this.groupByMonthByCatExpense2(expenses); 
      const suppliesExpenses = this.groupByMonthByCatExpense3(expenses); 
      const transportExpenses = this.groupByMonthByCatExpense4(expenses); 
      const servicesExpenses = this.groupByMonthByCatExpense5(expenses); 
      const otherExpenses = this.groupByMonthByCatExpense6(expenses); 


      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      this.emailSentBarChart.series = [
        {
          name: 'Marketing',
          data: months.map(month => marketingExpenses[month] ? marketingExpenses[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        },
        {
          name: 'Software',
          data: months.map(month => softwareExpenses[month] ? softwareExpenses[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        },
        {
          name: 'Supplies',
          data: months.map(month => suppliesExpenses[month] ? suppliesExpenses[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        },
        {
          name: 'Transport',
          data: months.map(month => transportExpenses[month] ? transportExpenses[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        },
        {
          name: 'Services',
          data: months.map(month => servicesExpenses[month] ? servicesExpenses[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        },
        {
          name: 'Other',
          data: months.map(month => otherExpenses[month] ? otherExpenses[month].reduce((sum, revenue) => sum + revenue.amount, 0) : 0)
        }
      ];
    });
 
}

groupByMonthByCatExpense1(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "marketing"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatExpense2(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "software"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatExpense3(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "supplies"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatExpense4(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "transport"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatExpense5(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "services"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatExpense6(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "other"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatRevenue1(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "sales"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatRevenue2(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "subscriptions"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatRevenue3(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "advertising"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatRevenue4(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "licensing"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}
groupByMonthByCatRevenue5(data: any[]): { [month: string]: any[] } {
  const groupedData = {};

  for (const item of data) {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    if(item.category == "other"){
    groupedData[month].push(item);
    }
  }
  return groupedData;
}










  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}