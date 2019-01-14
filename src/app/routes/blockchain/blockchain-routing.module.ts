import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { WellComponent } from './well/well.component';
import { ElectronicComponent } from './electronic/electronic.component';
import { InfoComponent } from './info/info.component';
import { componentFactoryName } from '@angular/compiler';
import { CertificateModule } from './certificate/certificate.module';

const routes: Routes = [
    { path: '', redirectTo: 'certificate', pathMatch: 'full' },
    {
        path: 'index', component: IndexComponent 
    },
    { path: 'well', component: WellComponent },
    { path: 'electronic', component: ElectronicComponent },
    { path: 'info', component: InfoComponent },
    { path: 'certificate', loadChildren: './certificate/certificate.module#CertificateModule', data: { title: '我的培训'} },
    { path: 'tempcertificate', loadChildren: './temp-certificate/temp-certificate.module#TempCertificateModule', data: { title: '证书签发'} },
    { path: 'storage', loadChildren: './storage/storage.module#StorageModule', data: { title: '我的存证'} },
    // { path: 'guidang', loadChildren: './guidang/browser.module#BrowserModule' },
    { path: 'companystorage', loadChildren: './companystorage/companystorage.module#CompanyStorageModule', data: { title: '企业存证'} }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlockchainRoutingModule {
}
