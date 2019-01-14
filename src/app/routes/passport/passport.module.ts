import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {PassportRoutesModule} from './passport.routing';
import {PassportComponent} from './passport.component';
import { UserProtocolComponent } from './user-protocol/user-protocol.component';

@NgModule({
    imports: [
        SharedModule,
        PassportRoutesModule
    ],
    declarations: [
        PassportComponent,
        UserProtocolComponent
    ]
})

export class PassportModule {
}
