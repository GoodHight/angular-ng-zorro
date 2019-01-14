

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { QualifyManageRoutingModule } from './qualify-manage.routing.module';
import { QualifyManageListComponent } from './list/qualify-manage-list.component';
import { QualifyManageDetailComponent } from './detail/qualify-manage-detail.component';
import { ServiceModule } from '../../../service/service.module';


@NgModule({
    imports: [
        SharedModule,
        QualifyManageRoutingModule,
        ServiceModule
    ],
    exports: [],
    declarations: [
        QualifyManageListComponent,
        QualifyManageDetailComponent,
    ],
    providers: [],
})
export class QualifyManageModule { }
