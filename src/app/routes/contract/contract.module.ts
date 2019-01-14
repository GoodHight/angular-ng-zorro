import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ContractRoutingModule } from './contract-routing.module';
import { ServiceModule } from '../../service/service.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { ContractTemplateModule } from './contract-template/contract-template.module';
import { ContractPreservationModule } from './contract-preservation/contract-preservation.module';
import { DetalisComponent } from './detalis/detalis.component';

@NgModule({
  imports: [
    CommonModule, 
    ContractRoutingModule,
    SharedModule, 
    ServiceModule, 
    ContractTemplateModule,
    ContractPreservationModule
  ],
  declarations: [ListComponent, AddComponent, DetalisComponent]
})
export class ContractModule { }
