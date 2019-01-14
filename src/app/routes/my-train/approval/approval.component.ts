

import { Component, OnInit, Inject, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-approval',
    templateUrl: 'approval.component.html',
    styleUrls: ['./approval.component.less']
})

export class ApprovalComponent implements OnInit {
    httpUrl = environment.HRM_URL + 'service';
    httpUrl_Fram = environment.FRAMEWORK_URL + 'service';
    loading = false;
    showSearch = 0;
    searchKey;

    dataList;
    // 分页相关
    pageTotal = 0;
    pageNum = 1;
    pageSize = 20;
    // 签发状态
    issueState = {
        '1': '证书已签发', // 两边都签发
        '2': '等待另一端签发', // 学生已签发，学校段未签发
        '3': '待签发', // 学校端已签发，学生未签发
        '-1': '签发失败', //
        '-2': '未签发', // 没发起
        '0': '等待签发' // 已发起，但是两边都没签发
    };
    // 拒绝原因
    refuseReason;
    // 预览图
    previewImgSrc;
    // 文件上传模板guid 
    fileUploadTemplateGuid;
    // 证书guid
    currentPreviewCertificateGuid;
    @ViewChild('previewDiv')
    previewDiv: ElementRef;
    // 当前弹出窗所指的证书
    currentCertificateItem;
    // 文件id
    imgFileGuid;
    constructor(
        private http: HttpClient,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private nzModal: NzModalService,
        private msg: NzMessageService,
        private render: Renderer2
    ) { }

    ngOnInit() {
        this.pageChange(1);
    }

    pageChange(i) {
        if (i === 0) {
            return;
        } else {
            this.pageNum = i;
        }
        this.loading = true;
        this.http.get(this.httpUrl + '/certificate/user', {
            params: {
                userGuid: this.tokenService.get().userGuid,
                pageNum: this.pageNum + '',
                pageSize: this.pageSize + ''
            }
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.dataList = res.data;
                this.pageTotal = res.total;
            } else {
                this.dataList = [];
            }
            this.loading = false;
        });
    }
    /**
     * 预览
     * @param content 
     */
    preview(content, item) {
        this.currentPreviewCertificateGuid = item.guid;
        this.getFileUploadTemplateGuid(item.guid);
        this.nzModal.create({
            nzTitle: '证书预览',
            nzContent: content,
            nzOkText: '确定',
            nzCancelText: '取消',
            nzWidth: 748,
            nzOnOk: () => { },
            nzOnCancel: () => {}
        });
    }
    /**
     * 下载证书
     */
    downloadCertificate() {
        const a: HTMLElement = this.render.createElement('a');
        this.render.setAttribute(a, 'href', environment.SERVER_URL + this.httpUrl_Fram + '/file/download/'
         + this.imgFileGuid + '?access_token=' + this.tokenService.get().token);
        this.render.setAttribute(a, 'target', '_blank');
        this.render.setStyle(a, 'display', 'none');
        this.render.appendChild(this.previewDiv.nativeElement, a);
        a.click();
    }

    /**
   * 获取上传文件模版的guid
   * @param bsid 业务id
   */
    getFileUploadTemplateGuid(bsid) {
        if (!this.fileUploadTemplateGuid) {
            this.http.get(this.httpUrl_Fram + '/file-tags/template').subscribe((res: any) => {
                if (res.code === 1) {
                    if (res.data.length > 0) {
                        this.fileUploadTemplateGuid = res.data[0].guid;
                        this.getTemplateImgInfo(bsid);
                    } else {
                        this.msg.error('获取模板信息失败！');
                    }
                } else {
                    this.msg.error(res.message);
                }
            });
        } else {
            this.getTemplateImgInfo(bsid);
        }
    }
    /**
     * 获取模板对应的图片信息
     * @param templateId 业务id
     */
    getTemplateImgInfo(templateId: any): any {
        this.http.get(this.httpUrl_Fram + '/file/get-file/' + templateId + '/' + this.fileUploadTemplateGuid).subscribe((res: any) => {
            if (res.code === 1) {
                if (res.data['guid']) {
                    this.imgFileGuid = res.data.guid;
                    this.previewImgSrc = environment.SERVER_URL + this.httpUrl_Fram + '/file/' + res.data.guid  + '?access_token=' + this.tokenService.get().token;
                    // this.generateImg(this.httpUrl_Fram + '/file/' + res.data.guid);
                } else {
                    this.msg.error('图片获取失败！');
                }
            } else {
                this.msg.error(res.message);
            }
        });
    }
    // 确认签发模态框
    confirmModal: NzModalRef;
    /**
     * 确定
     * @param content 
     * @param refuseModalContent 
     */
    confirm(content, footer, item) {
        this.currentCertificateItem = item;
        this.getFileUploadTemplateGuid(item.guid);
        this.confirmModal = this.nzModal.create({
            nzTitle: '证书签发存证',
            nzContent: content,
            nzFooter: footer,
            nzWidth: 748
            // nzOkText: '确定',
            // nzCancelText: '拒绝',
            // nzOnOk: () => {
                // this.issueCertificate(item, 1);
            // },
            // nzOnCancel: () => {
                
            // }
        });
    }
    /**
     * 拒绝证书
     * @param item 当前证书item
     * @param refuseModalContent 拒绝模态框content 
     */
    refuseCertificate(item, refuseModalContent) {
        this.confirmModal.close();
        this.nzModal.create({
            nzTitle: '拒绝原因',
            nzContent: refuseModalContent,
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.issueCertificate(item, 0);
            }
        });
    }
    /**
     * 签发证书
     * @param item 证书item 
     * @param isIssue 1： 签发 0： 拒绝
     */
    issueCertificate(item, isIssue: number) {
        this.confirmModal.close();
        this.loading = true;
        this.http.patch(this.httpUrl + '/certificate/student/' + item.guid, {
            issuingStatus: isIssue,
            issuingReason: this.refuseReason
        }).subscribe((res: any) => {
            if (res.code === 1) {
                if (isIssue) {
                    this.msg.success('证书签发成功！');
                } else {
                    this.msg.success('已拒绝签发！');
                }
            } else {
                this.msg.error(res.message);
            }
            this.pageChange(1);
            this.loading = false;
        }, (error) => {
            this.loading = false;
        });
    }
}
