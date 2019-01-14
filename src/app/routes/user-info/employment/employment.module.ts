import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { EmploymentRoutingModule} from './employment-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
      EmploymentRoutingModule
  ],
  declarations: [
  IndexComponent]
})

export class EmploymentModule { }
