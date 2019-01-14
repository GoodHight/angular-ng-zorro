import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PolicyRoutingModule } from './policy-routing.module';
import { ServiceModule } from '../../service/service.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PolicyRoutingModule,
    ServiceModule
  ],
  declarations: [IndexComponent]
})
export class PolicyModule { }
