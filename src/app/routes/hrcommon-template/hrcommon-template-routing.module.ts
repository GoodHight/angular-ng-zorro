import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonPlanComponent } from './person-plan/person-plan.component';
import { RecruitConfigureComponent } from './recruit-configure/recruit-configure.component';
import { TrainDevelopmentComponent } from './train-development/train-development.component';
import { AchievmentsComponent } from './achievments/achievments.component';
import { PayComponent } from './pay/pay.component';
import { LabourRelationsComponent } from './labour-relations/labour-relations.component';
const routes: Routes = [
  {
      path: 'person-plan', component: PersonPlanComponent
  }, {
      path: 'recruit-configure', component: RecruitConfigureComponent
  }, {
      path: 'train-development', component: TrainDevelopmentComponent
  }, {
      path: 'achievments', component: AchievmentsComponent
  }, {
      path: 'pay', component: PayComponent
  }, {
      path: 'labour-relations', component: LabourRelationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrcommonTemplateRoutingModule { }
