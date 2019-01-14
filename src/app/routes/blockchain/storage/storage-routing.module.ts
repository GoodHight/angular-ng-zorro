

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StorageListComponent } from './list/storage-list.component';


const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: StorageListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StorageRoutingRoutingModule { }
