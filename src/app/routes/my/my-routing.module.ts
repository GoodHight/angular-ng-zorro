import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementComponent } from './agreement/agreement.component';
import { ResumeComponent } from './resume/resume.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { TodoComponent } from './todo/todo.component';
import { CompletedComponent } from './completed/completed.component';

const routes: Routes = [
    { path: 'agreement', component: AgreementComponent },
    { path: 'resume', component: ResumeComponent },
    { path: 'attendance', component: AttendanceComponent },
    { path: 'authenticate', component: AuthenticateComponent, data: { title: '企业认证' } },
    { path: 'update-password', component: UpdatePasswordComponent },
    { path: 'updateInfo', component: UpdateInfoComponent },
    { path: 'todo', component: TodoComponent },
    { path: 'completed', component: CompletedComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyRoutingModule {
}
