import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { CountRoutingModule } from './count-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    CommonModule,
    CountRoutingModule,
    SharedModule,
    ServiceModule
  ],
  declarations: [IndexComponent]
})
export class CountModule { }
