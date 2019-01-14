import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HelpRoutingModule } from './help-routing.module';
import { IndexComponent } from './index/index.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    HelpRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      IndexComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class HelpModule { }
