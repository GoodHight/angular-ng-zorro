import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full', data: { title: '失效合同' }
  },
  {
    path: 'list', component: ListComponent, data: { title: '失效合同' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractOverdueRoutingModule { }
