import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PersonalizationRoutingModule } from './personalization-routing.module';
import { IndexComponent } from './index/index.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PersonalizationRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      IndexComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class PersonalizationModule { }
