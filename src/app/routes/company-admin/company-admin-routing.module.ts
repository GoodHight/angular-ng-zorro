

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyAdminComponent } from './company-admin.component';


const routes: Routes = [
    {
        path: '',
        component: CompanyAdminComponent,
        children: [
            { path: '', redirectTo: 'user', pathMatch: 'full' },
            { path: 'user', loadChildren: './user/user.module#UserModule' },
            { path: 'role', loadChildren: './role/role.module#RoleModule' }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CompanyAdminRoutingModule { }
