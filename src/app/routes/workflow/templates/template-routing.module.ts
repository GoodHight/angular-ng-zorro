import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';


const routes: Routes = [
    {path: '', component: IndexComponent, data: { title: '工作流定义列表'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TemplateRoutingModule {

}
