import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {AddComponent} from './add/add.component';
import { DetailsComponent } from './details/details.component';
import { SettingComponent } from './setting/setting.component';
import { AppSettingComponent } from './app-setting/app-setting.component';
import { AppIndexComponent } from './app-index/app-index.component';

const routes: Routes = [
    {path: '', component: IndexComponent},
    {path: 'app-index', component: AppIndexComponent},
    {path: 'add/:guid', component: AddComponent, data: { title: '新增'}},
    {path: 'details/:guid', component: DetailsComponent, data: { title: '详情'}},
    {path: 'setting/:guid', component: SettingComponent, data: { title: '设置'}},
    {path: 'app-setting/:guid', component: AppSettingComponent, data: { title: '设置'}},
    ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleRoutingModule {
}
