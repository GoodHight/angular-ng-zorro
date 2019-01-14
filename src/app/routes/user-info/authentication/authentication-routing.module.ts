import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './index/index.component';
import { SecondComponent } from './second/second.component';
import { OneComponent } from './one/one.component';

const routes: Routes = [
    {path: '', component: IndexComponent , data: {title: '用户信息'}},
    {path: 'one', component: OneComponent, data: {title: '用户认证'}},
    {path: 'next', component: SecondComponent, data: {title: '用户认证'}},
    {path: 'next1', component: SecondComponent, data: {title: '用户认证'}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AuthenticationRoutingModule {

}
