
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonInfoComponent } from './person-info.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ChangeMobilePhoneComponent } from './change-mobile-phone/change-mobile-phone.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeSecurityCodeComponent } from './change-security-code/change-security-code.component';

const routes: Routes = [
    // { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: '', component: PersonInfoComponent }, 
    { path: 'authentication', component: AuthenticationComponent }, 
    { path: 'changeMobile', component: ChangeMobilePhoneComponent },
    { path: 'changePassword', component: ChangePasswordComponent },
    { path: 'changeSecurity', component: ChangeSecurityCodeComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PersonInfoRoutingModule { }
