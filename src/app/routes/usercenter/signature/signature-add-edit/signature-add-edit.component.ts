import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-signature-add-edit',
    templateUrl: './signature-add-edit.component.html',
    styleUrls: ['./signature-add-edit.component.less']
})
export class SignatureAddEditComponent implements OnInit {

    httpUrl = environment.HRM_URL + 'service/signature';
    // 样式列表
    signatureStyles;
    // 编辑时详情
    editDetail;
    // 新增或编辑
    addOrEdit = '';
    // 标题
    title;
    validataForm: FormGroup = null;
    tabs: any[];
    tabSelectIndex = 0;
    // 保存确认等待状态
    confirmButtonLoading = false;
    constructor(
        private http: HttpClient,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private nzMessage: NzMessageService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private router: Router
    ) { }

    ngOnInit() {
        this.getSignatureStyles();
        this.validataForm = this.fb.group({
            signatureName: ['', [Validators.required]],
            signatureContent: ['', [Validators.required]],
            signatureCss: ['', [Validators.required]]
        });
        if (this.activatedRoute.routeConfig.path.includes('add')) {
            this.addOrEdit = '新增';
        } else {
            this.addOrEdit = '编辑';
            this.getSignatureDetail();

        }
        this.title = `${this.addOrEdit}电子签章`;
        this.tabs = [{
            key: '',
            tab: `${this.addOrEdit}`,
        }];
    }
    /**
     * 得到样式
     */
    getSignatureStyles() {
        this.http.get(this.httpUrl + '-css').subscribe((res: any) => {
            if (res.code === 1) {
                this.signatureStyles = res.data;
            }
        });
    }
    /**
     * 得到样式详情
     */
    getSignatureDetail() {
        this.activatedRoute.paramMap.pipe(
            switchMap((params: ParamMap) => {
                return this.http.get(this.httpUrl + '/' + params.get('id'));
            })
        ).subscribe((res: any) => {
            if (res.code === 1) {
                this.editDetail = res.data;
                // this.validataForm.setValue({
                //     signatureName: this.editDetail.signatureName,
                //     signatureContent: this.editDetail.signatureContent,
                //     signatureCss: this.editDetail.signatureCss
                // });
                this.validataForm = this.fb.group({
                    signatureName: [this.editDetail.signatureName, [Validators.required]],
                    signatureContent: [this.editDetail.signatureContent, [Validators.required]],
                    signatureCss: [this.editDetail.signatureCss, [Validators.required]]
                });
            }
        });
    }
    save() {
        this.confirmButtonLoading = true;
        let url = this.httpUrl;
        if (this.addOrEdit !== '新增') {
            url = url + '/' + this.editDetail.guid;
        }
        this.http.post(url, {
            'enterpriseGuid': this.tokenService.get().enterprisesInfo.enterprisesId,
            'signatureContent': this.validataForm.value.signatureContent,
            'signatureCss': this.validataForm.value.signatureCss,
            'signatureName': this.validataForm.value.signatureName,
            'userGuid': this.tokenService.get().userGuid
        }).subscribe((res: any) => {
            this.confirmButtonLoading = false;
            if (res.code === 1) {
                this.nzMessage.success('保存成功！');
                this.router.navigate(['/usercenter/signature']);
            }
        }, (error) => {
            this.nzMessage.error('出错了，保存失败！');
            this.confirmButtonLoading = false;
        });
    }
}
