import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.less']
})
export class TemplateComponent implements OnInit {

    httpUrl = environment.SERVER_URL + '/training';
    httpUrl_Fram = environment.UPLOADER_URL + environment.FILE_URL;
    // 证书模板图片src
    imgUrl;
    a;
    // 默认签章
    defaultSignature = null;
    validataForm: FormGroup;
    // 证书模板数组
    templates;
    // 页面加载等待
    loading = false;
    // 图片加载等待
    imgLoading = false;
    // 确认按钮等待状态
    confirmButtonLoading = false;
    fileId = '';
    tabSelectIndex = 0;
    tabs: any[] = [{
        key: 'template',
        tab: '设置证书模板',
    }];
    // 证书模板ID
    guid = '';
    // 签章样式
    signatureStyle;
    qiemobanid = '';
    templeId = '';
    // 文件上传模板guid 
    fileUploadTemplateGuid;
    @ViewChild('preview') preview: ElementRef;
    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private r2: Renderer2,
        private nzMessage: NzMessageService,
        private nzModal: NzModalService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) { }

    ngOnInit() {
        this.getTemplates();
        this.getSignatureStyle();
        this.validataForm = this.fb.group({
            fileId: [null, [Validators.required]]
        });
        // this.getDefaultSignature();
    }

    /**
     * 保存模板
     */
    saveTemplate() {
        this.templates.forEach(item => {
            if (this.fileId === item.fileId) {
                this.guid = item.guid;
            }
        }),
            this.http.put(this.httpUrl + 'service/training/enterpriseCertificate', {
                enterpriseGuid: this.tokenService.get().guid,
                guid: this.qiemobanid,
                templateGuid: this.guid,
                userId: this.tokenService.get().guid,
            }).subscribe((res: any) => {
                if (res.code === 0) {
                    this.nzMessage.success('设置成功！');
                    this.router.navigate(['/blockchain/certificate/index']);
                } else {
                    this.nzMessage.error(res.message);
                }
            });
    }
    /**
     * 通过canvas生成图片
     */
    generateImg(src: any) {
        this.imgLoading = true;
        this.imgUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + src;
        this.r2.setStyle(this.preview.nativeElement, 'border', '1px solid #000');
        const ctx = this.preview.nativeElement.getContext('2d');
        const img = this.r2.createElement('img');
        this.r2.setAttribute(img, 'src', this.imgUrl);
        // console.log(this.imgUrl);
        // this.r2.setAttribute(img, 'crossOrigin', 'Anonymous');
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 780, 551);
            this.imgLoading = false;
        };
    }
    getTraining() {
        this.loading = true;
        this.http.get(this.httpUrl + 'service/training/enterpriseCertificate', {
            params: {
                enterpriseGuid: this.tokenService.get().guid
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                if (res.data !== null || res.data !== '') {
                    this.qiemobanid = res.data.guid;
                    this.guid = res.data.templateGuid;
                    this.templates.forEach(element => {
                        if (res.data.templateGuid === element.guid) {
                            this.templeId = element.fileId;
                        }
                    });

                }
            } else {
                this.templates = [];
                this.nzMessage.error(res.message);
            }
            this.loading = false;
        });
    }
    /**
     * 获取证书模板数组
     */
    getTemplates() {
        this.loading = true;
        this.http.get(this.httpUrl + 'service/training/certificateTemplate').subscribe((res: any) => {
            if (res.code === 0) {
                this.templates = res.data;
                this.getTraining();
            } else {
                this.templates = [];
                this.nzMessage.error(res.message);
            }
            this.loading = false;
        });

    }
    /**
     * 获取模板对应的图片信息
     * @param templateId 业务id
     */
    getTemplateImgInfo(fileId: any): any {
        this.generateImg(fileId);
    }
    /**
     * 证书模板选择变化
     * @param value 
     */
    templateChange(value) {
        this.fileId = value;
        if (value) {
            this.getTemplateImgInfo(value);
        }
    }

    /**
     * 得到签章样式
     */
    getSignatureStyle() {
        this.http.get(this.httpUrl + 'service/training/signatureCss').subscribe((value: any) => {
            if (value.code === 0) {
                this.signatureStyle = value.data;
            }
        });
    }

}
