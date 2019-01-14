 import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../service/service.module';
import { MewsRoutesModule } from './news.routing';
import { NewsComponent } from './news.component';
import { GlobalState } from '../../service/global.state';

@NgModule({
  imports: [
    SharedModule,
    ServiceModule,
    MewsRoutesModule
  ],
  declarations: [
    NewsComponent
  ],
  providers: [
    GlobalState
  ]
})

export class NewsModule {}
