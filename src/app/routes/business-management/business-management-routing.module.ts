import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessInfoComponent } from './business-info/business-info.component';

const routes: Routes = [{ path: 'business-info', component: BusinessInfoComponent, data: { title: '账号设置' } } ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessManagementRoutingModule {
}
