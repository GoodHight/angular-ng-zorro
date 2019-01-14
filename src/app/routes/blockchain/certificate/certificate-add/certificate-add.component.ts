import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-certificate-add',
    templateUrl: './certificate-add.component.html',
})
export class CertificateAddComponent implements OnInit {
    httpUrl = environment.SERVER_URL + '/training/service/training/classes/';
    httpUrl2 = environment.SERVER_URL + '/training/service/training/classes';
    deptUrl = environment.SERVER_URL + environment.ENTERPRISE_URL;
    // 页面数据加载等待
    loading;
    // 确认按钮等待状态
    confirmButtonLoading = false;
    editData;
    peoplelits = [];
    // 标题文本
    titleText = '';
    dateFormat: 'yyyyMMdd';
    routerOrigin;

    validateForm: FormGroup;

    constructor(
        private http: HttpClient, private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private nzMessage: NzMessageService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) { }

    ngOnInit() {
        this.getpeople();
        this._setValidateForm();
        this.routerOrigin = this.activatedRoute.snapshot.paramMap.get('status');
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (this.routerOrigin === 'edit') {
            this.getClass(id);
            this.titleText = '编辑';
        } else {
            this.titleText = '创建';
        }
    }
    /**
     * 将yyyyMMdd格式字符串转换为时间
     * @param str 
     */
    stringTransformDate(str: string): Date {
        str = str.replace(/[^0-9]*/g, '');
        let year = '',
            month = '',
            day = '';
        if (str.length >= 8) {
            year = str.substring(0, 4);
            month = str.substring(4, 6);
            day = str.substring(6, 8);
            return new Date(year + '-' + month + '-' + day);
        } else {
            return new Date();
        }
    }

    getClass(id: any) {
        this.loading = true;
        this.http.get(this.httpUrl + id).subscribe((value: any) => {
            if (value.code === 0) {
                this.editData = value.data;
                this.validateForm.setValue({
                    name: this.editData.name,
                    major: this.editData.major,
                    rangeTime: [this.stringTransformDate(this.editData.startTime), this.stringTransformDate(this.editData.endTime)],
                    tutorName: this.editData.tutorName,
                    // signerGuid: '',
                    introduction: this.editData.introduction
                });
            }
            this.loading = false;
        }, () => {
            this.loading = false;
        });
    }
    getpeople() {
        this.http.get(this.deptUrl + 'service/employee/enterprise', {
            params: {
                enterpriseGuid: this.tokenService.get().guid
            }
        })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.peoplelits = res.data;
                } else {
                    this.nzMessage.error(res.message);
                    this.loading = false;
                }
            });
    }
    _setValidateForm() {
        this.validateForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(4)]],
            major: ['', [Validators.required]],
            rangeTime: [[], [Validators.required]],
            tutorName: ['', [Validators.required]],
            introduction: ['', [Validators.maxLength(200)]]
        });
    }
    /**
     * 将时间转换为 yyyyMMdd格式的字符串返回
     * @param date 
     */
    dateTransformString(date: Date): string {
        const year = date.getFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getDate();
        return '' + year + (month < 10 ? '0' + month : month) + (day < 10 ? '0' + day : day) + '000000';
    }

    save() {
        this.loading = true;
        const obj = JSON.parse(JSON.stringify(this.validateForm.value));
        obj['enterpriseName'] = this.tokenService.get().name;
        obj['userId'] = this.tokenService.get().guid;
        obj['enterpriseGuid'] = this.tokenService.get().guid;
        delete(obj['rangeTime']);
        const startTime = new Date(this.validateForm.value.rangeTime[0]);
        obj['startTime'] = this.dateTransformString(startTime);
        const endTime = new Date(this.validateForm.value.rangeTime[1]);
        obj['endTime'] = this.dateTransformString(endTime);
        if (this.routerOrigin === 'edit') {
            obj['guid'] = this.editData.guid;
        }
        this.http.post(this.httpUrl2, obj).subscribe((value: any) => {
            if (value.code === 0) {
                if (this.routerOrigin === 'edit') {
                    this.nzMessage.success('修改成功！');
                } else {
                    this.nzMessage.success('新增成功！');
                }
                this.cancel();
            } else {
                this.nzMessage.error(value.message);
            }
            this.loading = false;
        });
    }

    cancel() {
        this.router.navigate(['/blockchain/certificate/index']);
    }
}
