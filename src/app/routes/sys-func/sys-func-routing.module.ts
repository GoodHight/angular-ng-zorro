

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysFuncComponent } from './sys-func.component';


const routes: Routes = [
    {
        path: '',
        component: SysFuncComponent,
        children: [
            // { path: '', redirectTo: 'funcmanage', pathMatch: 'full' },
            { path: 'funcmanage', loadChildren: './func-manage/func-manage.module#FuncManageModule' },
            { path: 'sysrole', loadChildren: './sys-role/sys-role.module#SysRoleModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SysFuncRoutingModule { }
