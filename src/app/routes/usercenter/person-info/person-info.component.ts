import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { UploadFile, NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-person-info',
    templateUrl: './person-info.component.html',
    styleUrls: ['./person-info.component.less']
})
export class PersonInfoComponent implements OnInit {

    httpUrl = environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/user/';

    personInfo;


    loading = false;
    // 是否认证
    isAuthentication;
    // avatarUrl = '';
    // 编辑Content
    @ViewChild('editContent') editTemplate: TemplateRef<any>;
    @ViewChild('modalFooter') modalFooter: TemplateRef<any>;
    // 表单验证
    validataForm: FormGroup;
    // 表单显示key
    formShowKey;
    // 模态框
    modal: NzModalRef;
    // 模态框确认按钮等待状态
    isOkLoading = false;
    constructor(
        private http: HttpClient,
        private msg: NzMessageService,
        private nzModal: NzModalService,
        private fb: FormBuilder,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) { }

    ngOnInit() {
        this.getDetail();
        this.getUserAuthLevel();
    }

    getDetail() {
        this.http.get(this.httpUrl + this.tokenService.get().guid).subscribe((value: any) => {
            if (value.code === 1) {
                this.personInfo = value.data;
            }
        });
    }
    /**
     * 得到用户认证等级
     */
    getUserAuthLevel() {
        this.http.get(this.httpUrl + 'level/' + this.tokenService.get().guid).subscribe((value: any) => {
            if (value.code === 1) {
                this.isAuthentication = value.data;
            }
        });
    }
    /**
     * 编辑模态框
     */
    editModal(itemKey) {
        const self = this;
        self.formShowKey = itemKey;
        const obj = {};
        switch (itemKey) {
            case 'school':
                obj['school'] = ['', [Validators.required]];
                break;
            case 'major':
                obj['major'] = ['', [Validators.required]];
                break;
            case 'education':
                obj['education'] = ['', [Validators.required]];
                break;
            case 'signature':
                obj['signature'] = [''];
                break;
            default:
                break;
        }
        self.validataForm = self.fb.group(obj);
        self.modal = self.nzModal.create({
            nzTitle: '修改信息',
            nzContent: self.editTemplate,
            nzFooter: self.modalFooter,
            nzOnOk: self.handleOk,
            nzOkText: '确认',
            nzOnCancel: this.handleCancel,
            nzCancelText: '取消'
        });
    }
    handleCancel = () => {
        this.modal.close();
    }
    handleOk = () => {
        this.isOkLoading = true;
        // console.log(this.validataForm.value);
        this.modal.close();
        this.isOkLoading = false;
    }
 
}
