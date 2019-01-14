import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { error } from 'protractor';
import * as html2canvas from 'html2canvas';
declare let require: any;
const QRCode = require('qrcode');

@Component({
    selector: 'app-certificate-detail',
    templateUrl: './certificate-detail.component.html',
    styleUrls: ['./certificate-detail.component.less']
})
export class CertificateDetailComponent implements OnInit {
    httpUrl_Fram = environment.FRAMEWORK_URL + 'service';
    httpUrl = environment.SERVER_URL + '/training/';
    httpUrl3 = environment.SERVER_URL + '/training';
    // 切换列表(默认0显示班级列表，1为申请列表)
    changeList = 0;
    // 班级数据
    data = {
        name: ''
    };
    // 班级guid
    classGuid;
    /**学生列表 */
    studentList = [];
    // 申请列表
    applyList = [];
    // 异常列表
    exceptionList = [];
    // 等待加载
    loading = false;
    // 搜索
    showSearch = 0;
    searchKey = null;
    pageIndex = 1;
    pageSize = 20;
    pageTotal = 1;
    applyTotal = 0;
    exceptionTotal = 0;
    fileId = '';
    // 签发证书学生总计人数
    studentNum = 0;
    // 申请学员人数
    applyNum = 0;
    // 拒绝加入原因
    refuseReason;
    // 列表选择
    allChecked;
    indeterminate;
    // 签发状态
    issuingStatus = {
        '1': '签发成功',
        '0': '等待签发',
        '-1': '签发失败',
        '-2': '未签发',
        '3': '签发中'
    };
    // 模态框内预览canvas
    // @ViewChild('preview') preview: ElementRef;
    @ViewChild('downloadA') downloadA: ElementRef;
    // 模态框对象
    modal: NzModalRef;
    // 模态框加载状态
    modalLoading = false;
    modalsss = false;
    isVisible = false;
    // 模板列表
    templates = [];
    // 莫版id
    templeId = '';
    sizeye: any = 10000;
    indexye: any = 1;
    tips = '0';
    canvasImg = '';
    backgroundurl = '';
    background = {
        'background-image': 'url(./assets/img/zhengshumoban.jpg)',
    };
    templateFileId = ''; // 背景图id
    qrCode = ''; // 二维码地址
    // 用户id
    userID = '';
    // 需要签发的学生数据
    studentData: any = [];
    content = '';
    issuingAgency = '';
    issuingDate = '';
    secondContent = '';
    title = '';
    businessGuid = '';
    // 班级学生数据
    dataclass: any = [];
    // 测试生成图片地址
    thisimg = [];
    idsss: any;
    // 文件上传模板guid 
    fileUploadTemplateGuid;
    // 图片
    imgUrl;
    // 文件id
    imgFileGuid;
    constructor(
        private http: HttpClient,
        private nzModal: NzModalService,
        private nzMessage: NzMessageService,
        private activatedRoute: ActivatedRoute,
        private r2: Renderer2,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {
        this.classGuid = this.activatedRoute.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        if (this.tokenService.get().type === 1) {
            this.userID = this.tokenService.get().guid;
        } else {
            this.userID = this.tokenService.get().userId;
        }
        this.getStudent();
        this.getData();
    }
    /**
     * 得到班级详情
     * @param  
     */
    getData() {
        this.loading = true;
        this.http.get(this.httpUrl + 'service/training/classes/' + this.classGuid).subscribe((value: any) => {
            if (value.code === 0) {
                this.data.name = value.data.name;
                // this.getStudent(this.data['guid']);
                this.getApplyList(this.classGuid);
            }
            this.loading = false;
        });
    }

    pageChange(i) {
        if (i === 0) {
            return;
        } else {
            this.pageIndex = i;
            if (this.changeList === 0) {
                this.getStudent();
            } else {
                this.getApplyList(this.classGuid);
            }
        }
    }
    /**
     * 得到班级下的学生列表
     */
    getStudent() {
        this.loading = true;
        this.http.get(this.httpUrl + 'service/training/student', {
            params: {
                key: this.searchKey ? this.searchKey : '',
                classesGuid: this.classGuid,
                pageNum: this.pageIndex + '',
                pageSize: this.pageSize + ''
            }
        }).subscribe((value: any) => {
            if (value.code === 0) {
                this.studentList = value.data;
                this.pageTotal = value.total;
            }
            this.loading = false;
            this.refreshStatus();
        });
    }
    /**
     * 获取申请列表
     */
    getApplyList(classGuid: any) {
        this.loading = true;
        this.http.get(this.httpUrl + 'service/training/student/waitJoin', {
            params: {
                key: this.searchKey ? this.searchKey : '',
                classesGuid: classGuid,
                pageNum: this.pageIndex + '',
                pageSize: this.pageSize + ''
            }
        }).subscribe((value: any) => {
            if (value.code === 0) {
                this.applyList = value.data;
                this.pageTotal = value.total;
                this.applyTotal = value.total;
            }
            this.loading = false;
            this.refreshStatus();
        });
    }
    // 获取异常列表
    getExceptionList(classGuid: any) {
        this.loading = true;
        this.exceptionTotal = 0;
        this.loading = false;
    }
    // 预览证书
    preview(certificateFileId) {
        this.modalsss = true;
        this.imgUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + certificateFileId; // 去获取背景图
        this.fileId = certificateFileId;
    }
    previewHandle() {
        this.modalsss = false;
    }
    previewOk() {
        this.modalsss = false;
    }
    /**
     * 允许加入
     */
    join(item) {
        this.nzModal.confirm({
            nzTitle: '确定加入',
            nzContent: '确定加入该学生？',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.patch(this.httpUrl + 'service/training/student/review/' + item.guid + '?userId=' + this.userID + '&enterpriseId=' + this.tokenService.get().guid, {
                    guids: [item.guid],
                    applyJoinStatus: 1,
                }).subscribe((value: any) => {
                    if (value.code === 0) {
                        this.nzMessage.success('成功加入该学员！');
                        this.getApplyList(this.classGuid);
                    } else {
                        this.nzMessage.error(value.message);
                    }
                });
            }
        });
    }
    // 拒绝模态框
    refuseModal: NzModalRef;
    /**
     * 拒绝
     */
    refuse(item, refuseModalContent, refuseModalFooter) {
        this.refuseModal = this.nzModal.create({
            nzTitle: '拒绝该学生申请',
            nzContent: refuseModalContent,
            nzFooter: refuseModalFooter,
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: this.refuseOk
        });
    }
    refuseOk = (item) => {
        this.refuseModal.close();
        this.http.patch(this.httpUrl + 'service/training/student/review/' + item.guid + '?userId=' + this.userID + '&enterpriseId=' + this.tokenService.get().guid, {
            'applyJoinReason': this.refuseReason,
            'applyJoinStatus': -1,
            guids: [item.guid]
        }).subscribe((value: any) => {
            if (value.code === 0) {
                this.nzMessage.success('已拒绝该学生！');
                this.refuseReason = '';
            } else {
                this.nzMessage.error(value.message);
            }
            this.getApplyList(this.classGuid);
        });
    }
    refuseCancel() {
        this.refuseModal.close();
    }

