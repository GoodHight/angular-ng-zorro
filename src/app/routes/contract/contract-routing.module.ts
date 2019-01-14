import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { DetalisComponent } from './detalis/detalis.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full', data: { title: '合同签订' }
  },
  {
    path: 'list', component: ListComponent, data: { title: '合同签订' },
  },
  {
    path: 'list/add', component: AddComponent, data: { title: '合同签订' },
  },
  {
    path: 'list/detalis/:guid', component: DetalisComponent, data: { title: '合同详情' },
  },
   // 合同模板 
   { path: 'template', loadChildren: './contract-template/contract-template.module#ContractTemplateModule' },
   // 合同保全 
   { path: 'preservation', loadChildren: './contract-preservation/contract-preservation.module#ContractPreservationModule' },
   //  
   { path: 'overdue', loadChildren: './contract-overdue/contract-overdue.module#ContractOverdueModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule { }
