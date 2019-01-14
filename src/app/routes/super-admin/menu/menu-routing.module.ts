import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './index/index.component';
import { SettingComponent } from './setting/setting.component';
import { AddComponent } from './add/add.component';
import { IphoneIndexComponent } from './iphone-index/iphone-index.component';
import { AppSettingComponent } from './app-setting/app-setting.component';

const routes: Routes = [
    {path: '', redirectTo: 'index'},
    {path: 'index', component: IndexComponent},
    {path: 'iphone-index', component: IphoneIndexComponent},
    {path: 'setting/:guid/:type', component: SettingComponent},
    {path: 'app-setting/:guid/:type', component: AppSettingComponent},
    {path: 'add/:guid/:type', component: AddComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MenuRoutingModule {
}
