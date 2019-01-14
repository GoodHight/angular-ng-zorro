import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { LoginRoutingModule} from './login-routing.module';
import　{ IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
      LoginRoutingModule
  ],
  declarations: [
      IndexComponent,
  ]
})

export class LoginModule { }
