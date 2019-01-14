import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../service/service.module';
import { EvaluationRoutingModule } from './evaluation-routing.module';
import { AccountListComponent } from './account-list/account-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ServiceModule,
    EvaluationRoutingModule
  ],
  declarations: [AccountListComponent]
})
export class EvaluationModule { }
