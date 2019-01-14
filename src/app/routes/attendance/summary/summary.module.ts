import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { SummaryRoutingModule } from './summary-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SummaryRoutingModule
  ],
  declarations: [IndexComponent]
})
export class SummaryModule { }
