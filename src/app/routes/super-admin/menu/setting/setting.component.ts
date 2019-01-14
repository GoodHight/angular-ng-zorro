import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
})
export class SettingComponent implements OnInit {

    public dataList = [];
    public dataLists: any[];
    // public dataListChild: any[];
    public url = environment.HRM_URL + 'service';
    public guid: any;
    public type = '0';
    public editCache = [];
    public indeterminate = false;

    isTemplate = '0';
    constructor(
        private http: HttpClient,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {

    }

    tabs: any[] = [];

    /**
     * 得到详情
     * @param guid 
     */
    private getDetail(guid) {
        this.http.get(this.url + '/hrm-role/' + this.guid)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.isTemplate = res.data.isTemplate;
                }
            });
    }
    /*
    * 获取当前角色的功能列表
    * */
    public getDataList() {
        this.http.get(this.url + '/hrm-role/menus/' + this.guid)
            // this.http.get(this.url + '/hrm-menu')
            .subscribe((res: any) => {
                if (res.code === 1) {
                    res.data.forEach(data => {
                        this.dataList.push(data.guid);
                    });
                    // this.dataListChild = res.data;
                    // this.refreshStatus();
                }
            });
    }

    /*
    * 获取全部功能列表
    * */
    public getListDatas() {
        this.http.get(this.url + '/hrm-template-menu/enterpriseId/' + this.tokenService.get().enterprisesInfo.enterprisesId)
            .subscribe((res: any) => {
                if (res.code === 1) {

                    this.dataLists = res.data;

                    // this.dataListChild = res.data;
                    this.refreshStatus();
                }
            });

    }

    /*
    * 重组数据
    * */
    public refreshStatus() {

        this.dataLists.forEach((datas, index) => {
            if (this.dataList.includes(datas.guid)) {
                datas.isDefault = true;
                this.editCache.push(datas.guid);
            } else {
                datas.isDefault = false;
            }
            if (datas.subMenuList.length > 0) {
                let selectedNums = 0;
                datas.subMenuList.forEach(data => {
                    if (this.dataList.includes(data.guid)) {
                        selectedNums ++;
                        data.isDefault = true;
                    } else {
                        datas.isDefault = false;
                    }
                });
                if (selectedNums > 0 && selectedNums < datas.subMenuList.length) {
                    datas.indeterminate = true;
                } else {
                    datas.indeterminate = false;
                }
            }
        });
    }

    /*
    * 当前整行的全选
    * */
    checkAll(key: any, guid: any, value: boolean, parentKey: any) {

        if (key === '999') {
            if (!value) {
                const parentId = this.dataLists[parentKey].guid;
                /*删除上级节点*/
                for (let i = 0; i < this.editCache.length; i++) {
                    if (parentId === this.editCache[i]) {
                        this.editCache.splice(i, 1);
                    }
                    if (guid === this.editCache[i]) {
                        this.editCache.splice(i, 1);
                    }
                }
            } else {
                let statae = true;
                this.dataLists[parentKey].subMenuList.forEach(data => {
                    if (!data.isDefault) {
                        statae = !value;
                        return;
                    }
                });
                if (statae) {
                    this.editCache.push(this.dataLists[parentKey].guid);
                    this.dataLists[parentKey].isDefault = value;
                }
                this.editCache.push(guid);
            }
            let selectedNums = 0;
            this.dataLists[parentKey].subMenuList.forEach((submenu) => {
                if (submenu.isDefault) {
                    selectedNums ++;
                }
            });
            if (selectedNums > 0 ) {
                this.dataLists[parentKey].isDefault = true;
            } else {
                this.dataLists[parentKey].isDefault = false;
            }
            if (selectedNums && selectedNums !== this.dataLists[parentKey].subMenuList.length) {
                this.dataLists[parentKey].indeterminate = true;
            } else {
                this.dataLists[parentKey].indeterminate = false;
            }
        } else {
            if (!value) {
                this.dataLists[key].isDefault = value;
                this.dataLists[key].subMenuList.forEach((data, idx) => {
                    data.isDefault = value;
                });
            } else {
                this.editCache.push(guid);
                this.dataLists[key].isDefault = value;
                this.dataLists[key].subMenuList.forEach(datas => {
                    datas.isDefault = value;
                });
            }
            this.dataLists[key].indeterminate = false;
        }
    }

    /*
    * 保存授权
    * */
    submit() {
        const selectedMenus = [];
        this.dataLists.forEach((menu) => {
            if (menu.isDefault) {
                selectedMenus.push(menu.guid);
            }
            if (menu.subMenuList.length > 0) {
                menu.subMenuList.forEach((submenu) => {
                    if (submenu.isDefault) {
                        selectedMenus.push(submenu.guid);
                    }
                });
            }
        });
        this.http.post(this.url + '/hrm-role/add-auth/' + this.guid, selectedMenus)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.router.navigate(['/companyadmin/role']);
                }
            });
    }
    to(item: any) {
        this.router.navigateByUrl(`/admin/${item}`).then();
    }

    ngOnInit() {
        this.activatedRoute.params
            .subscribe((params: Params) => {
                this.guid = params['guid'];
                this.type = params['type'];
            });
        this.tabs = [{
            key: 'menu/setting/' + this.guid + '/0',
            tab: 'PC端权限分配',
        }, {
            key: 'menu/app-setting/' + this.guid + '/1',
            tab: 'APP端权限分配',
        }];
        this.getDataList();
        this.getListDatas();
        this.getDetail(this.guid);
    }

}
