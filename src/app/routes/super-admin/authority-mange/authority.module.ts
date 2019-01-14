import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import {AuthorityMangeRoutingModule} from './authority-routing.module';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    AuthorityMangeRoutingModule,
    SharedModule
  ],
  declarations: [IndexComponent]
})
export class AuthorityModule { }
