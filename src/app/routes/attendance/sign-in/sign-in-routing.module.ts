import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DetalisComponent } from './detalis/detalis.component';

const routes: Routes = [{
  path: '', component: IndexComponent
},
{
  path: 'detalis/:guid', component: DetalisComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignInRoutingModule { }
