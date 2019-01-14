import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
@Component({
    selector: 'app-index',
    styleUrls: ['./index.component.less'],
    templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
    tabs: any[] = [{
        key: 'menu/index',
        tab: 'PC端功能信息',
    }, {
        key: 'menu/iphone-index',
        tab: '移动端功能信息',
    }];
    editCache = {};
    public dataList = [];
    public dataListArr = [];
    public url = environment.ENTERPRISE_URL;
    public enterpriseGuid = '';
    public isVisibleMiddle = false;

    constructor(private http: HttpClient,
        private router: Router,
        public msg: NzMessageService,
        private scroll: ScrollService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    }

    public deleteGuid: any;

    /*
    * 获取菜单数据
    * */
    public getDataList() {
        this.http.get(this.url + 'service/menu/getMenus', { params: { name: this.tokenService.get().email } })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.dataList = [];
                    this.dataListArr = res.data;
                    // this.updateEditCache();
                    for (let i = 0; i < this.dataListArr.length; i++) {
                        this.dataList = [...this.dataList, {
                            guid: this.dataListArr[i].guid || '',
                            key: i,
                            edit: this.dataListArr[i].edit || false,
                            menuName: this.dataListArr[i].menuName,
                            menuAction: this.dataListArr[i].menuAction,
                            enterpriseGuid: this.dataListArr[i].enterpriseGuid,
                            menuCss: this.dataListArr[i].menuCss,
                            menuState: this.dataListArr[i].menuState + ''
                        }];
                    }
                    this.updateEditCache();
                }
            });
    }


    refreshData(enterpriseGuid: string, type: any, key: any, key1: any) {
        if (type === 0) {
            this.enterpriseGuid = enterpriseGuid;
            this.dataList = this.dataListArr[key].subMenuList;
        } else {
            this.dataList = [];
            this.dataList[0] = this.dataListArr[key].subMenuList[key1];
        }
        this.scroll.scrollToTop();
        this.updateEditCache();
    }

    /*
    * 更改菜单
    * */
    updateMenu(key: any): void {
        this.editCache[key].edit = true;
        this.editCache[key].edit = true;
    }

    /*
    * 结束编辑
    * */
    finishEdit(key: string): void {
        this.dataList.find(item => item.key === key).menuName = this.editCache[key].menuName;
        this.dataList.find(item => item.key === key).menuAction = this.editCache[key].menuAction;
        this.dataList.find(item => item.key === key).menuCss = this.editCache[key].menuCss;
        this.dataList.find(item => item.key === key).menuState = this.editCache[key].menuState;
        if (this.editCache[key].addMenu) {
        } else {
            this.http.patch(this.url + '/hrm-menu/' + this.editCache[key].guid, this.editCache[key])
                .subscribe((res: any) => {
                    if (res.code === 0) {
                        this.editCache[key].edit = false;
                    } else {
                        this.msg.error(res.message);
                    }
                });
        }
    }

    /*
    * 新增菜单
    * */
    addRow(): void {
        const i = this.dataList.length + 1;
        this.dataList = [...this.dataList, {
            key: i,
            edit: true,
            addMenu: true,
            menuName: '菜单名',
            menuAction: '菜单路径',
            enterpriseGuid: this.enterpriseGuid,
            menuCss: '图标',
            menuState: '1',
            isTemplet: '1',
        }];
        this.updateEditCache();
    }

    /*
    * 删除菜单
    * */
    deleteMenu(key: string): void {
        this.isVisibleMiddle = true;
        this.deleteGuid = key;
    }

    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        this.http.delete(this.url + '/hrm-menu/' + this.deleteGuid)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('删除成功');
                    this.getDataList();
                    this.isVisibleMiddle = false;
                } else {
                    this.msg.error(res.message);
                }
            });

    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;

    }

    updateEditCache(): void {
        this.dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    guid: item.guid || '',
                    key: item.key,
                    addMenu: item.addMenu || false,
                    edit: item.edit || false,
                    menuName: item.menuName,
                    menuAction: item.menuAction,
                    menuCss: item.menuCss,
                    enterpriseGuid: item.enterpriseGuid,
                    hrmMenuOrder: '1',
                    menuState: item.menuState + '',
                    isTemplet: item.isTemplet + ''
                };
            }
        });

    }
    to(item: any) {
        this.router.navigateByUrl(`/admin/${item}`).then();
    }

    ngOnInit(): void {
        this.getDataList();
    }

}
