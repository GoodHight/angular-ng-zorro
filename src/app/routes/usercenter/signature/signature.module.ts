

import { NgModule } from '@angular/core';

import { SignatureComponent } from './signature.component';
import { SharedModule } from '@shared/shared.module';
import { SignatureRoutingModule } from './signature-routing.module';
import { SignatureAddEditComponent } from './signature-add-edit/signature-add-edit.component';

@NgModule({
    imports: [
        SharedModule,
        SignatureRoutingModule
    ],
    exports: [],
    declarations: [
        SignatureComponent,
        SignatureAddEditComponent
    ],
    providers: [],
})
export class SignatureModule { }
