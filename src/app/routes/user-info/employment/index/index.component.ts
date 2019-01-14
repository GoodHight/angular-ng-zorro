import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FileTemplateComponent} from '@shared/file-template/file-template.component';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';

@Component({
    selector: 'index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    validateForm: FormGroup;
    selectData10 = [{
        guid: '1',
        dictName: '大学1'
    }, {
        guid: '2',
        dictName: '研究生'
    }, {
        guid: '3',
        dictName: '博士'
    }];
    selectData11 = [{
        guid: '1',
        dictName: '大学'
    }, {
        guid: '2',
        dictName: '研究生'
    }, {
        guid: '3',
        dictName: '博士'
    }];
    fileList = [];
    dateFormat: 'yyyyMMdd';
    previewImage = '';
    previewVisible = false;
    url = environment.SERVER_URL + environment.USER_URL;
    dataTimeState: any;
    dimission: any;
    graduationCertificate: any;

    constructor(private fb: FormBuilder, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private http: HttpClient, private msg: NzMessageService) {

    }

    guid = this.tokenService.get().guid;
    uploaderUrl =  + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=DIMISSION';

    submitForm() {
        if (this.dataTimeState !== 1) {
            this.validateForm.value.entryTime = this.formatDate(this.validateForm.value.entryTime);
            this.validateForm.value.quitTime = this.formatDate(this.validateForm.value.quitTime);
        }
        this.validateForm.value.dimission = this.dimission;
        this.http.patch(this.url + 'service/user/employment/' + this.tokenService.get().guid, [this.validateForm.value])
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success(res.message);
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
            this.dimission = this.fileList[0].response.data || '';
        }
    }

    formatDate(date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        this.dataTimeState = 1;
        return y + '-' + m + '-' + d;
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            deptName: ['研发部', [Validators.required]],
            dimission: [this.dimission],
            enterpriseName: ['重庆才链区块链有限公司', [Validators.required]],
            entryTime: [null, [Validators.required]],
            position: ['前端开发工程师', [Validators.required]],
            quitTime: [null, [Validators.required]],
            userGuid: [this.tokenService.get().guid],
            guid: [null]
        });
    }

}
