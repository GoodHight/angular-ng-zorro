import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { JianliComponent } from './jianli/jianli.component';
import { LuyongComponent } from './luyong/luyong.component';
import { LuyongglComponent } from './luyonggl/luyonggl.component';
import { SendofferComponent } from './luyonggl/sendoffer/sendoffer.component';
import { LookofferComponent } from './luyonggl/lookoffer/lookoffer.component';
import { MianshiComponent } from './mianshi/mianshi.component';
import { AlreadyinterviewComponent } from './mianshi/alreadyinterview/alreadyinterview.component';
import { NotificationTempalteComponent } from './notification-tempalte/notification-tempalte.component';
import { EmailDetailComponent } from './notification-tempalte/email-detail/email-detail.component';
import { MessageDetailComponent } from './notification-tempalte/message-detail/message-detail.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { AddComponent } from './jianli/add/add.component';
import { AlreadyResumeComponent } from './jianli/already-resume/already-resume.component';
import { DetailsComponent } from './jianli/details/details.component';
import { RecommendComponent } from './jianli/recommend/recommend.component';
import { NoticeComponent } from './jianli/notice/notice.component';
import { EmployComponent } from './jianli/employ/employ.component';
import { SetComponent } from './set/set.component';
import { EmailSetComponent } from './set/email-set/email-set.component';
import { InterviewMessageComponent } from './jianli/interview-message/interview-message.component';

import { PublishAgainComponent } from './jianli/publish-again/publish-again.component';
import { HandleEmploymentComponent } from './luyonggl/handle-employment/handle-employment.component';
const routes: Routes =
    [{
        path: '', component: IndexComponent,
        children: [
            { path: '', redirectTo: 'resume' },
            { path: 'resume', component: JianliComponent },
            { path: 'resume/alreadyresume', component: AlreadyResumeComponent, data: { title: '简历管理' } },
            { path: 'hire', component: LuyongComponent },
            { path: 'hire-manage', component: LuyongglComponent },
            { path: 'interview', component: MianshiComponent },
            { path: 'interview/alreadyinterview', component: AlreadyinterviewComponent },
            { path: 'personnel', component: PersonnelComponent },
            { path: 'notification', component: NotificationTempalteComponent },
        ]
    },
    {
        path: 'set', component: SetComponent,
        children: [
            { path: '', redirectTo: 'index' },
            // {path: 'index', component: SetIndexComponent},
            { path: 'email', component: EmailSetComponent },
        ]
    },
    { path: 'resume/add', component: AddComponent, data: { title: '上传简历' } },
    { path: 'resume/interview/:guid', component: InterviewMessageComponent },
    { path: 'resume/recommend/:guid', component: RecommendComponent, data: { title: '简历推荐' } },
    { path: 'resume/recommendagain/:guid', component: PublishAgainComponent, data: { title: '重新推荐' } },
    { path: 'resume/notice/:guid/:entry', component: NoticeComponent, data: { title: '面试通知' } },
    { path: 'resume/employ/:guid/:resumeId', component: EmployComponent, data: { title: '录用审批' } },
    { path: 'resume/details/:guid', component: DetailsComponent, data: { title: '简历详情' } },
    /* 面試路由 */
    { path: 'interview/details/:guid', component: DetailsComponent },
    { path: 'interview/notice/:guid/:entry', component: NoticeComponent },
    { path: 'interview/employ/:guid/:resumeId', component: EmployComponent },
    /* 人才庫 */
    { path: 'personnel/details/:guid', component: DetailsComponent },
    { path: 'personnel/notice/:guid/:entry', component: NoticeComponent },
    { path: 'personnel/employ/:guid/:resumeId', component: EmployComponent },
    { path: 'personnel/recommend/:guid', component: RecommendComponent },
    /* 录用管理 */
    { path: 'hire-manage/details/:guid', component: DetailsComponent },
    { path: 'hire-manage/sendoffer/:guid', component: SendofferComponent },
    { path: 'hire-manage/lookoffer/:resumeId', component: LookofferComponent },
    { path: 'hire-manage/handaleemployment/:guid', component: HandleEmploymentComponent },
    { path: 'set', component: SetComponent },
    { path: 'set/email', component: EmailSetComponent },
    /* 招聘-模板-板块  templateType：1是短信，2是邮件，action:edit编辑,watch查看,new新增*/
    { path: 'notification/emailDetail/:guid/:category/:templateType/:action', component: EmailDetailComponent, data: { title: '新增邮件模板' } },
    // {path: 'notification/emailDetail', component: EmailDetailComponent},
    { path: 'notification/messageDetail/:guid/:category/:templateType/:action', component: MessageDetailComponent, data: { title: '新增短信模板' } },
    ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RecruitRoutingModule {
}
