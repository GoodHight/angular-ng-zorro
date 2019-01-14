

import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-version-index',
    templateUrl: 'version-index.component.html'
})

export class VersionIndexComponent implements OnInit {

    httpUrl = environment.FRAMEWORK_URL + 'service/version';
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
    // 搜索客户端（app或pc或为空）
    client = '';
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
                    client: this.client,
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
    /**
     * 确认删除版本
     * @param item 
     */
    confirmDelete(item) {
        this.nzModal.confirm({
            nzTitle: '删除',
            nzContent: '是否删除当前版本',
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
    /**
     * 修改状态
     * @param item 
     */
    confirmState(item) {
        this.nzModal.confirm({
            nzTitle: '状态',
            nzContent: `是否${item.state === 0 ? '开启' : '关闭'}当前版本`,
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
}
