import {Component, Inject, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
    selector: 'index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
    validateForm: FormGroup;
    url = environment.SERVER_URL + environment.USER_URL;
    readonly = false;
    current = 0;
    previewImage = '';
    previewVisible = false;
    diploma: any;
    fileList = [];
    constructor(private fb: FormBuilder, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private http: HttpClient, private msg: NzMessageService, private router: Router) {
    }
    public userInfo = {
        name: this.tokenService.get().name,
        idNumber: this.tokenService.get().idNumber,
        phone: this.tokenService.get().phone
    };
    guid = this.tokenService.get().guid;
    uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=HEAD_PORTRAIT';

    submitForm() {
        this.http.patch(this.url + 'service/user/l0/' + this.tokenService.get().guid, this.validateForm.value)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success(res.message);
                    this.current = 1;
                } else {
                    this.msg.error(res.message);
                }
            });
    }

    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    // 上傳的監控
    handleChange(info: { file: UploadFile }): void {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.msg.success('上传成功');
            this.diploma = this.fileList[0].response.data || '';
        }
    }

    ngOnInit() {
        if (this.tokenService.get().idNumber.length > 15) {
            this.readonly = true;
        }
        this.validateForm = this.fb.group({
            idCardNumber: [this.tokenService.get().idNumber, [Validators.required]],
            realName: [this.tokenService.get().name, [Validators.required]],
        });
    }

}
