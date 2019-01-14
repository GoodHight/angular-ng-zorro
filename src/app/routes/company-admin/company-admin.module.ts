import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CompanyAdminRoutingModule } from './company-admin-routing.module';
import { CompanyAdminComponent } from './company-admin.component';


const COMPONENT = [
  CompanyAdminComponent
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    CompanyAdminRoutingModule
  ],
  declarations: [
    ...COMPONENT,
    ...COMPONENT_NOROUNT
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class CompanyAdminModule { }
