import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TemplateRoutingModule } from './template-routing.module';
import { IndexComponent } from './index/index.component';
import { AppIndexComponent } from './app-index/app-index.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

const COMPONENT = [];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    TemplateRoutingModule
  ],
  declarations: [
    ...COMPONENT,
    ...COMPONENT_NOROUNT,
    IndexComponent,
    AppIndexComponent,
    AddComponent,
    DetailComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class TemplateModule { }
