

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTrainListComponent } from './list/my-train-list.component';
import { MyTrainAddComponent } from './add/my-train-add.component';
import { ApprovalComponent } from './approval/approval.component';


const routes: Routes = [
    { path: '', redirectTo: 'issue', pathMatch: 'full' },
    { path: 'issue', component: MyTrainListComponent, data: { title: '我的班级'} },
    { path: 'issue/add', component: MyTrainAddComponent , data: { title: '加入班级'}},
    { path: 'approval', component: ApprovalComponent , data: { title: '证书签发'}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyTrainRoutingModule { }
