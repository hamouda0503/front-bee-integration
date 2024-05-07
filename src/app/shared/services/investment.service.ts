import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';  
import { Investment } from '../model/investment.model';


@Injectable({
    providedIn: 'root'
  })
  export class InvestmentService {
    private Url = 'http://localhost:8080/api/v1/investments';  
  
    constructor(private http: HttpClient, private userService: UserService) { }
  
    addInvestment(investmentId: string, projectId: string, investment: Object): Observable<Investment> {
      const headers = this.userService.getHeaders();  
      return this.http.post<Investment>(this.Url+ "/" + projectId+"/"+ investmentId , investment, { headers });
    }

    checkInvestment(investor: string, projectId: string): Observable<Boolean> {
        const headers = this.userService.getHeaders();  
        return this.http.get<Boolean>(this.Url+ "/" + projectId+"/"+ investor , { headers });
      }

  
  }
  