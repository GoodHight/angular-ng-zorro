import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EmployeeInfoRoutingModule } from './employee-info-routing.module';
import { EmployeeListComponent } from './list/employee-list.component';
import { EmployeeQueryComponent } from './query/employee-query.component';
import { EmployeeBirthdayComponent } from './birthday/employee-birthday.component';
import { EmployeeAddComponent } from './add/employee-add.component';
import { ServiceModule } from '../../../service/service.module';
import { UserComponent } from './user/user.component';
import { CommunicationComponent } from './communication/communication.component';
import { IndexComponent } from './index/index.component';
import { PositionComponent } from './position/position.component';
import { ContractComponent } from './contract/contract.component';
import { EducationComponent } from './education/education.component';
import { SocialSecurityComponent } from './social-security/social-security.component';
import { EmploymentComponent } from './employment/employment.component';
import { TitleComponent } from './title/title.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    EmployeeInfoRoutingModule,
    ServiceModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      EmployeeListComponent,
      EmployeeQueryComponent,
      EmployeeBirthdayComponent,
      EmployeeAddComponent,
      UserComponent,
      CommunicationComponent,
      IndexComponent,
      PositionComponent,
      ContractComponent,
      EducationComponent,
      SocialSecurityComponent,
      EmploymentComponent,
      TitleComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class EmployeeInfoModule { }
