import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { EsignationComponent } from './esignation/esignation.component';
import { DetailComponent } from './detail/detail.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'leave-list', pathMatch: 'full'
  }, {
    path: 'leave-list', component: LeaveListComponent
  }, {
    path: 'leave-list/esignation', component: EsignationComponent
  }, {
    path: 'leave-list/detalis/:guid', component: DetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
