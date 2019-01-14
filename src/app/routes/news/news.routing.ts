import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './news.component';

const routes: Routes =
[{
    path: '', component: NewsComponent,
    children: [
        {path: '', redirectTo: 'notice', pathMatch: 'full' },
        {path: 'notice', loadChildren: './notice/notice.module#NoticeModule', data: { title: '公告信息' } },
        {path: 'system', loadChildren: './system/system.module#SystemModule', data: { title: '制度信息' }}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MewsRoutesModule {

}
