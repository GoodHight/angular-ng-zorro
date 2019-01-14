import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateAddComponent } from './certificate-add/certificate-add.component';
import { TemplateComponent } from './template/template.component';
import { CertificateDetailComponent } from './certificate-detail/certificate-detail.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateAddComponent } from './template-add/template-add.component';


const routes: Routes = [
    {
        path: '', redirectTo: 'index', pathMatch: 'full'
    }, 
    {
        path: 'index', component: CertificateListComponent, data: { title: '我的培训' }
    },
    {
        path: 'index/add', component: CertificateAddComponent, data: { title: '创建班级' }
    },
    {
        path: 'index/edit/:id', component: CertificateAddComponent, data: { title: '编辑班级' }
    },
    {
        path: 'index/:id', component: CertificateDetailComponent, data: { title: '班级管理' }
    },
    {
        path: 'template', component: TemplateListComponent, data: { title: '模板管理' }
    },
    {
        path: 'templateAdd', component: TemplateAddComponent, data: { title: '新增模板' }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: [],
    exports: [
        RouterModule
    ]
})
export class CertificateRoutingModule { }
