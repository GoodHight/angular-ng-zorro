import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticeIndexComponent } from './index/index.component';
import { NoticeEditComponent } from './edit/edit.component';
import { NoticeDetailComponent } from './detail/detail.component';

const routes: Routes = [
    {path: '', redirectTo: 'index', pathMatch: 'full'},
    {path: 'index', component: NoticeIndexComponent},
    {path: 'index/detail/:uuid', component: NoticeDetailComponent},
    {path: 'index/add', component: NoticeEditComponent},
    {path: 'index/edit/:uuid', component: NoticeEditComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NoticeRoutesModule {

}
