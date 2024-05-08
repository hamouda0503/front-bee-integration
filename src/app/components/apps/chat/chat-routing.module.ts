import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { RerouteafterjoinComponent } from './rerouteafterjoin/rerouteafterjoin.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: ChatComponent
    },
    {
      path: ':id',
      component: ChatComponent
    },
    {
      path: 'join/:id',
      component: RerouteafterjoinComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
