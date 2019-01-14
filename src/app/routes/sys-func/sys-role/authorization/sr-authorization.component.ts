

import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-sr-authorization',
    templateUrl: 'sr-authorization.component.html'
})

export class SrAuthorizationComponent implements OnInit {

    httpUrl_role = environment.FRAMEWORK_URL + 'service/sys-role';
    httpUrl_menu = environment.FRAMEWORK_URL + 'service/sys-menu';
    httpUrl_app_menu = environment.FRAMEWORK_URL + 'service/sys-app-menu';
    // 权限guid
    roleGuid = null;
    // 权限下目录列表
    roleMenuList = [];
    // 客户端 0：pc，1：app
    client = 0;
    // 全部目录列表
    menuList = [];

    constructor(
        private http: HttpClient,
        private msg: NzMessageService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.roleGuid = this.activatedRoute.snapshot.paramMap.get('guid');
        this.getRoleMenuList(this.roleGuid).then(() => {
            this.getMenuList();
        }).catch((res) => {
            this.msg.error(res);
        });
    }

    /**
     * 获取权限所拥有的目录列表
     * @param guid 当前权限guid
     */
    getRoleMenuList(guid): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.httpUrl_role + '/get-auth/' + (this.client === 0 ? 'pc' : 'app') + '/' + guid).subscribe((res: any) => {
                if (res.code === 1) {
                    this.roleMenuList = [];
                    res.data.forEach((item: any) => {
                        this.roleMenuList.push(item.guid);
                    });
                    // console.log(this.roleMenuList);
                    resolve();
                } else {
                    reject(res.message);
                }
            });
        });
    }
    /**
     * 获取全部目录
     */
    getMenuList() {
        const url = this.client === 0 ? this.httpUrl_menu : this.httpUrl_app_menu;
        this.http.get(url + '/list').subscribe((res: any) => {
            if (res.code === 1) {
                this.menuList = res.data;
                this.refreshData();
            } else {
                this.msg.error(res.message);
            }
        });
    }
    /**
     * 刷新数据
     */
    refreshData() {
        if (this.roleMenuList.length === 0) {
            return;
        }
        this.menuList.forEach((item: any) => {
            if (this.roleMenuList.includes(item.guid + '')) {
                item.checked = true;
            }
            if (item.subMenuList.length > 0) {
                let count = 0;
                item.subMenuList.forEach((subItem: any) => {
                    if (this.roleMenuList.includes(subItem.guid + '')) {
                        subItem.checked = true;
                        count ++;
                    }
                });
                if (count && count !== item.subMenuList.length) {
                    item.nzIndeterminate = true;
                }
            }
        });
    }

    onChecked($event: any, layer: number, item: any, parentItem?: any) {
        if (layer === 1) {
            // 一级
            item.checked = $event;
            item.nzIndeterminate = false;
            if (item.subMenuList.length > 0) {
                item.subMenuList.forEach((subItem: any) => {
                    subItem.checked = $event;
                });
            }
        } else {
            // 二级
            item.checked = $event;
            let count = 0;
            parentItem.subMenuList.forEach((subItem: any) => {
                if (subItem.checked) {
                    count ++;
                }
            });
            // console.log(count);
            if (count && count !== parentItem.subMenuList.length) {
                parentItem.nzIndeterminate = true;
            } else {
                parentItem.nzIndeterminate = false;
            }
            // console.log(parentItem);
        }
    }

    tabChange({ index }) {
        this.client = index;
        this.getRoleMenuList(this.roleGuid).then(() => {
            this.getMenuList();
        }).catch((res) => {
            this.msg.error(res);
        });
    }
    /**
     * 授权
     */
    authorization() {
        const items = [];
        const subItems = [];
        this.menuList.forEach((item: any) => {
            if (item.checked) {
                items.push(item.guid);
            }
            if (item.subMenuList.length > 0) {
                item.subMenuList.forEach((subItem: any) => {
                    if (subItem.checked) {
                        subItems.push(subItem.guid);
                    }
                });
            }
        });
        this.http.put(this.httpUrl_role + '/auth/' + (this.client === 0 ? 'pc' : 'app') + '/' + this.roleGuid, {
            menuIds: items,
            subMenuIds: subItems
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('授权成功！');
                this.router.navigate(['sysfunc/sysrole/index']);
            } else {
                this.msg.error(res.message);
            }
        });
    }
}
