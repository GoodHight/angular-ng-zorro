import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {environment} from '@env/environment';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-index',
    styleUrls: ['./index.component.less'],
    templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
    isCollapsed = false;

    editCache = [];
    /*
    * 一级菜单存放区
    * */
    menuIds = [];
    /*
    * 二级菜单存放区
    * */
    subMenuIds = [];
    public dataList = [];
    /**
     * 全部功能列表
     */
    public dataLists = [];
    /**
     * 左侧体验、普通..列表
     */
    public dataListArr = [];
    active = 0;
    public versionName = '';
    public url = environment.HRM_URL + 'service';
    public frameWorkurl = environment.FRAMEWORK_URL + 'service';
    public enterpriseGuid = '';
    public isVisibleMiddle = false;
    public menuPart = 'PC_MENU_ALL';
    public menuPartCode = '0';
    /*
    * 菜单guid
    * */
    guid = '';

    constructor(private http: HttpClient,
                private router: Router,
                public msg: NzMessageService, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params
            .subscribe((params: Params) => {
                return this.guid = params['guid'];
            });
    }

    public deleteGuid: any;
    tabs = [];

    /*
* 获取菜单数据
* */
    public getTemplateDataList(client: string) {
        this.http.get(this.frameWorkurl + '/version/list').subscribe((res: any) => {
            if (res.code === 1) {
                res.data.forEach(value => {
                    if (value.guid === this.guid) {
                        this.versionName = value.versionName;
                    }
                });
                this.tabs = [{
                    key: 'template/index/' + this.guid + '/' + this.versionName,
                    tab: '管理端模板功能(' + this.versionName + ')',
                }, {
                    key: 'template/app-index/'  + this.guid +  '/' + this.versionName,
                    tab: '移动端模板功能(' + this.versionName + ')',
                }];
                this.getDatas();
            }
        });
    }

    /*
    * 获取对应功能列表
    * */
    public getListDatas() {
        this.http.get(this.url + '/hrm-template-menu/' + this.guid)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataList = [];
                    res.data.forEach(data => {
                        this.dataList.push(data.guid);
                        // if (data.subMenuList.length > 0) {
                        //     for (let a = 0; a < data.subMenuList.length; a++) {
                        //         this.dataList.push(data.subMenuList[a].guid);
                        //     }
                        // }
                    });
                    this.refreshStatus();
                }
            });

    }

    /*
   * 获取全部功能列表
   * */
    public getDatas() {
        this.http.get(this.url + '/hrm-menu')
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataLists = res.data;
                    // this.refreshStatus();
                    this.getListDatas();
                }
            });

    }

    refreshData(menuPart: string, type: any, menuPartCode: any) {
        this.menuPart = menuPart;
        this.menuPartCode = menuPartCode;
        this.getListDatas();
    }

    /*
       * 重组数据
       * */
    public refreshStatus() {
        this.editCache = [];
        this.menuIds = [];
        this.dataLists.forEach((datas, index) => {
            if (this.dataList.includes(datas.guid)) {
                datas.isDefault = true;
                this.menuIds.push(datas.guid);
            } else {
                datas.isDefault = false;
            }
            /** 被选中的子项数量 */
            let selectedSubItemNum = 0;
            if (datas.subMenuList.length > 0) {
                datas.subMenuList.forEach(data => {
                    if (this.dataList.includes(data.guid)) {
                        data.isDefault = true;
                        selectedSubItemNum++;
                        this.editCache.push(data.guid);
                    } else {
                        data.isDefault = false;
                    }
                });
            }
            /** 如果没有被全选 */
            if (selectedSubItemNum && selectedSubItemNum < datas.subMenuList.length) {
                datas.nzIndeterminate = true;
            } else {
                datas.nzIndeterminate = false;
            }
        });
    }


    /*
    * 删除菜单
    * */
    deleteMenu(key: string): void {
        this.isVisibleMiddle = true;
        this.deleteGuid = this.editCache[key].guid;
    }

    /*
    * 返回
    * */
    back() {
        this.router.navigate(['/admin/version/index']);
    }

    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        this.http.delete(this.url + '/hrm-menu/' + this.deleteGuid)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('删除成功');
                    this.getListDatas();
                    this.isVisibleMiddle = false;
                } else {
                    this.msg.error(res.message);
                }
            });

    }

    /**
     * 当前整行的全选
     * @param key
     * @param guid
     * @param value
     * @param parentKey
     */
    checkAll(key: any, guid: any, value: boolean, parentKey: any) {

        if (key === '999') {
            /** 被选中的子功能个数 */
            let selectedSubItem = 0;
            /** 父节点在cache中的位置 */
            let parentIndexInCache;
            if (!value) {
                this.dataLists[parentKey].isDefault = value;
                const parentId = this.dataLists[parentKey].guid;
                /*删除上级节点*/
                for (let i = 0; i < this.menuIds.length; i++) {
                    if (parentId === this.menuIds[i]) {
                        // this.editCache.splice(i, 1);
                        parentIndexInCache = i;
                    }
                    if (guid === this.editCache[i]) {
                        this.editCache.splice(i, 1);
                    }
                }
                /*删除当前节点*/
                for (let i = 0; i < this.editCache.length; i++) {
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
                    this.menuIds.push(this.dataLists[parentKey].guid);
                    this.dataLists[parentKey].isDefault = value;
                }
                this.editCache.push(guid);
            }
            /** 判断是否有选中的子功能 */
            this.dataLists[parentKey]['subMenuList'].forEach((subItem: any) => {
                if (subItem.isDefault) {
                    selectedSubItem++;
                }
            });
            // 当子功能都没被选择时，从cache里删除父节点
            if (selectedSubItem === 0) {
                this.menuIds.splice(parentIndexInCache, 1);
            }
            /** 设置没全选时的状态 */
            if (selectedSubItem && selectedSubItem < this.dataLists[parentKey]['subMenuList'].length) {
                this.dataLists[parentKey].nzIndeterminate = true;
            } else {
                this.dataLists[parentKey].nzIndeterminate = false;
            }
        } else {
            this.dataLists[key].nzIndeterminate = false;
            if (!value) {
                for (let i = 0, j = this.menuIds.length; i < j; i++) {
                    if (this.menuIds[i] === guid) {
                        this.menuIds.splice(i, 1);
                    }
                }
                this.dataLists[key].isDefault = value;
                this.dataLists[key].subMenuList.forEach((data, idx) => {
                    data.isDefault = value;
                    if (this.menuIds.includes(data.guid)) {
                        this.menuIds.splice(idx);
                    }
                });
            } else {
                this.menuIds.push(guid);
                this.dataLists[key].isDefault = value;
                this.dataLists[key].subMenuList.forEach(datas => {
                    datas.isDefault = value;
                    this.editCache.push(datas.guid);
                });
            }
        }
    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;

    }

    /*
* 保存授权
* */
    submit() {
        this.http.put(this.url + '/hrm-template-menu/' + this.guid, {menuIds: this.menuIds, subMenuIds: this.editCache})
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('更新模板功能成功');
                    this.editCache = [];
                    this.getListDatas();
                }
            });
    }

    to(item: any) {
        this.router.navigateByUrl(`/admin/${item}`).then();
    }

    ngOnInit(): void {
        this.getTemplateDataList('pc');
    }

}
