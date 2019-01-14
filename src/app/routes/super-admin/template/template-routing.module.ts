import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AppIndexComponent } from './app-index/app-index.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
   { path: '', redirectTo: 'index/0/0'},
   { path: 'index/:guid/:versionName', component: IndexComponent},
   { path: 'add/:guid/:guid/', component: AddComponent},
   { path: 'app-index/:guid/:versionName', component: AppIndexComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
