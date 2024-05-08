import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from "../chat/chat/chat.component";
import {BeechatComponent} from "./beechat/beechat.component";


const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: BeechatComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChabotRoutingModule { }
