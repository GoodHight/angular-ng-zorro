import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CompanyStorageRoutingModule } from './companystorage-routing.module';
import { CompanyStorageComponent } from './index/companystorage.component';
import { ServiceModule } from '../../../service/service.module';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateAddComponent } from './certificate-add/certificate-add.component';
import { DetailsComponent } from './details/details.component';


const COMPONENT = [
  CompanyStorageComponent
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    CompanyStorageRoutingModule,
    ServiceModule
  ],
  declarations: [
    ...COMPONENT,
    ...COMPONENT_NOROUNT,
    CertificateListComponent,
    CertificateAddComponent,
    DetailsComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class CompanyStorageModule { }
