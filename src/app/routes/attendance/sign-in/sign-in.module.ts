import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { SignInRoutingModule } from './sign-in-routing.module';
import { IndexComponent } from './index/index.component';
import { DetalisComponent } from './detalis/detalis.component';

@NgModule({
  imports: [
    CommonModule,
    SignInRoutingModule,
    SharedModule,
    ServiceModule
  ],
  declarations: [IndexComponent, DetalisComponent]
})
export class SignInModule { }
