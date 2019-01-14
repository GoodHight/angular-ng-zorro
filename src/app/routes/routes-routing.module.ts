import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
// import {LayoutPassportComponent} from '../layout/passport/passport.component';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
// passport pages
// import {UserLoginComponent} from './passport/login/login.component';
// import {UserRegisterComponent} from './passport/register/register.component';
// import {UserRegisterResultComponent} from './passport/register-result/register-result.component';
// import {UserRegisterTypeComponent} from './passport/register-type/register-type.component';
// import {ForgetPasswordComponent} from './passport/forget-password/forget-password.component';

// single pages
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { LoadingComponent } from './loading/loading.component';
import { BrowserDetailComponent } from './blockchain/storage/detail/browser-detail.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { ACLGuard } from '@delon/acl';

import { AppNoticeComponent } from './app-notice/app-notice.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardV1Component },
            { path: 'my', loadChildren: './my/my.module#MyModule' },
            {

                path: 'personnel-admin/employee-info',
                loadChildren: './personnel-admin/employee-info/employee-info.module#EmployeeInfoModule',
                data: { title: '人员管理' }
            },
            {

                path: 'personnel-admin/entry-management',
                loadChildren: './personnel-admin/entry-management/entry-management.module#EntryManagementModule',
                data: { title: '入职管理' }
            },
            {

                path: 'personnel-admin/leave-management',
                loadChildren: './personnel-admin/leave-management/leave-management.module#LeaveManagementModule',
                data: { title: '离职管理' }
            },
            {
                path: 'business-management',
                loadChildren: './business-management/business-management.module#BusinessManagementModule'
            },
            { path: 'news', loadChildren: './news/news.module#NewsModule' },
            { path: 'organization', loadChildren: './organization/organization.module#OrganizationModule' },
            { path: 'maintenance', loadChildren: './maintenance/maintenance.module#MaintenanceModule' },
            { path: 'help', loadChildren: './help/help.module#HelpModule' },
            { path: 'recruit', loadChildren: './recruit/recruit.module#RecruitModule' },
            { path: 'report', loadChildren: './report/report.module#ReportModule' },
            { path: 'workflow', loadChildren: './workflow/workflow.module#WorkflowModule' },
            {
                path: 'admin', loadChildren: './super-admin/super-admin.module#SuperAdminModule',
                canActivate: [ACLGuard],
                data: { guard: '' },
                // 所有子路由有效
                canActivateChild: [ACLGuard]
            },
            { path: 'usercenter', loadChildren: './usercenter/usercenter.module#UserCenterModule' },
            { path: 'myTrain', loadChildren: './my-train/my-train.module#MyTrainModule' },
            { path: 'companyadmin', loadChildren: './company-admin/company-admin.module#CompanyAdminModule' },
            { path: 'sysfunc', loadChildren: './sys-func/sys-func.module#SysFuncModule' },
            { path: 'approval', loadChildren: './approval/approval.module#ApprovalModule' },
            // 考勤模块路由
            { path: 'attendance', loadChildren: './attendance/attendance.module#AttendanceModule' },
            // 区块链应用
            { path: 'blockchain', loadChildren: './blockchain/blockchain.module#BlockchainModule' },
            // 消息管理
            { path: 'message', loadChildren: './message/message.module#MessageModule' },
            // 账户管理
            { path: 'hrservice', loadChildren: './hrservice/hrservice.module#HrserviceModule' },
            // hr常用模板
            { path: 'hrcommonTemplate', loadChildren: './hrcommon-template/hrcommon-template.module#HrcommonTemplateModule' },
            // 合同
            { path: 'contract', loadChildren: './contract/contract.module#ContractModule' },
            // 测评
            { path: 'evaluation', loadChildren: './evaluation/evaluation.module#EvaluationModule', data: { title: '测评管理' } },
            { path: 'policy', loadChildren: './policy/policy.module#PolicyModule', data: { title: '政策补贴' } },
        ]
    },
    // passport
    {
        path: 'passport',
        loadChildren: './passport/passport.module#PassportModule'
    },
    {
        path: 'loading/:type', component: LoadingComponent

    },
    {
        path: 'storages',
        component: LayoutFullScreenComponent,
        children: [
            {
                path: 'detail/:id',
                component: BrowserDetailComponent, data: { title: '区块详情' }
            }
        ]
    },
    {
        path: 'notice/:uuid',
        component: AppNoticeComponent, data: { title: '公告详情' }
    },
    // 单页不包裹Layout
    { path: 'callback/:type', component: CallbackComponent },
    { path: '403', component: Exception403Component },
    { path: '404', component: Exception404Component },
    { path: '500', component: Exception500Component },
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
    exports: [RouterModule]
})
export class RouteRoutingModule {
}
