

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QualifyManageListComponent } from './list/qualify-manage-list.component';
import { QualifyManageDetailComponent } from './detail/qualify-manage-detail.component';


const routes: Routes = [
    {
        path: '', redirectTo: 'index', pathMatch: 'full'
    },
    {
        path: 'index', component: QualifyManageListComponent
    }, {
        path: 'detail/:guid', component: QualifyManageDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QualifyManageRoutingModule { }
