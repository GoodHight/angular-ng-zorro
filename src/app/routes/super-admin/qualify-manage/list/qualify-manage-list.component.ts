
import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-qualify-manage-list',
    templateUrl: 'qualify-manage-list.component.html',
    styleUrls: ['qualify-manage-list.component.less']
})

export class QualifyManageListComponent implements OnInit {

    public toolbar = true;
    tabSelectIndex = 0;
    tabs: any[] = [{
        key: 'qualify',
        tab: '资质审核',
    }];

    shenheForm: FormGroup;
    isVisible = false;
    isOkLoading = false;
    shenheGuid;

    loading;
    dataList;
    respObj = {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        description: '',
        sorter: '',
        status: null,
        statusList: []
    };
    searchCondition = {
        queryKey: '',
        state: '', // '1' | '0' | '-1' | '-2';
        isEnterpriseAuthentication: '', // '1' | '0' | '2'
        enterpriseType: '',
        pageNum: 1,
        pageSize: 20
    };
    url = environment.FRAMEWORK_URL + 'service/enterprise';
    url_hrm = environment.HRM_URL + 'service/hrm-enterprise';
    state = {
        '1': '启用',
        '0': '未启用',
        '-1': '锁定',
        '-2': '过期'
    };
    enterpriseAuthentication = {
        '1': '已认证',
        '0': '未认证',
        '2': '认证中'
    };
    enterpriseAccountAuthentication = {
        '1': '已认证',
        '0': '未认证',
        '2': '认证中'
    };

    allChecked = false;
    indeterminate = false;
    constructor(private http: HttpClient,
        public msg: NzMessageService,
        private router: Router,
        private modalService: NzModalService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.getData();
        this.shenheForm = this.fb.group({
            auditState: ['1', [Validators.required]],
            describe: [null]
        });
    }
    /**
     *
     * @param  排序
     */
    sort(s) {

        this.dataList.sort((v1, v2) => {
            if (s.value === 'descend') {
                if (s.key === 'registerAddressName') {
                    return v1.registerAddressName + v1.registerAddressDetail > v2.registerAddressName + v2.registerAddressDetail ? 1 : -1;
                } else {
                    return v1[s.key] > v2[s.key] ? 1 : -1;
                }
            } else {
                if (s.key === 'registerAddressName') {
                    return v1.registerAddressName + v1.registerAddressDetail < v2.registerAddressName + v2.registerAddressDetail ? 1 : -1;
                } else {
                    return v1[s.key] < v2[s.key] ? 1 : -1;
                }
            }
        });
    }

    refreshStatus(): void {
        const allChecked = this.dataList.every(value => value.checked === true);
        const allUnChecked = this.dataList.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }

    checkAll(value: boolean): void {
        this.dataList.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    details_router(item) {
        this.router.navigate(['/admin/qualify/detail/' + item.guid]);
    }
    shenhe(item) {
        this.isVisible = true;
        this.isOkLoading = false;
        this.shenheForm = this.fb.group({
            auditState: ['1', [Validators.required]],
            describe: [null]
        });
        this.shenheGuid = item.guid;
    }
    handleCancel() {
        this.isVisible = false;
    }
    handleOk() {
        this.isVisible = false;
        this.http.patch(this.url + '/change-audit-states/' + this.shenheGuid, null, {
            params: {
                'auditState': this.shenheForm.value.auditState,
                'describe': this.shenheForm.value.describe
            }
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('审核成功');
                this.getData();
            } else {
                this.msg.error('审核失败');
            }
        });
    }
    showConfirmAbleDisable(status, guid) {
        const s = status === 1 ? '启用' : '停用';
        this.modalService.confirm({
            nzTitle: `确认要${s}吗？`,
            nzWrapClassName: 'vertical-center-modal',
            nzOnOk: () => {
                this.changeState(status, guid);
            },
            nzOnCancel() {
            }
        });
    }
    /**
     *
     * @param state 改变企业状态
     */
    changeState(state, guid) {
        this.http.patch(this.url + '/change-states/' + guid, null, {
            params: {
                'state': state
            }
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('企业状态修改成功');
                this.getData();
            } else if (res.code === 0) {
                this.msg.success('企业状态修改失败');
            }
        });
    }
    showConfirmSingle(item) {
        this.modalService.confirm({
            nzTitle: '确认要删除吗？',
            nzWrapClassName: 'vertical-center-modal',
            nzOnOk: () => {
                this.delete(item.guid);
            },
            nzOnCancel() {
            }
        });
    }
    showConfirmDeleteBatch() {
        this.modalService.confirm({
            nzTitle: '确认要删除选中的企业吗？',
            nzWrapClassName: 'vertical-center-modal',
            nzOnOk: () => {
                const deleteArr = [];
                this.dataList.forEach((value) => {
                    if (value.checked) {
                        deleteArr.push(value.guid);
                    }
                });
                this.delete(deleteArr.join(','));
            },
            nzOnCancel() {
            }
        });
    }
    delete(guids) {
        this.http.delete(this.url, {
            params: {
                'guids': guids
            }
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('删除数据成功', { nzDuration: 3000 });
                this.loading = true;
                this.getData();
            } else {
                this.msg.error(res.message, { nzDuration: 3000 });
            }
        }, response => {

        });
    }
    getData() {

        this.pageChange(1).then(() => {
            this.loading = true;
            this.http.get(this.url, { params: this.getHttpParams() })
                .subscribe((res: any) => {
                    if (res.code === 1) {
                        this.dataList = res.data;
                        this.respObj.pageNum = this.searchCondition.pageNum;
                        this.respObj.pageSize = this.searchCondition.pageSize;
                        this.respObj.total = res.total;
                        this.loading = false;
                    }
                    if (res.code === 0) {
                        this.msg.error('没有数据');
                        this.loading = false;
                    }
                }, response => {
                    // console.log('服务器错误');
                    return;
                });
        });
    }

    pageChange(pageNum: number): Promise<any> {
        this.searchCondition.pageNum = pageNum;
        this.loading = true;
        return new Promise((resolve) => {
            setTimeout(() => {
                this.loading = false;
                resolve();
            }, 500);
        });
    }

    getHttpParams(): HttpParams {
        let params = new HttpParams().set('pageNum', this.searchCondition.pageNum.toString()).set('pageSize', this.searchCondition.pageSize.toString());
        if (this.searchCondition.queryKey) {
            params = params.set('queryKey', this.searchCondition.queryKey);
        }
        if (this.searchCondition.state) {
            params = params.set('state', this.searchCondition.state);
        }
        if (this.searchCondition.isEnterpriseAuthentication) {
            params = params.set('isEnterpriseAuthentication', this.searchCondition.isEnterpriseAuthentication);
        }
        if (this.searchCondition.enterpriseType) {
            params = params.set('enterpriseType', this.searchCondition.enterpriseType);
        }
        return params;
    }

    /**
     * 设置默认权限
     * @param guid 企业id
     */
    setDefaultAuth(guid) {
        this.modalService.confirm({
            nzTitle: '设置权限',
            nzContent: '为当前企业设置默认权限？',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.put(this.url_hrm + '/' + guid, {}).subscribe((res: any) => {
                    if (res.code === 1) {
                        this.msg.success('设置成功！');
                    } else {
                        this.msg.error(res.message);
                    }
                });
            }
        });
    }
}
