

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrIndexComponent } from './index/tr-index.component';
import { TrAddEditComponent } from './add-edit/tr-add-edit.component';


const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: TrIndexComponent },
    { path: 'add', component: TrAddEditComponent },
    { path: 'edit/:guid', component: TrAddEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TemplateRoleRoutingModule { }
