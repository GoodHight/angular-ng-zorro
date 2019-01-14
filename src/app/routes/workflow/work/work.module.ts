import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { WorkRoutingModule } from './work-routing.module';
import　{ IndexComponent } from './index/index.component';
import { AunchComponent } from './aunch/aunch.component';
import { SortablejsModule } from 'angular-sortablejs/dist';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
      SortablejsModule,
      WorkRoutingModule
  ],
  declarations: [
      IndexComponent,
      AunchComponent,
  ]
})

export class WorkModule { }
