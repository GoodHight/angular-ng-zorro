import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MessageRoutingModule } from './message-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { ServiceModule } from '../../service/service.module';

@NgModule({
  imports: [
    CommonModule,
    MessageRoutingModule,
    ServiceModule,
    SharedModule,
  ],
  declarations: [ListComponent, DetailComponent]
})
export class MessageModule { }
