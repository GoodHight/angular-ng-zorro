import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {ServiceModule} from '../../../service/service.module';
import {AuthenticationRoutingModule} from './authentication-routing.module';
import {IndexComponent} from './index/index.component';
import {SecondComponent} from './second/second.component';
import { OneComponent } from './one/one.component';

@NgModule({
    imports: [
        ServiceModule,
        SharedModule,
        AuthenticationRoutingModule
    ],
    declarations: [
        IndexComponent,
        SecondComponent,
        OneComponent,
    ]
})

export class AuthenticationModule {
}
