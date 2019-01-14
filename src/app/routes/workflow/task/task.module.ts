import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { TaskRoutingModule} from './task-routing.module';
import　{ IndexComponent } from './index/index.component';
import { SortablejsModule } from 'angular-sortablejs/dist';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
      SortablejsModule,
      TaskRoutingModule
  ],
  declarations: [
      IndexComponent,
  ]
})

export class TaskModule { }
