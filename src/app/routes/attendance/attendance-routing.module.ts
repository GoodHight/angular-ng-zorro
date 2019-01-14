import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';

const routes: Routes = [{
  path: '', component: IndexComponent,
  children: [
      {path: 'count', loadChildren: './count/count.module#CountModule',  data: {title: '每日统计' }},
      {path: 'manage', loadChildren: './manage/manage.module#ManageModule', data: {title: '考勤管理' }},
      {path: 'record', loadChildren: './attendance-record/attendance-record.module#AttendanceRecordModule', data: {title: '考勤原始记录' }},
      {path: 'setting', loadChildren: './attendance-setting/attendance-setting.module#AttendanceSettingModule', data: {title: '考勤设置' }},
      {path: 'time', loadChildren: './time/time.module#TimeModule', data: {title: '打卡时间表' }},
      {path: 'summary', loadChildren: './summary/summary.module#SummaryModule', data: {title: '月度汇总' }},
      {path: 'signIn', loadChildren: './sign-in/sign-in.module#SignInModule', data: {title: '签到记录' }},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
