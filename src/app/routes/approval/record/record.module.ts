import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ServiceModule } from '../../../service/service.module';
import { IndexComponent } from './index/index.component';
import { RecordRoutingModule } from './record-routing.module';
import { DetailsComponent } from './details/details.component';

@NgModule({
  imports: [
    CommonModule,
    RecordRoutingModule,
    SharedModule,
    ServiceModule
  ],
  declarations: [IndexComponent, DetailsComponent]
})
export class RecordModule { }
