import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { RegisterRoutingModule } from './register-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
    RegisterRoutingModule
  ],
  declarations: [
    IndexComponent,
  ]
})

export class RegisterModule { }
