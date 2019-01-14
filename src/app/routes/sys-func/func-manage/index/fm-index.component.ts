

import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { ScrollService } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-fm-index',
    templateUrl: 'fm-index.component.html'
})
export class FmIndexComponent implements OnInit {

    loading = false;
    // 请求相关
    httpUrl_F = environment.FRAMEWORK_URL + 'service';
    APP_MENU = '/sys-app-menu';
    PC_MENU = '/sys-menu';
    // 菜单列表
    menuList = [];
    // 展示在右侧table里的数据
    showList = [];
    // 当前选中的目录guid
    currentSelectedMenuGuid = null;
    // 当前选中的tab标签(0:PC端，1：移动端)
    currentSelectedTab = 0;
    
    constructor(
        private msg: NzMessageService,
        private http: HttpClient,
        private scroll: ScrollService,
        private modal: NzModalService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        new Promise((resolve, reject) => {
            if (this.activatedRoute.routeConfig.path.includes('pc')) {
                this.currentSelectedTab = 0;
            } else {
                this.currentSelectedTab = 1;
            }
            resolve();
        }).then(() => {
            this.getMenuList();
        });
    }
    /**
     * tab激活回调
     * @param param0 
     */
    tabChange({ index }) {
        this.currentSelectedTab = index;
        this.router.navigate(['sysfunc/funcmanage/index/' + (index === 0 ? 'pc' : 'app')]);
        // this.getMenuList();
    }
    /**
     * 得到菜单列表
     */
    getMenuList() {
        this.http.get(this.httpUrl_F + (this.currentSelectedTab === 0 ? this.PC_MENU : this.APP_MENU) + '/list').subscribe((res: any) => {
            if (res.code === 1) {
                this.menuList = res.data;
                this.showList = this.menuList;
                if (this.menuList.length > 0) {
                    this.currentSelectedMenuGuid = this.menuList[0].guid;
                }
            } else {
                this.msg.error(res.message);
            }
        });
    }

    /**
     * 选中菜单列表更新数据
     * @param guid 被选中菜单guid
     * @param type 菜单类型（0：一级，1：二级）
     * @param itemIndex 一级菜单的序号
     * @param subItemIndex 二级菜单的序号
     */
    refreshData(guid: string, type: any, itemIndex: any, subItemIndex: any) {
        if (type === 0) {
            this.currentSelectedMenuGuid = guid;
            this.showList = this.menuList[itemIndex].subMenuList;
            if (!(this.menuList[itemIndex].subMenuList.length > 0)) {
                this.scroll.scrollToTop();
            }
        } else {
            this.showList = [];
            this.showList.push(this.menuList[itemIndex].subMenuList[subItemIndex]);
            this.scroll.scrollToTop();
        }
    }

    /**
     * 删除menu
     * @param guid guid 
     */
    deleteMenu(guid) {
        this.modal.confirm({
            nzTitle: '删除',
            nzContent: '是否删除当前目录？',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.delete(this.httpUrl_F + (this.currentSelectedTab === 0 ? this.PC_MENU : this.APP_MENU) + '/' + guid).subscribe((res: any) => {
                    if (res.code === 1) {
                        this.msg.success('删除成功！');
                        this.getMenuList();
                    } else {
                        this.msg.error(res.message);
                    }
                });
            }
        });
    }
}
