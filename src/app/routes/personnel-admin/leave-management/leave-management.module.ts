import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LeaveManagementRoutingModule } from './leave-management-routing.module';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { ServiceModule } from '../../../service/service.module';
import { EsignationComponent } from './esignation/esignation.component';
import { DetailComponent } from './detail/detail.component';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    LeaveManagementRoutingModule,
    ServiceModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    LeaveListComponent,
    EsignationComponent,
    DetailComponent,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class LeaveManagementModule { }
