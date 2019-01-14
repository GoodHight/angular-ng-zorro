import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {PersonnelAdminRoutingModule} from './personnel-admin-routing.module';
import {DefaultComponent} from './default/default.component';

const COMPONENT_NOROUNT = [];

@NgModule({
    imports: [
        SharedModule,
        PersonnelAdminRoutingModule
    ],
    declarations: [
        ...COMPONENT_NOROUNT,
        DefaultComponent,
    ],
    entryComponents: COMPONENT_NOROUNT
})
export class PersonnelAdminModule {
}
