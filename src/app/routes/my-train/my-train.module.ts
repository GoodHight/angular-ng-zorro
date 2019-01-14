import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MyTrainRoutingModule } from './my-train-routing.module';
import { MyTrainListComponent } from './list/my-train-list.component';
import { MyTrainAddComponent } from './add/my-train-add.component';
import { ApprovalComponent } from './approval/approval.component';
import { ServiceModule } from '../../service/service.module';


const COMPONENT = [
  MyTrainListComponent,
  MyTrainAddComponent,
  ApprovalComponent
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    MyTrainRoutingModule,
    ServiceModule
  ],
  declarations: [
    ...COMPONENT,
    ...COMPONENT_NOROUNT,
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class MyTrainModule { }
