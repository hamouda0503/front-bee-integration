import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChabotRoutingModule } from './chabot-routing.module';
import { BeechatComponent } from './beechat/beechat.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    BeechatComponent
  ],
  imports: [
    CommonModule,
    ChabotRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChabotModule { }
