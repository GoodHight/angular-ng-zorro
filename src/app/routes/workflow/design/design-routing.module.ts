import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DetailsComponent } from './details/details.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
    {path: '', component: IndexComponent, data: { title: '工作流列表'}},
    {path: 'details/:guid', component: DetailsComponent, data: { title: '工作流详情'}},
    {path: 'update/:guid', component: UpdateComponent, data: { title: '工作流自定义'}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DesignRoutingModule {

}
