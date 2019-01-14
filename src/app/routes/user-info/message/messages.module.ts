import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { MessageRoutingModule} from './messages-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    ServiceModule,
    SharedModule,
      MessageRoutingModule
  ],
  declarations: [
  IndexComponent]
})

export class MessagesModule { }
