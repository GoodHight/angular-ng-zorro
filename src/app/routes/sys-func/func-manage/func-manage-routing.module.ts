

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FmIndexComponent } from './index/fm-index.component';
import { FmAddComponent } from './add/fm-add.component';


const routes: Routes = [
    { path: '', redirectTo: 'index/pc', pathMatch: 'full' },
    { path: 'index/pc', component: FmIndexComponent },
    { path: 'index/app', component: FmIndexComponent },
    { path: 'add/:client', component: FmAddComponent },
    { path: 'edit/:client/:guid', component: FmAddComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FuncManageRoutingModule { }
