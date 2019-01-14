import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EntryManagementRoutingModule } from './entry-management-routing.module';
import { ServiceModule } from '../../../service/service.module';
import { ListComponent } from './list/list.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { EntryFormComponent } from './entry-form/entry-form.component';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    EntryManagementRoutingModule,
    ServiceModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    ListComponent,
    AddEntryComponent,
    EntryFormComponent
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class EntryManagementModule { }
