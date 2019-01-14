import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';

import { ContractOverdueRoutingModule } from './contract-overdue-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ServiceModule,
    ContractOverdueRoutingModule
  ],
  declarations: [ListComponent]
})
export class ContractOverdueModule { }