    // 查询u模板
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
    templateChange(templeId) {
        this.templates.forEach(value => { // 比对模板背景图id
            if (value.guid === templeId) {
                this.templateFileId = value.templateFileId;
            }
        });
        this.backgroundurl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + this.templateFileId; // 去获取背景图
        this.tips = '0';
    }
    /**
     * 批量签发证书
     */
    batchIssue() {

        const students = [];
        this.studentNum = 0;
        this.studentList.forEach((value: any) => {
            if (value.issuingStatus !== -1 || value.issuingStatus !== -2) {
                if (value['checked']) {
                    students.push(value.guid);
                    this.studentNum++;
                }
            }
        });
        if (this.studentNum === 0 || students.length === 0) {
            this.nzMessage.info('请选择要签发的学员！');
            return false;
        }
        this._getTemplateList();
        this.isVisible = true;
        this.dataclass.push({
            classGuid: this.classGuid,
            students: students
        });
        // console.log(this.dataclass);

    }


    qianfaok(): void {
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
                    this.dataclass = res.data.hrmCertificateTemplateDataVOs;
                    // console.log(this.dataclass);
                    this.dataclass.forEach(value => {
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

    qianfaCancel(): void {
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
                this.thisimg.push(this.canvasImg);
                // console.log(this.thisimg);
                // console.log(businessGuid);
                const form = new FormData();
                form.append('fileBase64', this.canvasImg);
                form.append('loginEid', this.tokenService.get().guid);
                form.append('escrowType', 'TRAINING_CERTIFICATE');
                form.append('loginUid', this.userID);
                form.append('businessGuid', businessGuid);
                this.http.post(environment.UPLOADER_URL + environment.FILE_URL + 'service/files/base64', form).subscribe((res: any) => {
                    if (res.code === 0) {
                        this.nzMessage.remove(this.idsss);
                        this.getStudent();
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
     * 批量加入
     */
    batchJoin(applyModalContent) {
        const students = [];
        this.applyNum = 0;
        this.applyList.forEach((value: any) => {
            if (value['checked']) {
                students.push(value.guid);
                this.applyNum++;
            }
        });
        if (this.applyNum === 0) {
            this.nzMessage.info('请选择要加入的学员！');
            return false;
        }
        this.nzModal.confirm({
            nzTitle: '确认批量加入班级',
            nzContent: applyModalContent,
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.patch(this.httpUrl + 'service/training/student/review/' + students[0] + '?userId=' + this.userID + '&enterpriseId=' + this.tokenService.get().guid, {
                    applyJoinStatus: 1,
                    guids: students
                }).subscribe((res: any) => {
                    if (res.code === 0) {
                        this.nzMessage.success('批量加入成功！');
                    } else {
                        this.nzMessage.error(res.message);
                    }
                    this.getApplyList(this.classGuid);
                });
            }
        });
    }
    /**
     * 移除学生
     * @param item 
     */
    removeStudent(item) {
        this.nzModal.confirm({
            nzTitle: '移除学生',
            nzContent: '是否移除当前学生？',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.delete(this.httpUrl + 'service/training/student/' + item.guid).subscribe((res: any) => {
                    if (res.code === 0) {
                        this.nzMessage.success('已移除当前学生！');
                    }
                    this.getStudent();
                });
            },
        });
    }
    changeListShow(value) {
        this.pageIndex = 1;
        if (value.index === 0) {
            this.changeList = 0;
            this.getStudent();
        } else {
            this.changeList = 1;
            this.getApplyList(this.classGuid);
        }
        this.refreshStatus();
    }
    checkAll(value: boolean) {
        if (this.changeList === 0) {
            this.studentList.forEach(data => {
                // 如果状态不为-1、-2则不能选择
                if (data.issuingStatus !== -1 && data.issuingStatus !== -2) {
                    return;
                } else {
                    data.checked = value;
                }
            });
        } else {
            this.applyList.forEach(data => data.checked = value);
        }
        this.refreshStatus();
    }
    refreshStatus(): void {
        let allChecked = null;
        let allUnChecked = null;
        if (this.changeList === 0) {
            this.studentList.forEach(value => {
                if (value.issuingStatus === -1 || value.issuingStatus === -2) {
                    if (allChecked === null) {
                        allChecked = true;
                    }
                    allChecked = allChecked && (value.checked === true);
                }
            });
            this.studentList.forEach(value => {
                if (value.issuingStatus === -1 || value.issuingStatus === -2) {
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
        } else {
            allChecked = this.applyList.every(value => value.checked === true);
            allUnChecked = this.applyList.every(value => !value.checked);
        }
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }
    /**
     * 下载证书
     */
    downloadCertificate() {
        location.href = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + this.fileId;
    }
}
