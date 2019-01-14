import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BrowserRoutingModule } from './browser-routing.module';
import { BrowserComponent } from './browser.component';
import { ServiceModule } from '../../../service/service.module';


const COMPONENT = [
  BrowserComponent
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BrowserRoutingModule,
    ServiceModule
  ],
  declarations: [
    ...COMPONENT,
    ...COMPONENT_NOROUNT
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class BrowserModule { }
