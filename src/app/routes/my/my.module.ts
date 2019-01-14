import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MyRoutingModule } from './my-routing.module';
import { ResumeComponent } from './resume/resume.component';
import { AgreementComponent } from './agreement/agreement.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { TodoComponent } from './todo/todo.component';
import { CompletedComponent } from './completed/completed.component';


const COMPONENT_NOROUNT = [  ];

@NgModule({
  imports: [
    SharedModule,
    MyRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      ResumeComponent,
      AgreementComponent,
      AttendanceComponent,
      AuthenticateComponent,
      UpdatePasswordComponent,
      UpdateInfoComponent,
      TodoComponent,
      CompletedComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class MyModule { }
