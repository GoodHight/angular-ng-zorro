import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { isNullOrUndefined } from 'util';
import { GlobalState } from '../../../../service/global.state';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
@Component({
    selector: 'app-system-index',
    styleUrls: ['./index.component.less'],
    templateUrl: './index.component.html',
})

export class SystemIndexComponent implements OnInit {
    public loading = true;
    public dataSet: any = [];
    public _sortField = '';
    public _sortValue = '';
    tabs = [{
        key: 'notice',
        tab: '公告信息',
    }, {
        key: 'system',
        tab: '制度信息',
    }
    ];
    public q: any = {
        pageNum: 1,
        pageSize: 20,
        total: '',
        userId: this.tokenService.get().guid,
        enterpriseId: this.tokenService.get().guid,
        order: 'desc',
        orderBy: '',
        searchStr: ''
    };

    constructor(private router: Router, private globalState: GlobalState, private http: HttpClient,
        private modalService: NzModalService, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {

    }

    ngOnInit() {
        this.refreshData(true, null);
    }


    sort(sort: { key: string, value: string }) {
        if (sort.value === 'descend') {
            this._sortField = sort.key;
            this._sortValue = 'desc';
        } else if (sort.value === 'ascend') {
            this._sortField = sort.key;
            this._sortValue = 'asc';
        } else {
            this._sortField = '';
            this._sortValue = '';
        }
        this.refreshData(true, null);
    }

    protected refreshData(reset: boolean = false, callbackfun) {
        if (reset) {
            this.q.pageNum = 1 + '';
        }
        this.loading = true;

        let params = new HttpParams()
            .set('pageNum', this.q.pageNum.toString())
            .set('pageSize', this.q.pageSize.toString())
            .set('searchStr', this.q.searchStr)
            .set('messageType', 'RULES');

        if (!isNullOrUndefined(this._sortField)) {
            params = params.set('sortField', this._sortField);
            params = params.set('sortValue', this._sortValue);
        }

        this.http.get(environment.NOTICE_URL + 'service/notice/getPageList/2', { params: this.q }).subscribe((res: any) => {
            if (res.code === 0) {
                this.q.total = res.total;
                this.dataSet = res.data;

                this.loading = false;
                if (callbackfun) {
                    callbackfun();
                }
            } else {
                this.dataSet = [];
                this.loading = false;
                this.msg.error(res.message);
            }
        }, response => {
            this.dataSet = [];
            this.loading = false;
        });
    }
    repeatRequest(): Promise<any> {
        return new Promise((resolve) => {
            this.refreshData(false, resolve);
        }).then((res) => {
            if (this.dataSet.length < 1) {
                this.q.pageNum = this.q.pageNum - 1;
                if (this.q.pageNum <= 0) {
                    this.q.pageNum = 1;
                }
                this.refreshData(false, null);
            }
        });
    }
    pageChange(pageIndex: number) {
        this.q.pageNum = pageIndex + '';
        this.refreshData(false, null);
    }
    /*
    * 回车搜索
    * */
    public enterSearch(e) {
        const keyCode = window.event ? e.keyCode : e.which;
        if (keyCode === 13) {
            this.refreshData(true, null);
        }
    }
    showConfirm = (item) => {
        this.modalService.confirm({
            nzTitle: '确认要删除吗？',
            nzWrapClassName: 'vertical-center-modal',
            nzOnOk: () => {
                this.http.delete(environment.NOTICE_URL + 'service/notice/' + item.guid, { params: { userId: this.tokenService.get().guid } }).subscribe((res: any) => {
                    if (res.code === 0) {
                        this.msg.success('删除数据成功', { nzDuration: 3000 });
                        this.loading = true;
                        this.repeatRequest();
                    } else {
                        this.msg.error(res.message, { nzDuration: 3000 });
                    }
                }, response => {

                });
            },
            nzOnCancel() {
            }
        });
    }


    edit_router(item) {
        this.router.navigate(['/news/system/index/edit/', item.guid]);
    }

    details_router(item) {
        this.router.navigate(['/news/system/index/detail', item.guid]);
    }
    to(item: any) {
        this.router.navigateByUrl(`/news/${item.key}`).then();
    }

    add_router() {
        this.router.navigate([`/news/${this.tabs[1].key}/index/add`]);
    }
    // 发布
    public_router(guid) {
        this.modalService.confirm({
            nzTitle: '确认要发布吗？',
            nzWrapClassName: 'vertical-center-modal',
            nzOnOk: () => {
                this.http.patch(environment.SERVER_URL + environment.NOTICE_URL + 'service/notice/publish/' + guid, {}, {
                    params: {
                        userId: this.tokenService.get().guid
                    }
                }).subscribe((res: any) => {
                    if (res.code === 0) {
                        this.msg.success('发布成功', { nzDuration: 3000 });
                        this.loading = true;
                        this.refreshData(true, null);
                    } else {
                        this.msg.error(res.message, { nzDuration: 3000 });
                    }
                }, response => {

                });
            },
            nzOnCancel() {
            }
        });

    }
    // 置顶
    public_top(guid, istop) {
        let str = '确认要置顶吗？';
        if (istop === 1) {
            str = '确认要取消置顶吗？';
        }
        this.modalService.confirm({
            nzTitle: str,
            nzWrapClassName: 'vertical-center-modal',
            nzOnOk: () => {
                this.http.patch(environment.SERVER_URL + environment.NOTICE_URL + 'service/notice/setTop/' + guid, {}, {
                    params: {
                        userId: this.tokenService.get().guid
                    }
                }).subscribe((res: any) => {
                    if (res.code === 0) {
                        this.msg.success('置顶成功', { nzDuration: 3000 });
                        this.loading = true;
                        this.refreshData(true, null);
                    } else {
                        this.msg.error(res.message, { nzDuration: 3000 });
                    }
                }, response => {

                });
            },
            nzOnCancel() {
            }
        });
    }
}
