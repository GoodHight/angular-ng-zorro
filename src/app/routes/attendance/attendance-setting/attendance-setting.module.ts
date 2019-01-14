import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AttendanceSettingRoutingModule } from './attendance-setting-routing.module';
import { AttendanceRulesComponent } from './attendance-rules/attendance-rules.component';
import { AttendanceAddressComponent } from './attendance-address/attendance-address.component';
import { WorkdaySettingComponent } from './workday-setting/workday-setting.component';
import { ShiftComponent } from './shift/shift.component';

// import { CustomModule } from '../../../custom/custom.module';

import { ServiceModule } from '../../../service/service.module';

// include custom component
// import { LalustSelectPersonComponent } from './../../../custom/lalust-select-person/lalust-select-person.component';
// import { LalustSelectDeptComponent } from './../../../custom/lalust-select-dept/lalust-select-dept.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AttendanceSettingRoutingModule,
    ServiceModule,
    // CustomModule
  ],
  declarations: [AttendanceRulesComponent, AttendanceAddressComponent, WorkdaySettingComponent, ShiftComponent
    // Introduce custom components here
    // , LalustSelectPersonComponent
    // , LalustSelectDeptComponent
  ]
})
export class AttendanceSettingModule { }
