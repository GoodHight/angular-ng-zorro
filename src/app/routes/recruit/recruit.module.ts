import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RecruitRoutingModule } from './recruit-routing.module';
import { JianliComponent } from './jianli/jianli.component';
import { MianshiComponent } from './mianshi/mianshi.component';
import { LuyongComponent } from './luyong/luyong.component';
import { LuyongglComponent } from './luyonggl/luyonggl.component';
import {SendofferComponent} from './luyonggl/sendoffer/sendoffer.component';
import {LookofferComponent} from './luyonggl/lookoffer/lookoffer.component';
import { IndexComponent } from './index/index.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { AddComponent } from './jianli/add/add.component';
import { DetailsComponent } from './jianli/details/details.component';
import { RecommendComponent } from './jianli/recommend/recommend.component';
import { NoticeComponent } from './jianli/notice/notice.component';
import { EmployComponent } from './jianli/employ/employ.component';
import { SetComponent } from './set/set.component';
import { EmailSetComponent } from './set/email-set/email-set.component';
import { SetIndexComponent } from './set/set-index/set-index.component';
import { AlreadyResumeComponent } from './jianli/already-resume/already-resume.component';
import { InterviewMessageComponent } from './jianli/interview-message/interview-message.component';
import { ServiceModule } from '../../service/service.module';
// include custom component
import { PublishAgainComponent } from './jianli/publish-again/publish-again.component';
import { NotificationTempalteComponent } from './notification-tempalte/notification-tempalte.component';
import { EmailDetailComponent } from './notification-tempalte/email-detail/email-detail.component';
import { MessageDetailComponent } from './notification-tempalte/message-detail/message-detail.component';
import { AlreadyinterviewComponent } from './mianshi/alreadyinterview/alreadyinterview.component';
import { HandleEmploymentComponent } from './luyonggl/handle-employment/handle-employment.component';
const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    RecruitRoutingModule,
    ServiceModule,
  ],
  declarations: [
      JianliComponent,
      MianshiComponent,
      LuyongComponent,
      LuyongglComponent,
      IndexComponent,
      PersonnelComponent,
      AddComponent,
      DetailsComponent,
      RecommendComponent,
      NoticeComponent,
      EmployComponent,
      SetComponent,
      EmailSetComponent,
      SetIndexComponent,
      AlreadyResumeComponent,
      InterviewMessageComponent,
      PublishAgainComponent,
      SendofferComponent,
      LookofferComponent,
      NotificationTempalteComponent,
      EmailDetailComponent,
      MessageDetailComponent,
      AlreadyinterviewComponent,
      HandleEmploymentComponent,
  ],
})
export class RecruitModule { }
