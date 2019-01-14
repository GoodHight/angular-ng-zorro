import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateAddComponent } from './certificate-add/certificate-add.component';
import { TemplateComponent } from './template/template.component';
import { CertificateDetailComponent } from './certificate-detail/certificate-detail.component';
import { ServiceModule } from '../../../service/service.module';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateAddComponent } from './template-add/template-add.component';


const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    CertificateRoutingModule,
    ServiceModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      CertificateListComponent,
      CertificateAddComponent,
      TemplateComponent,
      CertificateDetailComponent,
      TemplateListComponent,
      TemplateAddComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class CertificateModule { }
