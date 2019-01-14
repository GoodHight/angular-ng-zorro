import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    httpUrl = environment.SERVER_URL + '/contract/';
    // 加载等待
    loading = false;
    dataList;
    showSearch = 0;
    searchKey;
    // 选择框
    batchArr = [];
    studentNum = 0;
    // 筛选条件
    selectCondition = '';
    userId = this.tokenService.get().guid;
    peoplelits = [];
    divname = '全部';
    divguid = '';
    list: any = {

    };
    // 分页相关
    pageTotal: any = 0;
    pageNum: any = 1;
    pageSize: any = 20;
    typeId = '';
    userID = '';
    searchStr = '';
    allChecked = false;
    indeterminate = false;
    displayData = [];
    isVisible = false;
    czguid = '';
    batchdis = false;

    constructor(private http: HttpClient,
        private msg: NzMessageService,
        private nzModal: NzModalService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private router: Router) { }

    ngOnInit() {
        if (this.tokenService.get().type === 1) {
            this.userID = this.tokenService.get().guid;
        } else {
            this.userID = this.tokenService.get().userId;
        }
        this.getComponyStorage(null);
    }

    currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
        this.displayData = $event;
        // this.refreshStatus();
    }

    refreshStatus(): void {
        const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
        const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }

    checkAll(value: boolean): void {
        this.displayData.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refreshStatus();
    }
    getComponyStorage(callbackfun) {
        this.loading = true;
        this.http.get(this.httpUrl + 'service/contractTemplate/getPageList/' + this.tokenService.get().guid, {
            params: {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                searchStr: this.searchStr,
            }
        }).subscribe((res: any) => {
            // console.log(res);
            this.loading = false;
            if (res.code === 0) {
                this.dataList = res.data;
                this.pageTotal = res.total;
                if (callbackfun) {
                    callbackfun();
                }
                if (res.data.length === 0) {
                    this.batchdis = true;
                } else {
                    this.batchdis = false;
                }
            } else {
                this.dataList = [];
                this.pageTotal = 0;
                this.msg.error(res.message);
            }
        });
    }
    delete(guid) {
        this.nzModal.confirm({
            nzTitle: '删除合同模板',
            nzContent: '是否删除当前模板？',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.delete(this.httpUrl + 'service/contractTemplate/del', {
                    params: {
                        guid: guid,
                        userId: this.userID,
                    }
                }).subscribe((res: any) => {
                    if (res.code === 0) {
                        this.msg.success('删除成功');
                        this.getComponyStorage(null);
                    } else {
                        this.msg.error(res.message);
                    }
                });
            }
        });
    }
    pageChange(i) {
        if (i === 0) {
            return;
        } else {
            this.pageNum = i;
        }
        this.getComponyStorage(null);
    }
    employeeStateChange(e) {
        this.typeId = e;
        if (e === null) {
            this.typeId = '';
        }
        this.getComponyStorage(null);
    }
    templateAdd() {
        this.router.navigate(['/contract/template/list/add']);
    }
    repeatRequest(): Promise<any> {
        return new Promise((resolve) => {
            this.getComponyStorage(resolve);
        }).then((res) => {
            if (this.dataList.length < 1) {
                this.pageNum = this.pageNum - 1;
                if (this.pageNum <= 0) {
                    this.pageNum = 1;
                }
                this.getComponyStorage(null);
            }
        });
    }
    /*
   * 回车搜索
   * */
    public enterSearch(e) {
        const keyCode = window.event ? e.keyCode : e.which;
        if (keyCode === 13) {
            this.pageNum = 1;
            this.getComponyStorage(null);
        }
    }

    // 单个下载
    dow(url) {
        location.href = url;
    }
}
