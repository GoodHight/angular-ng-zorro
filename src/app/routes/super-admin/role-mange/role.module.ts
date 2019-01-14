import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { RoleRoutingModule } from './role-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddComponent } from './add/add.component';
@NgModule({
  imports: [
    CommonModule,
    RoleRoutingModule,
    SharedModule
  ],
  declarations: [IndexComponent, AddComponent]
})
export class RoleModule { }
