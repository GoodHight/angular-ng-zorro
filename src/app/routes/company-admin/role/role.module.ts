import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoleRoutingModule } from './role-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { DetailsComponent } from './details/details.component';
import { SettingComponent } from './setting/setting.component';
import { AppSettingComponent } from './app-setting/app-setting.component';
import { AppIndexComponent } from './app-index/app-index.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    RoleRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      IndexComponent,
      AddComponent,
      DetailsComponent,
      SettingComponent,
      AppSettingComponent,
      AppIndexComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class RoleModule { }
