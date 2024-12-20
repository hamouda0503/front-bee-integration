import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TodoRoutingModule } from './todo-routing.module';

import { TodoComponent } from './todo.component';
import {MatSliderModule} from "@angular/material/slider";

@NgModule({
  declarations: [TodoComponent],
    imports: [
        CommonModule,
        TodoRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        MatSliderModule
    ],
  providers: []
})
export class TodoModule { }
