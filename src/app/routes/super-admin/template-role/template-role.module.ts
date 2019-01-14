

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TemplateRoleRoutingModule } from './template-role-routing.module';
import { ServiceModule } from '../../../service/service.module';
import { TrIndexComponent } from './index/tr-index.component';
import { TrAddEditComponent } from './add-edit/tr-add-edit.component';


@NgModule({
    imports: [
        SharedModule,
        TemplateRoleRoutingModule,
        ServiceModule
    ],
    exports: [],
    declarations: [
        TrIndexComponent,
        TrAddEditComponent
    ],
    providers: [],
})
export class TemplateRoleModule { }
