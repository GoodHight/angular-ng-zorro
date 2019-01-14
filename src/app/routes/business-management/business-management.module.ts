import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BusinessManagementRoutingModule } from './business-management-routing.module';
import { BusinessInfoComponent } from './business-info/business-info.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BusinessManagementRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      BusinessInfoComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class BusinessManagementModule { }
