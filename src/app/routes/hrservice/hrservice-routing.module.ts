import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { BuildComponent } from './build/build.component';
import { WelfareComponent } from './welfare/welfare.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { VersionComponent } from './version/version.component';
import { OrderComponent } from './order/order.component';
import { OrdercreateComponent } from './ordercreate/ordercreate.component';
import { OrderpayComponent } from './orderpay/orderpay.component';
import { PaypageComponent } from './paypage/paypage.component';
import { OrderdetailComponent } from './orderdetail/orderdetail.component';
import { AccountComponent } from './account/account.component';
import { AccPayDetalisComponent } from './acc-pay-detalis/acc-pay-detalis.component';



const routes: Routes = [
    { path: '', redirectTo: 'version', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'build', component: BuildComponent },
    { path: 'account', component: AccountComponent, data: { title: '账户中心' } },
    { path: 'welfare', component: WelfareComponent },
    { path: 'personnel', component: PersonnelComponent },
    { path: 'version', component: OrderComponent, data: { title: '' } },
    { path: 'order', component: VersionComponent, data: { title: '版本套餐' } },
    { path: 'version/ordercreate/:id', component: OrdercreateComponent, data: { title: '创建订单' } },
    { path: 'version/orderpay/:id', component: OrderpayComponent, data: { title: '订单支付' } },
    { path: 'version/paypage/:form', component: PaypageComponent },
    { path: 'version/orderdetail/:guid', component: OrderdetailComponent, data: { title: '订单详情' } },
    { path: 'account/orderpay/:id', component: AccPayDetalisComponent, data: { title: '订单支付' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HrserviceRoutingModule {
}
