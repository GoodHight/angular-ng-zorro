import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DictionaryRoutingModule } from './dictionary-routing.module';
import { DictionaryManagementComponent } from './dictionary-management/dictionary-management.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    DictionaryRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      DictionaryManagementComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class DictionaryModule { }
