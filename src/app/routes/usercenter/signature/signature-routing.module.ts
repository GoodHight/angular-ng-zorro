

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignatureComponent } from './signature.component';
import { SignatureAddEditComponent } from './signature-add-edit/signature-add-edit.component';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full'},
    { path: 'index', component: SignatureComponent },
    { path: 'index/edit/:id', component: SignatureAddEditComponent },
    { path: 'index/add', component: SignatureAddEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SignatureRoutingModule { }
