
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminComponent } from './super-admin.component';
import { QualifyManageModule } from './qualify-manage/qualify-manage.module';
import { ServiceModule } from '../../service/service.module';

const COMPONENT_NOROUNT = [];
@NgModule({
    imports: [
        SharedModule,
        SuperAdminRoutingModule,
        QualifyManageModule,
        ServiceModule

    ],
    exports: [],
    declarations: [
        ...COMPONENT_NOROUNT,
        SuperAdminComponent
    ],
    providers: [],
})
export class SuperAdminModule { }
