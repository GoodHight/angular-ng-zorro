import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HrserviceRoutingModule } from './hrservice-routing.module';
import { IndexComponent } from './index/index.component';
import { BuildComponent } from './build/build.component';
import { WelfareComponent } from './welfare/welfare.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { VersionComponent } from './version/version.component';
import { OrderComponent } from './order/order.component';
import { OrdercreateComponent } from './ordercreate/ordercreate.component';
import { OrderpayComponent } from './orderpay/orderpay.component';
import { PaypageComponent } from './paypage/paypage.component';
import { ServiceModule } from '../../service/service.module';
import { OrderdetailComponent } from './orderdetail/orderdetail.component';
import { AccountComponent } from './account/account.component';
import { AccPayDetalisComponent } from './acc-pay-detalis/acc-pay-detalis.component';


const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    HrserviceRoutingModule,
    ServiceModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      IndexComponent,
      BuildComponent,
      WelfareComponent,
      PersonnelComponent,
      VersionComponent,
      OrderComponent,
      OrdercreateComponent,
      OrderpayComponent,
      PaypageComponent,
      OrderdetailComponent,
      AccountComponent,
      AccPayDetalisComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class HrserviceModule { }
