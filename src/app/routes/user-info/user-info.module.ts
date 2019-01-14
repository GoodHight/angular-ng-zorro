import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserInfoRoutingModule } from './user-info-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    CommonModule,
    UserInfoRoutingModule
  ],
  declarations: [IndexComponent ]
})
export class UserInfoModule { }
