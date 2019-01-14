import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { TemplateRoutingModule } from './template-routing.module';
import　{ IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
      TemplateRoutingModule
  ],
  declarations: [
      IndexComponent,
  ]
})

export class TemplateModule { }
