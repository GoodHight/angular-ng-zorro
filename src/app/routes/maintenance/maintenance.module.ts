import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { IndexComponent } from './index/index.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    MaintenanceRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      IndexComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class MaintenanceModule { }
