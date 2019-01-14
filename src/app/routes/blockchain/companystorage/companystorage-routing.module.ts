


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyStorageComponent } from './index/companystorage.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { DetailsComponent } from './details/details.component';
import { CertificateAddComponent } from './certificate-add/certificate-add.component';



const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    {
        path: 'index', component: CompanyStorageComponent, children: [

        ], data: { title: '信息存证' }
    },
    { path: 'index/certificateAdd', component: CertificateAddComponent, data: { title: '新增存证' } },
    { path: 'index/details/:guid', component: DetailsComponent, data: { title: '存证详情' } },
    { path: 'certificateList', component: CertificateListComponent }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CompanyStorageRoutingModule { }
