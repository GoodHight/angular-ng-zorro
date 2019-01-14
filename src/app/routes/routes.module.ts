import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../service/service.module';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { LoadingComponent } from './loading/loading.component';
import { BrowserDetailComponent } from './blockchain/storage/detail/browser-detail.component';
import { AppNoticeComponent } from './app-notice/app-notice.component';


@NgModule({
    imports: [ SharedModule, RouteRoutingModule, ServiceModule ],
    declarations: [
        DashboardV1Component,
        CallbackComponent,
        Exception403Component,
        Exception404Component,
        Exception500Component,
        LoadingComponent,
        BrowserDetailComponent,
        AppNoticeComponent,
    ]
})

export class RoutesModule {}
