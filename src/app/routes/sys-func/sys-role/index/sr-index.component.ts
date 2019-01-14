

import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'app-sys-role',
    templateUrl: 'sr-index.component.html'
})
export class SrIndexComponent implements OnInit {

    httpUrl = environment.FRAMEWORK_URL + 'service/sys-role';
    loading = false;
    // 分页相关
    pageNum = 1;
    pageSize = 20;
    pageTotal = 0;
    // 搜索条件
    searchStr = '';
    // 列表
    sysRoleList = [];

    constructor(
        private http: HttpClient,
        private msg: NzMessageService,
        private modal: NzModalService
    ) { }

    ngOnInit() { 
        this.getSysRoleList();
    }

    /**
     * 得到权限列表
     */
    getSysRoleList() {
        this.loading = true;
        this.http.get(this.httpUrl + '/page-list', {
            params: {
                pageNum: this.pageNum + '',
                pageSize: this.pageSize + '',
                searchStr: this.searchStr
            }
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.sysRoleList = res.data;
                this.pageTotal = res.total;
            } else {
                this.msg.error(res.message);
            }
            this.loading = false;
        });
    }

    /**
     * 页码变化
     * @param pageNum 
     */
    pageChange(pageNum) {
        if (pageNum > 0) {
            this.pageNum = pageNum;
            this.getSysRoleList();
        } else {
            return;
        }
    }

    confirmText = {
        0: ['删除', '是否删除该权限？'],
        1: ['停用', '是否停用该权限？'],
        2: ['启用', '是否启用该权限？']
    };
    confirmModal(type: number, guid: any) {
        if (!this.confirmText[type]) {
            return;
        }
        this.modal.confirm({
            nzTitle: this.confirmText[type][0],
            nzContent: this.confirmText[type][1],
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                if (type === 0) {
                    // 删除
                    this.deleteRole(guid);
                } else if (type === 1 || type === 2) {
                    // 启用或停用
                    this.changeRole(guid);
                }
            }
        });
    }

    deleteRole(guid: any) {
        this.http.delete(this.httpUrl + '/' + guid).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('删除成功！');
                this.getSysRoleList();
            } else {
                this.msg.error(res.message);
            }
        });
    }

    changeRole(guid: any) {
        this.http.patch(this.httpUrl + '/state/' + guid, {}).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('变更成功！');
                this.getSysRoleList();
            } else {
                this.msg.error(res.message);
            }
        });
    }
}
