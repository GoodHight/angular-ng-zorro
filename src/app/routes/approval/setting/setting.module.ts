import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { IndexComponent } from './index/index.component';
import { SettingRoutingModule } from './setting-routing.module';
@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule,
    ServiceModule
  ],
  declarations: [IndexComponent]
})
export class SettingModule { }
