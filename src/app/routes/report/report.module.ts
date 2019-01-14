import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ReportRoutingModule } from './report-routing.module';
import { ListComponent } from './list/list.component';
import { ServiceModule } from '../../service/service.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule,
    ServiceModule,

  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    ListComponent
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ReportModule { }
