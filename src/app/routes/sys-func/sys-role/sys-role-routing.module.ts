

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SrIndexComponent } from './index/sr-index.component';
import { SrAddComponent } from './add/sr-add.component';
import { SrAuthorizationComponent } from './authorization/sr-authorization.component';


const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: SrIndexComponent },
  { path: 'add', component: SrAddComponent },
  { path: 'edit/:guid', component: SrAddComponent },
  { path: 'authorization/:guid', component: SrAuthorizationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SysRoleRoutingModule { }
