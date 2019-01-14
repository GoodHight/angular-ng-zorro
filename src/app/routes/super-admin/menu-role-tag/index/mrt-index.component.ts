

import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-mrt-index',
    templateUrl: 'mrt-index.component.html'
})

export class MrtIndexComponent implements OnInit {

    httpUrl = environment.HRM_URL + 'service';

    isCollapsed = false;
    /**
     * 全部菜单列表
     */
    allMenuList = [];
    /**
     * 当前被选中的权限拥有的菜单列表
     */
    currentRoleMenuList;
    /**
     * 缓存已选中的菜单
     */
    editCache;
    /**
     * 当前客户端
     */
    client = 'pc';
    // 跳转传过来的guid
    tag = null;
    // 当前模板权限
    currentRoleTag = {
        roleName: ''
    };
    constructor(
        private http: HttpClient,
        private msg: NzMessageService,
        private modal: NzModalService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() { 
        this.tag = this.activatedRoute.snapshot.paramMap.get('tag');
        // console.log(this.tag);
        this.getRoleTagDetail(this.tag);
        this.getAllRoleList();

    }
    /**
     * 获取当前模板权限详情
     * @param guid 模板guid
     */
    getRoleTagDetail(guid: any) {
        this.http.get(this.httpUrl + '/hrm-role-tag/' + guid).subscribe((res: any) => {
            if (res.code === 1) {
                this.currentRoleTag = res.data;
            }
        });
    }
    /**
     * tab标签切换
     */
    tabSelectChange(item) {
        // console.log(this.tag);
        // console.log(item.index);
        if (item.index === 0) {
            this.client = 'pc';
        } else {
            this.client = 'app';
        }
        this.getAllRoleList();
    }
    /**
     * 得到当前被选中的菜单拥有的权限列表
     * @param guid 被选中菜单的guid
     */
    getCurrentMenuRoleList(guid: any) {
        this.http.get(this.httpUrl + '/hrm-menu-role-tag/' + this.client + '/' + guid).subscribe((res: any) => {
            if (res.code === 1) {
                this.currentRoleMenuList = [];
                res.data.forEach((data: any) => {
                    this.currentRoleMenuList.push(data.menuGuid);
                });
                this.refreshStatus();
            } else {
                this.msg.error(res.message);
            }
        });
    }
    /**
     * 得到所有的权限列表
     */
    getAllRoleList() {
        let clientUrl = '/hrm-menu';
        if (this.client !== 'pc') {
            clientUrl = '/app-menu';
        }
        this.http.get(this.httpUrl + clientUrl).subscribe((res: any) => {
            if (res.code === 1) {
                this.allMenuList = res.data;
                this.getCurrentMenuRoleList(this.tag);
            }
        });
    }
    /**
     * 更新菜单显示状态
     */
    public refreshStatus() {
        this.editCache = [];
        this.allMenuList.forEach((datas, index) => {
            if (this.currentRoleMenuList.includes(datas.guid)) {
                datas.isDefault = true;
                this.editCache.push(datas.guid);
            } else {
                datas.isDefault = false;
            }
            /** 被选中的子项数量 */
            let selectedSubItemNum = 0;
            if (datas.subMenuList.length > 0) {
                datas.subMenuList.forEach(data => {
                    if (this.currentRoleMenuList.includes(data.guid)) {
                        data.isDefault = true;
                        selectedSubItemNum ++;
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
    /**
     * 全选
     * @param index 序号
     * @param guid guid
     * @param value 是否选中
     * @param parentIndex 父级序号
     */
    checkAll(index: any, guid: any, value: boolean, parentIndex: any) {
        if (index === '-1') {
            /** 被选中的子功能个数 */
            let selectedSubItem = 0;
            /** 父节点在cache中的位置 */
            let parentIndexInCache;
            if (!value) {
                this.allMenuList[parentIndex].isDefault = value;
                const parentId = this.allMenuList[parentIndex].guid;
                /*删除上级节点*/
                for (let i = 0; i < this.editCache.length; i++) {
                    if (parentId === this.editCache[i]) {
                        // this.editCache.splice(i, 1);
                        parentIndexInCache = i;
                    }
                    if (guid === this.editCache[i]) {
                        this.editCache.splice(i, 1);
                    }
                }
            } else {
                let statae = true;
                this.allMenuList[parentIndex].subMenuList.forEach(data => {
                    if (!data.isDefault) {
                        statae = !value;
                        return;
                    }
                });
                if (statae) {
                    this.editCache.push(this.allMenuList[parentIndex].guid);
                    this.allMenuList[parentIndex].isDefault = value;
                }
                this.editCache.push(guid);
            }
            /** 判断是否有选中的子功能 */
            this.allMenuList[parentIndex]['subMenuList'].forEach((subItem: any) => {
                if (subItem.isDefault) {
                    selectedSubItem ++;
                }
            });
            // 当子功能都没被选择时，从cache里删除父节点
            if (selectedSubItem === 0) {
                this.editCache.splice(parentIndexInCache, 1);
            }
            /** 设置没全选时的状态 */
            if (selectedSubItem && selectedSubItem < this.allMenuList[parentIndex]['subMenuList'].length) {
                this.allMenuList[parentIndex].nzIndeterminate = true;
            } else { 
                this.allMenuList[parentIndex].nzIndeterminate = false;
            }
        } else {
            this.allMenuList[index].nzIndeterminate = false;
            if (!value) {
                for (let i = 0, j = this.editCache.length; i < j; i ++) {
                    if (this.editCache[i] === guid) {
                        this.editCache.splice(i, 1);
                    }
                }
                this.allMenuList[index].isDefault = value;
                this.allMenuList[index].subMenuList.forEach((data, idx) => {
                    data.isDefault = value;
                    if (this.editCache.includes(data.guid)) {
                        this.editCache.splice(idx);
                    }
                });
            } else {
                this.editCache.push(guid);
                this.allMenuList[index].isDefault = value;
                this.allMenuList[index].subMenuList.forEach(datas => {
                    datas.isDefault = value;
                    this.editCache.push(datas.guid);
                });
            }
        }
    }

    /**
     * 授权
     */
    authorization() {
        const parentMenuIds = [];
        const subMenuIds = [];
        this.allMenuList.forEach((value: any) => {
            if (value.isDefault) {
                parentMenuIds.push(value.guid);
            }
            if (value.subMenuList.length > 0) {
                value.subMenuList.forEach((subValue: any) => {
                    if (subValue.isDefault) {
                        subMenuIds.push(subValue.guid);
                    }
                });
            }
        });
        this.http.put(this.httpUrl + '/hrm-menu-role-tag/' + this.client + '/' + this.tag, {
            'menuIds': parentMenuIds,
            'subMenuIds': subMenuIds
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('更新成功！');
                this.getCurrentMenuRoleList(this.tag);
            } else {
                this.msg.error(res.message);
            }
        });
    }

}
