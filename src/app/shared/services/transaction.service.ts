import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';  
import { Expense } from '../model/expense.model';
import { Revenue } from '../model/revenue.model';


@Injectable({
    providedIn: 'root'
  })
  export class TransactionService {
    private revenueUrl = 'http://localhost:8080/api/v1/revenues';  
    private expenseUrl = 'http://localhost:8080/api/v1/expenses';  
  
    constructor(private http: HttpClient, private userService: UserService) { }
  
    addExpense(projectId: string, expense: Object): Observable<Expense> {
      const headers = this.userService.getHeaders();  
      return this.http.post<Expense>(this.expenseUrl+ "/" + projectId , expense, { headers });
    }
    addRevenue(projectId: string, revenue: Object): Observable<Revenue> {
        const headers = this.userService.getHeaders();  
        return this.http.post<Revenue>(this.revenueUrl+ "/" + projectId , revenue, { headers });
      }
  
  }
  