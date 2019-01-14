import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OrganizationRoutingModule } from './organization-routing.module';
import { DutySystemComponent } from './duty-system/duty-system.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    OrganizationRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      DutySystemComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class OrganizationModule { }
