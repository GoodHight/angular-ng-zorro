import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { SystemRoutesModule } from './system-routing.module';
import { SystemIndexComponent } from './index/index.component';
import { SystemEditComponent } from './edit/edit.component';
import { SystemDetailComponent } from './detail/detail.component';


@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
    SystemRoutesModule,
  ],
  declarations: [
    SystemIndexComponent,
    SystemEditComponent,
    SystemDetailComponent
  ]
})

export class SystemModule { }
