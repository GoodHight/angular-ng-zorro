import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AunchComponent } from './aunch/aunch.component';

const routes: Routes = [
    {path: '', component: IndexComponent, data: { title: '工作列表'}},
    {path: 'aunch/:guid', component: AunchComponent, data: { title: '发起工作'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class WorkRoutingModule {

}
