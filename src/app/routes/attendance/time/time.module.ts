import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { TimeRoutingModule } from './time-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    CommonModule,
    TimeRoutingModule,
    SharedModule,
    ServiceModule
  ],
  declarations: [IndexComponent]
})
export class TimeModule { }
