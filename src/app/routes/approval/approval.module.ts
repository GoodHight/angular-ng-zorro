import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalRoutingModule } from './approval-routing.module';
import { IndexComponent } from './index/index.component';


@NgModule({
  imports: [
    CommonModule,
    ApprovalRoutingModule
  ],
  declarations: [IndexComponent]
})
export class ApprovalModule { }
