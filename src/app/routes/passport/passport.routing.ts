import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassportComponent } from './passport.component';
import { UserProtocolComponent } from './user-protocol/user-protocol.component';

const routes: Routes =
    [{
        path: '', component: PassportComponent,
        children: [
            {path: 'login', loadChildren: './login/login.module#LoginModule',  data: {title: '登录' }},
            { path: 'login/:type', loadChildren: './login/login.module#LoginModule', data: { title: '登录' } },
            // { path: 'relogin/:type', loadChildren: './login/login.module#LoginModule', data: { title: '登录' } },
            { path: 'register/:id', loadChildren: './register/register.module#RegisterModule' },
            { path: 'forget-password/:id', loadChildren: './forget-password/forget.module#ForgetModule' },
        ]
    },
    {
        path: 'protocol', component: UserProtocolComponent,
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PassportRoutesModule {

}
