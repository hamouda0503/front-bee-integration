

import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directives/NgbdSortableHeader';
import { TableService } from 'src/app/shared/services/table.service';
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-dashadmin',
  templateUrl: './dashadmin.component.html',
  styleUrls: ['./dashadmin.component.scss']
})
export class DashadminComponent  implements OnInit {

  public selected = [];

  public tableItem$: Observable<any>;
  public searchText;
  total$: Observable<number>;
users : any ;
  constructor(public service: TableService, private userservice: UserService) {

   this.userservice.getAllUsers().subscribe((data)=> this.users=data);
    console.log(this.users);

}



  ngOnInit() {
  }

  BlockUser(email: any){
    console.log(email);
    this.userservice.deactivateAccount(email).subscribe() ;
    for (let u of this.users){
      if (u.email == email){
        u.enabled=false;
      }
    }

  }

}
