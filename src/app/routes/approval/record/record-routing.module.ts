import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: '', component: IndexComponent, data: { title: '审批记录' } },
  { path: ':guid', component: DetailsComponent, data: { title: '审批详情' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RecordRoutingModule {

}
