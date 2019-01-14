

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SysRoleRoutingModule } from './sys-role-routing.module';
import { SrIndexComponent } from './index/sr-index.component';
import { SrAddComponent } from './add/sr-add.component';
import { SrAuthorizationComponent } from './authorization/sr-authorization.component';


@NgModule({
    imports: [
        SharedModule,
        SysRoleRoutingModule
    ],
    exports: [],
    declarations: [
        SrIndexComponent,
        SrAddComponent,
        SrAuthorizationComponent
    ],
    providers: [],
})
export class SysRoleModule { }
