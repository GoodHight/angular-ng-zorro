import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import * as html2canvas from 'html2canvas';
declare let require: any;
const QRCode = require('qrcode');

@Component({
    selector: 'app-certificate-list',
    templateUrl: './certificate-list.component.html',
    styleUrls: ['./certificate-list.component.less']
})
export class CertificateListComponent implements OnInit {

    httpUrl = environment.SERVER_URL + '/training/service/training/classes';
    httpUrl2 = environment.SERVER_URL + '/training/service/training/certificate';
    httpUrl3 = environment.SERVER_URL + '/training';
    isVisible = false;
    qrCode = '';
    idsss: any;
    // 数据
    dataList = [];
    // 加载等待
    loading = false;
    // 展示搜索框，默认为0不展示
    showSearch = 0;
    // 初始搜索条件
    searchObj = {
        searchKey: '',
        pageIndex: 1,
        pageSize: 20
    };
    // 总页数
    pageTotal = 0;
    // 列表选择
    allChecked;
    indeterminate;
    // 模板列表
    templates = [];
    // 莫版id
    templeId = '';
    sizeye: any = 10000;
    indexye: any = 1;
    // 班级学生数据
    dataclass: any = [];
    // 用户id
    userID = '';
    // 将要添加的班级数组
    batchArr = [];
    // 测试生成图片地址
    // thisimg = [];
    // 学生总计人数
    studentNum = 0;
    tips = '0';
    canvasImg = '';
    backgroundurl = '';
    background = {
        'background-image': 'url(./assets/img/zhengshumoban.jpg)',
    };
    templateFileId = ''; // 背景图id
    // 需要签发的学生数据
    studentList: any = [];
    content = '';
    issuingAgency = '';
    issuingDate = '';
    secondContent = '';
    title = '';
    businessGuid = '';
    constructor(private http: HttpClient,
        private router: Router,
        private nzModal: NzModalService,
        private nzMessage: NzMessageService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    }

    ngOnInit() {
        if (this.tokenService.get().type === 1) {
            this.userID = this.tokenService.get().guid;
        } else {
            this.userID = this.tokenService.get().userId;
        }
        this.pageChange(1);
    }

