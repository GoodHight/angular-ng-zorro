import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full', data: { title: '合同保全' }
  },
  {
    path: 'list', component: ListComponent, data: { title: '合同保全' },
  },
  {
    path: 'list/add', component: AddComponent, data: { title: '合同保全' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractPreservationRoutingModule { }
