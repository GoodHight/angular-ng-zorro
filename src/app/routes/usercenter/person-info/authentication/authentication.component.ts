import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpParams, HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.less']
})
export class AuthenticationComponent implements OnInit {
    httpUrl_framework = environment.FRAMEWORK_URL + 'service/user';
    loading = false;
    // 步骤
    step = 0;
    // 第一步验证表单
    step1Form: FormGroup;
    step1IsOk = false;
    // 编辑状态下传递UUID号
    userGuid;
    @ViewChild('fileTemplate1') fileTemplate1: FileTemplateComponent;
    @ViewChild('fileTemplate2') fileTemplate2: FileTemplateComponent;
    // 用户实名认证等级
    auth_level;

    fileImg1UploadId = [];
    fileImg2UploadId = [];
    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private msg: NzMessageService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {
    }

    ngOnInit() {
        this.step1Form = this.fb.group({
            realName: [null, [Validators.required]],
            idCardNumber: [null, [Validators.required]]
        });
        this.userGuid = this.tokenService.get().userGuid;
        this.getUserAuthLevel();
    }
    /**
     * 得到用户认证等级
     */
    getUserAuthLevel() {
        this.loading = true;
        this.http.get(this.httpUrl_framework + '/level/' + this.tokenService.get().userGuid).subscribe((value: any) => {
            if (value.code === 1) {
                this.auth_level = value.data;
                if (this.auth_level === 'LNULL') {
                    this.step = 1;
                } else if (this.auth_level === 'L0') {
                    this.step = 2;
                } else {
                    this.step = 4;
                }
            } else {
                this.msg.error(value.data);
            }
            this.loading = false;
        }, (error: any) => {
            this.loading = false;
        });
    }
    /**
     * 下一步
     */
    next() {
        if (this.step === 1) {
            if (!this.step1IsOk) {
                this.authenticationL0(true);
            } else {
                this.step ++;
            }
            return;
        } 
        if (this.step === 2) {
            this.authenticationL1A(true);
            return;
        }
    }
    confirm() {
        if (this.step === 1) {
            this.authenticationL0(false);
        } else {
            this.authenticationL1B();
        }
    }
    /**
     * l0 认证
     */
    authenticationL0(isNext?: boolean) {
        this.loading = true;
        this.http.patch(this.httpUrl_framework + '/l0/' + this.userGuid, {
            idCardNumber: this.step1Form.value.idCardNumber,
            realName: this.step1Form.value.realName
        }).subscribe((value: any) => {
            if (value.code === 1) {
                this.msg.success('信息提交成功！');
                this.step1IsOk = true;
                if (isNext) {
                    this.step++;
                }
            } else {
                this.msg.error(value.message);
            }
            this.loading = false;
        });
    }
    /**
     * l1认证-a 步骤
     */
    authenticationL1A(isNext?: boolean) {
        if (!this.fileTemplate1.ready) {
            this.msg.error('上传图片错误，请刷新页面后重新上传！');
            return false;
        }
        this.fileImg1UploadId = [];

        this.fileTemplate1.updataFileID.forEach((value: any) => {
            this.fileImg1UploadId.push(value);
        });
        this.loading = true;
        this.http.patch(this.httpUrl_framework + '/l1/a/' + this.userGuid, {
            'idCardBackId': this.fileImg1UploadId[0],
            'idCardFrontId': this.fileImg1UploadId[1]
        }).subscribe((value: any) => {
            // console.log(value);
            if (value.code === 1) {
                this.msg.success('提交成功！');
                if (isNext) {
                    this.step++;
                }
            } else {
                this.msg.error(value.message);
            }
            this.loading = false;
        });
    }
    /**
     * l1认证-b 步骤
     */
    authenticationL1B() {
        if (!this.fileTemplate2.ready) {
            this.msg.error('上传图片错误，请刷新页面后重新上传！');
            return false;
        }
        this.fileImg2UploadId = [];
        this.fileTemplate2.updataFileID.forEach((value: any) => {
            this.fileImg2UploadId.push(value);
        });
        this.loading = true;
        this.http.patch(this.httpUrl_framework + '/l1/b/' + this.userGuid, {
            'handIdCardId': this.fileImg2UploadId[0],
            'idCardBackId': this.fileImg1UploadId[0],
            'idCardFrontId': this.fileImg1UploadId[1]
        }).subscribe((value: any) => {
            if (value.code === 1) {
                this.msg.success('提交成功！');
                this.step ++;
            } else {
                this.msg.error(value.message);
            }
            this.loading = false;
        });
    }
    /**
     * 确认当前步骤确认按钮是否能点击
     */
    confirmIsDisabled() {
        return !(this.step === 1 && this.step1Form.valid ||
            this.step === 2 && this.fileTemplate1 && this.fileTemplate1.ready ||
            this.step === 3 && this.fileTemplate2 && this.fileTemplate2.ready);
    }
}
