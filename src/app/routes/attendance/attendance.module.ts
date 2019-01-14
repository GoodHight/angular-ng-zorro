import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { IndexComponent } from './index/index.component';

// include custom component
// import { LalustSelectPersonComponent } from './../../custom/lalust-select-person/lalust-select-person.component';
// import { LalustSelectDeptComponent } from './../../custom/lalust-select-dept/lalust-select-dept.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AttendanceRoutingModule
  ],
  declarations: [
    IndexComponent,
    // LalustSelectPersonComponent,
    // LalustSelectDeptComponent
  ]
})
export class AttendanceModule { }
