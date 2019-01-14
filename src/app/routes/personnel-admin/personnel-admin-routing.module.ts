import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeInfoModule } from './employee-info/employee-info.module';
import { DefaultComponent } from './default/default.component';

const routes: Routes = [{
    path: 'employee-info', component: EmployeeInfoModule
}, {
    path: 'entry-management', component: DefaultComponent
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PersonnelAdminRoutingModule {
}
