import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuRoutingModule } from './menu-routing.module';
import { IndexComponent } from './index/index.component';
import { SettingComponent } from './setting/setting.component';
import { AddComponent } from './add/add.component';
import { IphoneIndexComponent } from './iphone-index/iphone-index.component';
import { AppSettingComponent } from './app-setting/app-setting.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    MenuRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      IndexComponent,
      SettingComponent,
      AddComponent,
      IphoneIndexComponent,
      AppSettingComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class MenuModule { }
