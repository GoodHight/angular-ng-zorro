import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService, MenuService } from '@delon/theme';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  constructor(public settings: SettingsService, public msgSrv: NzMessageService,
    private menuSrv: MenuService) {
  }

  menuChange(item) {
    this.menuSrv.visit((i, p) => {
      if (i !== item) {
        i._open = false;
      }
    });
    let pItem = item.__parent;
    while (pItem) {
      pItem._open = true;
      pItem = pItem.__parent;
    }
    item._open = !item._open;
  }
}
