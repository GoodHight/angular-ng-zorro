import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ManageRoutingModule } from './manage-routing.module';
import { CountlistComponent } from './countlist/countlist.component';

// include custom component
// import { LalustSelectPersonComponent } from './../../../custom/lalust-select-person/lalust-select-person.component';

// import { CustomModule } from '../../../custom/custom.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ManageRoutingModule,
    // CustomModule

  ],
  declarations: [
      CountlistComponent,
      // LalustSelectPersonComponent
    ]
})
export class ManageModule { }
