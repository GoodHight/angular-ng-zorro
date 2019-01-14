

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { VersionManageRoutingRoutingModule } from './version-manage-routing.module';
import { VersionIndexComponent } from './index/version-index.component';
import { ServiceModule } from '../../../service/service.module';
import { VersionAddEditComponent } from './add-edit/version-add-edit.component';


@NgModule({
    imports: [
        SharedModule,
        VersionManageRoutingRoutingModule,
        ServiceModule
    ],
    exports: [],
    declarations: [
        VersionIndexComponent,
        VersionAddEditComponent
    ],
    providers: [],
})
export class VersionManageModule { }
