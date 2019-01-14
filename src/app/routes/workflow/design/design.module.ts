import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { DesignRoutingModule} from './design-routing.module';
import { IndexComponent } from './index/index.component';
import { DetailsComponent } from './details/details.component';
import { UpdateComponent } from './update/update.component';
import { SortablejsModule } from 'angular-sortablejs/dist';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
      SortablejsModule,
      DesignRoutingModule
  ],
  declarations: [
      IndexComponent,
      UpdateComponent,
      DetailsComponent,
  ]
})

export class DesignModule { }
