import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FuncManageRoutingModule } from './func-manage-routing.module';
import { FmIndexComponent } from './index/fm-index.component';
import { FmAddComponent } from './add/fm-add.component';

@NgModule({
  imports: [
    SharedModule,
    FuncManageRoutingModule
  ],
  declarations: [
    FmIndexComponent,
    FmAddComponent
  ]
})
export class FuncManageModule { }
