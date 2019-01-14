import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { StorageRoutingRoutingModule } from './storage-routing.module';
import { StorageListComponent } from './list/storage-list.component';
import { ServiceModule } from '../../../service/service.module';


const COMPONENT = [
  StorageListComponent
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    StorageRoutingRoutingModule,
    ServiceModule
  ],
  declarations: [
    ...COMPONENT,
    ...COMPONENT_NOROUNT
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class StorageModule { }
