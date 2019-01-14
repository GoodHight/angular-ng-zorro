import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { EntryFormComponent } from './entry-form/entry-form.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  }, {
    path: 'list', component: ListComponent
  }, {
    path: 'list/add', component: AddEntryComponent
  }, {
    path: 'list/add/:guid', component: AddEntryComponent
  }, {
    path: 'list/entry-form/:guid', component: EntryFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryManagementRoutingModule { }
