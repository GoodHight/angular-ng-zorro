import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import { ServiceModule } from '../../service/service.module';
import { HrcommonTemplateRoutingModule } from './hrcommon-template-routing.module';
import { PersonPlanComponent } from './person-plan/person-plan.component';
import { RecruitConfigureComponent } from './recruit-configure/recruit-configure.component';
import { TrainDevelopmentComponent } from './train-development/train-development.component';
import { AchievmentsComponent } from './achievments/achievments.component';
import { PayComponent } from './pay/pay.component';
import { LabourRelationsComponent } from './labour-relations/labour-relations.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ServiceModule,
    HrcommonTemplateRoutingModule
  ],
  declarations: [PersonPlanComponent, RecruitConfigureComponent, TrainDevelopmentComponent, AchievmentsComponent, PayComponent, LabourRelationsComponent]
})
export class HrcommonTemplateModule { }
