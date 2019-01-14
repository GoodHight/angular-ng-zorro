import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';


const routes: Routes = [
    {
        path: '', component: SuperAdminComponent,
        children: [
            {
                path: 'qualify',
                loadChildren: './qualify-manage/qualify-manage.module#QualifyManageModule',
                data: { title: '资质审核' }
            },
            { path: 'menu', loadChildren: './menu/menu.module#MenuModule', data: { title: '功能信息' } },
            { path: 'template', loadChildren: './template/template.module#TemplateModule', data: { title: '功能模板信息' } },
            {
                path: 'version',
                loadChildren: './version-manage/version-manage.module#VersionManageModule',
                data: { title: '版本管理' }
            },
            {
                path: 'templaterole',
                loadChildren: './template-role/template-role.module#TemplateRoleModule',
                data: { title: '模板权限管理' }
            },
            {
                path: 'roletag',
                loadChildren: './menu-role-tag/menu-role-tag.module#MenuRoleTagModule',
                data: { title: '模板权限授权' }
            }, {
                path: 'authority/role',
                loadChildren: './role-mange/role.module#RoleModule',
                data: { title: '角色管理' }
            }, {
                path: 'authority',
                loadChildren: './authority-mange/authority.module#AuthorityModule',
                data: { title: '权限管理' }
            },


        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SuperAdminRoutingModule {
}
