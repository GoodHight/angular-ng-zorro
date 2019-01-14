import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeQueryComponent } from './query/employee-query.component';
import { EmployeeListComponent } from './list/employee-list.component';
import { EmployeeAddComponent } from './add/employee-add.component';
import { EmployeeBirthdayComponent } from './birthday/employee-birthday.component';
import { UserComponent } from './user/user.component';
import { CommunicationComponent } from './communication/communication.component';
import { IndexComponent } from './index/index.component';
import { PositionComponent } from './position/position.component';
import { ContractComponent } from './contract/contract.component';
import { EducationComponent } from './education/education.component';
import { SocialSecurityComponent } from './social-security/social-security.component';
import { EmploymentComponent } from './employment/employment.component';
import { TitleComponent } from './title/title.component';

const routes: Routes = [
    
    {
        path: '', redirectTo: 'index', pathMatch: 'full'
    }, {
        path: 'birthday', component: EmployeeBirthdayComponent
    }, {
        path: 'index', component: EmployeeListComponent
    }, {
        path: 'query', component: EmployeeQueryComponent
    }, {
        path: 'add', component: EmployeeAddComponent
    }, {
        path: 'birthday', component: EmployeeBirthdayComponent
    },
    {
        path: 'indexs', component: IndexComponent, data: { title: '合同签订' },
        children: [
            {path: '', redirectTo: 'user'},
            {path: 'user/:guid', component: UserComponent, data: { title: '个人信息' }},
            {path: 'communication/:guid', component: CommunicationComponent, data: { title: '通讯信息' }},
            {path: 'position/:guid', component: PositionComponent, data: { title: '岗位信息' }},
            {path: 'contract/:guid', component: ContractComponent, data: { title: '合同信息' }},
            {path: 'education/:guid', component: EducationComponent, data: { title: '教育信息' }},
            {path: 'social-security/:guid', component: SocialSecurityComponent, data: { title: '社保信息' }},
            {path: 'employment/:guid', component: EmploymentComponent, data: { title: '从业信息' }},
            {path: 'title/:guid', component: TitleComponent, data: { title: '职称信息' }},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeInfoRoutingModule {
}
