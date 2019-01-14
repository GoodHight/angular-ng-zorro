

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TempCertificateListComponent } from './list/temp-certificate-list.component';


const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: TempCertificateListComponent , data: { title: '证书签发'} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TempCertificateRoutingRoutingModule { }
