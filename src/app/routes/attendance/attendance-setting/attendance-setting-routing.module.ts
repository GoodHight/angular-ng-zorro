import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceRulesComponent } from './attendance-rules/attendance-rules.component';
import { AttendanceAddressComponent } from './attendance-address/attendance-address.component';
import { WorkdaySettingComponent } from './workday-setting/workday-setting.component';
import { ShiftComponent } from './shift/shift.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'index', pathMatch: 'full'
  },
  {
    path: 'index', component: AttendanceRulesComponent
  },
  {
    path: 'address', component: AttendanceAddressComponent
  },
  {
    path: 'workday', component: WorkdaySettingComponent
  },
  {
    path: 'shift', component: ShiftComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceSettingRoutingModule { }
