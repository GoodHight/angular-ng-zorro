

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuRoleTagRoutingModule } from './menu-role-tag-routing.module';
import { MrtIndexComponent } from './index/mrt-index.component';


@NgModule({
    imports: [
        SharedModule,
        MenuRoleTagRoutingModule
    ],
    exports: [],
    declarations: [
        MrtIndexComponent
    ],
    providers: [],
})
export class MenuRoleTagModule { }
