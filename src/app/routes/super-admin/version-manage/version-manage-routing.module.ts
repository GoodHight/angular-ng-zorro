

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VersionIndexComponent } from './index/version-index.component';
import { VersionAddEditComponent } from './add-edit/version-add-edit.component';


const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: VersionIndexComponent },
    { path: 'add', component: VersionAddEditComponent },
    { path: 'edit/:guid', component: VersionAddEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VersionManageRoutingRoutingModule { }
