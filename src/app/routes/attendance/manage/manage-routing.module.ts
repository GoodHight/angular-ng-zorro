import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountlistComponent } from './countlist/countlist.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'index', pathMatch: 'full'
},
{
  path: 'index', component: CountlistComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
