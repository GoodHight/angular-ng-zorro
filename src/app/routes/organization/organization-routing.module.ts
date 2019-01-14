import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DutySystemComponent} from './duty-system/duty-system.component';

const routes: Routes = [{path: 'duty-system', component: DutySystemComponent}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
