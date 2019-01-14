import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DictionaryManagementComponent} from './dictionary-management/dictionary-management.component';

const routes: Routes = [{path: 'dictionary-management', component: DictionaryManagementComponent}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DictionaryRoutingModule {
}
