import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TempCertificateRoutingRoutingModule } from './temp-certificate-routing.module';
import { TempCertificateListComponent } from './list/temp-certificate-list.component';
import { ServiceModule } from '../../../service/service.module';


const COMPONENT = [
  TempCertificateListComponent
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    TempCertificateRoutingRoutingModule,
    ServiceModule
  ],
  declarations: [
    ...COMPONENT,
    ...COMPONENT_NOROUNT
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class TempCertificateModule { }
