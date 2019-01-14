import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { EducationRoutingModule} from './education-routing.module';
import　{ IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
      EducationRoutingModule
  ],
  declarations: [
      IndexComponent,
  ]
})

export class EducationModule { }
