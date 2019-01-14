import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import { ScrollService } from '@delon/theme';

@Component({
  selector: 'app-iphone-index',
  templateUrl: './iphone-index.component.html',
  styleUrls: ['./iphone-index.component.less']
})
export class IphoneIndexComponent implements OnInit {
    tabs: any[] = [{
        key: 'menu/index',
        tab: '管理端功能信息',
    }, {
        key: 'menu/iphone-index',
        tab: '移动端功能信息',
    }
    ];
    editCache = {};
    public dataList = [];
    public dataListArr = [];
    public url = environment.HRM_URL + 'service';
    public enterpriseGuid = '';
    public isVisibleMiddle = false;

    constructor(private http: HttpClient,
                private router: Router,
                public msg: NzMessageService,
            private scroll: ScrollService) {
    }

    public deleteGuid: any;

    /*
    * 获取菜单数据
    * */
    public getDataList() {
        this.http.get(this.url + '/app-menu')
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataList = [];
                    this.dataListArr = res.data;
                    // this.updateEditCache();
                    // console.log(this.dataListArr);
                    for (let i = 0; i < this.dataListArr.length; i++) {
                        this.dataList = [...this.dataList, {
                            guid: this.dataListArr[i].guid || '',
                            key: i,
                            edit: this.dataListArr[i].edit || false,
                            menuName: this.dataListArr[i].menuName,
                            menuActionId: this.dataListArr[i].menuActionId,
                            enterpriseGuid: this.dataListArr[i].enterpriseGuid,
                            menuCss: this.dataListArr[i].menuCss,
                            menuState: this.dataListArr[i].menuState + ''
                        }];
                    }
                    // console.log(this.dataList);
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
        this.dataList.find(item => item.key === key).menuActionId = this.editCache[key].menuActionId;
        this.dataList.find(item => item.key === key).menuCss = this.editCache[key].menuCss;
        this.dataList.find(item => item.key === key).menuState = this.editCache[key].menuState;
        if (this.editCache[key].addMenu) {
        } else {
            this.http.patch(this.url + '/app-menu/' + this.editCache[key].guid, this.editCache[key])
                .subscribe((res: any) => {
                    if (res.code === 1) {
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
            menuActionId: '菜单路径',
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
        this.deleteGuid = this.editCache[key].guid;
    }

    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        this.http.delete(this.url + '/app-menu/' + this.deleteGuid)
            .subscribe((res: any) => {
                if (res.code === 1) {
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
                    menuActionId: item.menuActionId,
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
