import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '', component: ListComponent, data: { title: '汇报管理' }
    // children: [
    //   { path: 'setting', loadChildren: './attendance-setting/attendance-setting.module#AttendanceSettingModule', data: { title: '考勤设置' } },
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
