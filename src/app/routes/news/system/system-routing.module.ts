import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemIndexComponent } from './index/index.component';
import { SystemEditComponent } from './edit/edit.component';
import { SystemDetailComponent } from './detail/detail.component';

const routes: Routes = [
    {path: '', redirectTo: 'index', pathMatch: 'full'},
    {path: 'index', component: SystemIndexComponent},
    {path: 'index/detail/:uuid', component: SystemDetailComponent},
    {path: 'index/add', component: SystemEditComponent},
    {path: 'index/edit/:uuid', component: SystemEditComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SystemRoutesModule {

}