    pageChange($event?: any) {
        if ($event === 0) {
            return;
        } else {
            this.searchObj.pageIndex = $event;
        }
        this._getDataList();
    }
    // 查询列表
    _getDataList() {
        this.loading = true;
        this.http.get(this.httpUrl, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: {
                enterpriseGuid: this.tokenService.get().guid,
                key: this.searchObj.searchKey,
                pageNum: this.searchObj.pageIndex + '',
                pageSize: this.searchObj.pageSize + ''
            }
        }).subscribe((data: any) => {
            if (data.code === 0) {
                this.dataList = data.data;
                this.pageTotal = data.total;
            }
            this.loading = false;
            this.refreshStatus();
        });
    }

    /**
     * 去班级详情页
     * @param item
     */
    gotoDetail(item) {
        this.router.navigate(['/blockchain/certificate/index/' + item.guid]);
    }


    // 查询莫版
    _getTemplateList() {
        this.loading = true;
        this.http.get(this.httpUrl3 + '/service/training/hrm', {
            params: {
                enterpriseGuid: this.tokenService.get().guid,
                pageNum: this.indexye,
                pageSize: this.sizeye
            }
        }).subscribe((data: any) => {
            if (data.code === 0) {
                this.templates = data.data;
            } else {
                this.nzMessage.error(data.message);

            }
            this.loading = false;
        });
    }

    /**
     * 批量签发证书
     */
    batchIssue() {
        const data = [];
        this.studentNum = 0;
        this.batchArr = [];
        this.dataList.forEach((value: any) => {
            if (value['checked']) {
                data.push({
                    classGuid: value.guid,
                    students: []
                });
                this.dataclass = data;
                this.batchArr.push(value);
                this.studentNum += value.studentNumber;
            }
        });
        if (this.batchArr.length === 0) {
            this.nzMessage.info('请选择要签发的班级！');
            return false;
        }
        this.isVisible = true;
        this._getTemplateList();
    }
    templateChange(templeId) {
        this.templates.forEach(value => { // 比对模板背景图id
            if (value.guid === templeId) {
                this.templateFileId = value.templateFileId;
            }
        });
        this.backgroundurl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + this.templateFileId; // 去获取背景图
        this.tips = '0';
    }
    handleOk(): void {
        if (this.templeId === '') {
            this.tips = '1';
        } else {
            this.http.post(this.httpUrl3 + '/service/training/certificate', {
                data: this.dataclass,
                enterpriseGuid: this.tokenService.get().guid,
                templateId: this.templeId,
                userGuid: this.userID,
            }).subscribe((res: any) => {
                if (res.code === 0) {
                    this.isVisible = false;
                    this.studentList = res.data.hrmCertificateTemplateDataVOs;
                    this.studentList.forEach(value => {
                        setTimeout(() => {
                            this.content = value.content;
                            this.issuingAgency = value.issuingAgency;
                            this.issuingDate = value.issuingDate;
                            this.qrCode = value.qrCode;
                            this.secondContent = value.secondContent;
                            this.title = value.title;
                            this.businessGuid = value.businessGuid;
                            this.erweima();
                        }, 1000);
                        this.getCertificate(value.businessGuid);
                    });
                    this.idsss = this.nzMessage.loading('证书生成中...', { nzDuration: 0 }).messageId;
                } else {
                    this.nzMessage.error(res.message);
                    this.loading = false;
                    this.isVisible = false;
                }
            });
        }

    }

    handleCancel(): void {
        this.templeId = '';
        this.isVisible = false;
    }

    getCertificate(businessGuid) { // 生成图片
        const backgroundurl = 'url(' + this.backgroundurl + ')';
        this.background = {
            'background-image': backgroundurl,
        };
        setTimeout(() => {
            this.canvasImg = '';
            html2canvas(document.querySelector('#capture'), { useCORS: true }).then(canvas => {
                this.canvasImg = canvas.toDataURL('image/png');
                // this.thisimg.push(this.canvasImg);
                // // console.log(this.thisimg);
                const form = new FormData();
                form.append('fileBase64', this.canvasImg);
                form.append('loginEid', this.tokenService.get().guid);
                form.append('escrowType', 'TRAINING_CERTIFICATE');
                form.append('loginUid', this.userID);
                form.append('businessGuid', businessGuid);
                this.http.post(environment.UPLOADER_URL + environment.FILE_URL + 'service/files/base64', form).subscribe((res: any) => {
                    if (res.code === 0) {
                        this.nzMessage.remove(this.idsss);
                        this.pageChange(1);
                    } else {
                        this.nzMessage.error(res.message);
                        this.loading = false;
                    }
                });
            });
        }, 1000);
    }

    erweima() { // 生成二维码
        const opts = {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            margin: 1,
            rendererOpts: {
                quality: 0.3,
            }
        };

        QRCode.toDataURL(this.qrCode, opts, function (err, url) {
            if (err) {
                throw err;
            }
            // console.log(url);
            const img = document.getElementById('image');
            img['src'] = url;
        });

    }
    /**
     * 去编辑页面
     * @param item
     */
    editClass(item) {
        if (item.issuedNumber > 0) {
            this.nzMessage.error('该班级已签发证书，无法编辑!');
        } else {
            this.router.navigate(['/blockchain/certificate/index/edit/' + item.guid, { status: 'edit' }]);
        }
    }

    /**
     * 删除
     * @param item
     */
    deleteClass(item) {
        if (item.studentNumber > 0) {
            this.nzMessage.error('该班级已加入学生，无法删除!');
        } else {
            this.nzModal.confirm({
                nzContent: '是否删除并解散该班级？',
                nzOkText: '确定',
                nzOnOk: () => {
                    this.http.delete(this.httpUrl + '/' + item.guid).subscribe((data: any) => {
                        if (data.code === 0) {
                            this.nzMessage.success('删除成功！');
                            this.pageChange(1);
                        }
                    });
                },
                nzCancelText: '取消'
            });
        }
    }

    // 全选功能
    checkAll(value: boolean) {
        this.dataList.forEach(data => {
            if (data.exitCanIssuer === 1) {
                data['checked'] = value;
            }
        });
        this.refreshStatus();
    }

    refreshStatus(): void {
        let allChecked = null;
        this.dataList.forEach(value => {
            if (value.exitCanIssuer === 1) {
                if (allChecked === null) {
                    allChecked = true;
                }
                allChecked = allChecked && (value.checked === true);
            }
        });
        let allUnChecked = null;
        this.dataList.forEach(value => {
            if (value.exitCanIssuer === 1) {
                if (allUnChecked === null) {
                    allUnChecked = true;
                }
                allUnChecked = allUnChecked && !value.checked;
            }
        });
        if (allChecked === null) {
            allChecked = false;
        }
        if (allUnChecked === null) {
            allUnChecked = true;
        }
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }
}
