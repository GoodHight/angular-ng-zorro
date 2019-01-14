
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserCenterRoutingModule } from './usercenter-routing.module';


@NgModule({
    imports: [
        SharedModule,
        UserCenterRoutingModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class UserCenterModule { }
