import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { NoticeRoutesModule } from './notice-routing.module';
import { NoticeIndexComponent } from './index/index.component';
import { NoticeEditComponent } from './edit/edit.component';
import { NoticeDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
    NoticeRoutesModule
  ],
  declarations: [
    NoticeIndexComponent,
    NoticeEditComponent,
    NoticeDetailComponent
  ]
})

export class NoticeModule { }
