import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { ForgetRoutingModule } from './forget-routing.module';
import　{ IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
      ForgetRoutingModule
  ],
  declarations: [
      IndexComponent,
  ]
})

export class ForgetModule { }
