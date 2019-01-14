import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './index/index.component';

const routes: Routes = [
    {
        path: '',
        component: IndexComponent,
        children: [
            // {path: 'message', loadChildren: './message/message.module#MessageModule', data: {title: '通讯信息'}},
            {
                path: 'employment',
                loadChildren: './employment/employment.module#EmploymentModule',
                data: {title: '从业信息'}
            },
            {path: 'education', loadChildren: './education/education.module#EducationModule', data: {title: '教育信息'}},
            {path: 'authentication', loadChildren: './authentication/authentication.module#AuthenticationModule', data: {title: '个人信息'}},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
}) 
export class UserInfoRoutingModule {
}
