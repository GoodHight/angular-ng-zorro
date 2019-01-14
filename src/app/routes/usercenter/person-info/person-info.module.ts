import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PersonInfoComponent } from './person-info.component';
import { PersonInfoRoutingModule } from './person-info-routing.module';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ServiceModule } from '../../../service/service.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeSecurityCodeComponent } from './change-security-code/change-security-code.component';
import { ChangeMobilePhoneComponent } from './change-mobile-phone/change-mobile-phone.component';


const COMPONENT_NOROUNT = [
];

@NgModule({
  imports: [
    SharedModule,
    PersonInfoRoutingModule,
    ServiceModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      PersonInfoComponent,
      AuthenticationComponent,
      ChangePasswordComponent,
      ChangeSecurityCodeComponent,
      ChangeMobilePhoneComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class PersonInfoModule { }
