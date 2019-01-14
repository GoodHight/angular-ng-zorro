import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { SysFuncComponent } from './sys-func.component';
import { SysFuncRoutingModule } from './sys-func-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SysFuncRoutingModule
  ],
  declarations: [
    SysFuncComponent
  ]
})
export class SysFuncModule { }
