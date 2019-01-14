import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { ContractTemplateRoutingModule } from './contract-template-routing.module';
import { ServiceModule } from '../../../service/service.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ContractTemplateRoutingModule,
    ServiceModule,
  ],
  declarations: [ListComponent, AddComponent]
})
export class ContractTemplateModule { }
