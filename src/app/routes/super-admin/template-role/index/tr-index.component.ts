

import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-tr-index',
    templateUrl: 'tr-index.component.html'
})

export class TrIndexComponent implements OnInit {
    httpUrl = environment.HRM_URL + 'service/hrm-role-tag';
    // 加载等待
    loading = false;
    // 数据
    dataList;
    // 分页相关
    pageNum = 1;
    pageSize = 20;
    pageTotal = 0;
    // 搜索框
    serachType = 0;
    // 搜索条件
    searchStr = '';
    constructor(
        private http: HttpClient,
        private nzModal: NzModalService,
        private nzMsg: NzMessageService
    ) { }

    ngOnInit() {
        this.pageChange(1);
    }

    pageChange(index) {
        if (index > 0) {
            this.pageNum = index;
            this.http.get(this.httpUrl + '/page-list', {
                params: {
                    pageNum: this.pageNum + '',
                    pageSize: this.pageSize + '',
                    searchStr: this.searchStr
                }
            }).subscribe((res: any) => {
                if (res.code === 1) {
                    this.pageTotal = res.total;
                    this.dataList = res.data;
                }
            });
        }
    }

    confirmState(item) {
        this.nzModal.confirm({
            nzTitle: '状态',
            nzContent: `是否${item.roleState === 0 ? '开启' : '停用'}当前模板权限`,
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.patch(this.httpUrl + '/state/' + item.guid, {}).subscribe((res: any) => {
                    if (res.code === 1) {
                        this.nzMsg.success('变更成功！');
                        this.pageChange(1);
                    } else {
                        this.nzMsg.error(res.message);
                    }
                });
            }
        });
    }

    confirmDelete(item) {
        // console.log(item);
        this.nzModal.confirm({
            nzTitle: '删除',
            nzContent: '是否删除当前模板权限',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.delete(this.httpUrl + '/' + item.guid).subscribe((res: any) => {
                    if (res.code === 1) {
                        this.nzMsg.success('删除成功！');
                        this.pageChange(1);
                    } else {
                        this.nzMsg.error(res.message);
                    }
                });
            }
        });
    }
}
