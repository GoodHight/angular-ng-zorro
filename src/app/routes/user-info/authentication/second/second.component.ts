import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
    selector: 'second',
    templateUrl: './second.component.html',
    styleUrls: ['./second.component.css']
})
export class SecondComponent implements OnInit {

    validateForm: FormGroup;
    url = environment.SERVER_URL + environment.USER_URL;
    fileList = [[], []];
    constructor(private fb: FormBuilder, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private http: HttpClient, private msg: NzMessageService, private router: Router) {
    }
    uploaderFrontUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=ID_CARD_FRONT';
    uploaderBackUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=ID_CARD_BACK';
    idCardBackId: any;
    idCardFrontId: any;
    previewImage = '';
    previewVisible = false;
    readonly = false;
    submitForm() {
        this.validateForm.value.idCardBackId = this.idCardBackId;
        this.validateForm.value.idCardFrontId = this.idCardFrontId;
        this.http.patch(this.url + 'service/user/l1/a/' + this.tokenService.get().guid, this.validateForm.value)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success(res.message);
                    this.router.navigate(['/userInfo/authentication/next1']);
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
            this.idCardBackId = this.fileList[0][0].response.data || '';
            this.idCardFrontId = this.fileList[1][0].response.data || '';
        }
    }
    ngOnInit() {
        this.validateForm = this.fb.group({
            idCardBackId: ['', [Validators.required]],
            idCardFrontId: ['', [Validators.required]],
        });
    }

}
