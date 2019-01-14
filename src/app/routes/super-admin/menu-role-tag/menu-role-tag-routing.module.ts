

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MrtIndexComponent } from './index/mrt-index.component';


const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: MrtIndexComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MenuRoleTagRoutingModule { }
