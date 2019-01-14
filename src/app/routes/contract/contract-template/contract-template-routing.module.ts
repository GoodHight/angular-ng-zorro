import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full', data: { title: '合同模板' }
  },
  {
    path: 'list', component: ListComponent, data: { title: '合同模板' },
  },
  {
    path: 'list/add', component: AddComponent, data: { title: '合同模板' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractTemplateRoutingModule { }
