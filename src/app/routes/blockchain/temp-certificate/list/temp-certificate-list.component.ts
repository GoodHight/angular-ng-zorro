import {Component, OnInit, Inject} from '@angular/core';
import {environment} from '@env/environment';
import {ITokenService, DA_SERVICE_TOKEN} from '@delon/auth';
import {NzModalService, NzModalRef, NzMessageService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-temp-certificate-list',
    templateUrl: 'temp-certificate-list.component.html',
    styleUrls: ['./temp-certificate-list.component.less']
})

export class TempCertificateListComponent implements OnInit {
    httpUrl = environment.HRM_URL + 'service';

    loading = false;
    // 已经签发
    alreadyIssues = [];
    // 未签发
    notIssues = [];
    // 标签选中
    tabSelect = 0;
    // 班级列表
    classes;
    // 分页相关
    pageNum = 1;
    pageSize = 20;
    pageIssuedTotal = 0;
    pageNotIssueTotal = 0;
    // 不签发原因
    refuseReason;
    // 拒绝模态框
    refuseModal: NzModalRef;
    // 当前班级guid
    currentItemGuid;
    // 全选
    allChecked;
    indeterminate;

    constructor(private http: HttpClient,
                @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
                private nzModal: NzModalService,
                private msg: NzMessageService) {
    }

    ngOnInit() {
        this.getClasses();
    }

    /**
     * 得到班级列表
     */
    getClasses() {
        this.http.get(this.httpUrl + '/classes/enterprise-guid', {
            params: {
                enterpriseGuid: this.tokenService.get()['enterprisesInfo']['enterprisesId'],
                pageNum: 1 + '',
                pageSize: 100 + ''
            }
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.classes = res.data;
                if (this.classes.length) {
                    this.currentItemGuid = this.classes[0].guid;
                    // 已签发
                    this.getStudents(this.classes[0].guid, '1');
                    setTimeout(() => {
                        // 未签发
                        this.getStudents(this.classes[0].guid, '0'); 
                    }, 500);
                }
            } else {
                this.classes = [];
            }
        });
    }

    /**
     * 页码改变
     * @param  i 页码
     * @param issuingStatus 当前列表属于什么签发状态 1: 签发 0：未签发
     */
    pageChange(i, issuingStatus) {
        this.pageNum = i;
        this.getStudents(this.currentItemGuid, issuingStatus);
    }

    /**
     * 得到学生列表
     * @param classGuid 班级id
     * @param issuingStatus 签发状态(1=签发 0=未签发)
     */
    getStudents(classGuid: any, issuingStatus: string) {
        this.http.get(this.httpUrl + '/certificate/status', {
            params: {
                classGuid: classGuid,
                issuingStatus: issuingStatus,
                pageNum: this.pageNum + '',
                pageSize: this.pageSize + ''
            }
        }).subscribe((res: any) => {
            if (res.code === 1) {
                if (issuingStatus === '1') {
                    // 已签发
                    this.alreadyIssues = res.data;
                    this.pageIssuedTotal = res.total;
                    // console.log(this.pageIssuedTotal);
                } else {
                    this.notIssues = res.data;
                    this.pageNotIssueTotal = res.total;
                    // console.log(this.notIssues);
                }
            } else {
                if (issuingStatus === '1') {
                    // 已签发
                    this.alreadyIssues = [];
                    this.pageIssuedTotal = 0;
                } else {
                    // 未签发
                    this.notIssues = [];
                    this.pageNotIssueTotal = 0;
                }
            }
        });
    }

    /**
     * tab 变更回调函数
     * @param i
     */
    tabSelectChange(i) {
        // console.log(i);
        this.pageNum = 1;
        this.tabSelect = i.index;
        if (i === 0) {
            this.getStudents(this.currentItemGuid, '1');
        } else {
            this.getStudents(this.currentItemGuid, '0');
        }
    }

    /**
     * 选中班级
     * @param classItem
     */
    selectClass(classItem) {
        this.currentItemGuid = classItem.guid;
        this.getStudents(classItem.guid, '1');
        this.getStudents(classItem.guid, '0');
    }

    /**
     * 签发证书
     * @param item
     */
    approvalCertificate(item) {
        this.nzModal.confirm({
            nzTitle: '确认',
            nzContent: '确认签发证书？',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.patch(this.httpUrl + '/certificate/teacher/' + item.guid, {
                    issuingReason: '',
                    issuingStatus: 1
                }).subscribe((res: any) => {
                    if (res.code === 1) {
                        this.msg.success('签发证书成功！');
                    } else {
                        this.msg.error(res.message);
                    }
                    this.getStudents(this.currentItemGuid, '1');
                    this.getStudents(this.currentItemGuid, '0');
                });
            }
        });
    }

    /**
     * 批量添加
     */
    batchIssueFun() {
        // this.nzModal.confirm({
        //     nzTitle: '确认',
        //     nzContent: '确认为选中的学生签发证书？',
        //     nzOkText: '确定',
        //     nzCancelText: '取消',
        //     nzOnOk: () => {
        //         this.http.patch(this.httpUrl + '/certificate/teacher/' + item.guid, {
        //             issuingReason: '',
        //             issuingStatus: 1
        //         }).subscribe((res: any) => {
        //             if (res.code === 1) {
        //                 this.msg.success('签发证书成功！');
        //             } else {
        //                 this.msg.error(res.message);
        //             }
        //             this.getStudents(this.currentItemGuid, '0');
        //         });
        //     }
        // });
    }

    /**
     * 拒绝提示框
     * @param item
     * @param nzContent
     * @param nzFooter
     */
    refuseCertificate(item, nzContent, nzFooter) {
        this.refuseModal = this.nzModal.create({
            nzTitle: '是否拒绝签发',
            nzContent: nzContent,
            nzFooter: nzFooter,
            nzOkText: '确定',
            nzCancelText: '取消'
        });
    }

    refuseOk(item) {
        this.refuseModal.close();
        this.http.patch(this.httpUrl + '/certificate/teacher/' + item.guid, {
            issuingReason: this.refuseReason,
            issuingStatus: 0
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('您已拒绝该学生的证书签发！');
                // 刷新
                this.getStudents(this.currentItemGuid, '0');
            }
        });
    }

    refuseCancel() {
        this.refuseModal.close();
    }

    // 全选功能
    checkAll(value: boolean) {
        this.notIssues.forEach(data => {
            if (data.exitCanIssuer === 1) {
                data['checked'] = value;
            }
        });
        this.refreshStatus();
    }

    refreshStatus(): void {
        const allChecked = this.notIssues.forEach(value =>
            value.checked === true
        );
        const allUnChecked = this.notIssues.forEach(value =>
            !value.checked
        );
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }
}
