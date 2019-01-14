import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';

const COMPONENT = [];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    ...COMPONENT,
    ...COMPONENT_NOROUNT,
    IndexComponent,
    AddComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class UserModule { }
