

import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-companystorage',
    templateUrl: 'companystorage.component.html'
})

export class CompanyStorageComponent implements OnInit {
    httpUrl = environment.SERVER_URL + '/storage/';
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
    userId = '';
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
    searchStr = '';
    allChecked = false;
    indeterminate = false;
    displayData = [];
    isVisible = false;
    czguid = '';

    constructor(private http: HttpClient,
        private msg: NzMessageService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private router: Router) { }

    ngOnInit() {
        if (this.tokenService.get().type === 1) {
            this.userId = this.tokenService.get().guid;
        } else {
            this.userId = this.tokenService.get().userId;
        }
        this.getDictionaries();
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

    /**
    * 批量下载存证
    */
    batchIssue() {
        let datas = '';
        this.studentNum = 0;
        this.batchArr = [];
        this.displayData.forEach((value: any) => {
            if (value['checked']) {
                // console.log(value);
                datas += value.fileId + ',';
                this.batchArr.push(value);
                this.studentNum += value.studentNumber;
            }
        });
        if (this.batchArr.length === 0) {
            this.msg.info('请选择要下载的存证！');
            return false;
        }
        datas = datas.substring(0, datas.length - 1);
        // console.log(datas);
        location.href = environment.SERVER_URL + environment.FILE_URL + 'service/files/downloadFiles?guids=' + datas;

    }
    getComponyStorage(callbackfun) {
        this.loading = true;
        this.http.get(this.httpUrl + 'service/infoStorage/getPageList', {
            params: {
                enterpriseGuid: this.tokenService.get().guid,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                userId: this.userId,
                typeId: this.typeId,
                searchStr: this.searchStr,
            }
        }).subscribe((res: any) => {
            // console.log('p1.excuting');
            // console.log(res);
            this.loading = false;
            if (res.code === 0) {
                this.dataList = res.data;
                this.pageTotal = res.total;
                if (callbackfun) {
                    callbackfun();
                }
            } else {
                this.dataList = [];
                this.pageTotal = 0;
                this.msg.error(res.message);
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
    getDictionaries() {
        this.http.get(environment.SERVER_URL + environment.COMMONS_URL + 'service/dictionary/all')
            .subscribe((res: any) => {
                if (res.code === 0) {
                    res.data.forEach((value: any, key: any) => {
                        if (value.dictCode === 'INFO_STORAGE_DIC_TYPE') {
                            this.peoplelits = value.childrenDictionaries;
                        }
                    });
                } else {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }
    employeeStateChange(e) {
        this.typeId = e;
        this.getComponyStorage(null);
    }
    gotoDetail(guid) {
        this.router.navigate(['/blockchain/companystorage/index/details/' + guid]);
    }

    showModal(guid): void {
        this.isVisible = true;
        this.czguid = guid;
    }
   
    repeatRequest(): Promise<any> {
        return new Promise((resolve) => {
            this.getComponyStorage(resolve);
        }).then((res) => {
            if (this.dataList.length < 1) {
                this.pageNum =  this.pageNum - 1;
                if (this.pageNum <= 0) {
                    this.pageNum = 1;
                }
                this.getComponyStorage(null);
            }
        });
    }

    handleOk(): void {
        this.http.delete(this.httpUrl + 'service/infoStorage/' + this.czguid, {
            params: {
                userId: this.userId,
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.msg.success('删除成功');
                this.repeatRequest();
            } else {
                this.msg.error(res.message);
            }
        });
        this.isVisible = false;
    }
    handleCancel(): void {
        this.isVisible = false;
    }



    // 单个下载
    dow(fileId) {
        location.href = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + fileId;
    }
}
