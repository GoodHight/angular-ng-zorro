import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
const routes: Routes = [{
  path: '', component: IndexComponent,
  children: [
      {path: 'record', loadChildren: './record/record.module#RecordModule', data: {title: '审批记录' } },
      {path: 'setting', loadChildren: './setting/setting.module#SettingModule',  data: {title: '审批设置' }},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }
