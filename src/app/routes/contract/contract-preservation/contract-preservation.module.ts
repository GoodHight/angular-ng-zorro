import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { ContractPreservationRoutingModule } from './contract-preservation-routing.module';
import { ServiceModule } from '../../../service/service.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ContractPreservationRoutingModule,
    ServiceModule

  ],
  declarations: [AddComponent, ListComponent]
})
export class ContractPreservationModule { }
