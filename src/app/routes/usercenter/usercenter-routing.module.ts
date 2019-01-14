
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'personInfo', pathMatch: 'full' },
    { path: 'personInfo', loadChildren: './person-info/person-info.module#PersonInfoModule', data: { title: '个人资料'} }, 
    { path: 'signature', loadChildren: './signature/signature.module#SignatureModule', data: { title: '电子签章'} }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class UserCenterRoutingModule { }
