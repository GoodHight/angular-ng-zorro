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
        dictName: '大学'
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
    fileList = [[], []];
    dateFormat: 'yyyyMMdd';
    previewImage = '';
    previewVisible = false;
    url = environment.SERVER_URL + environment.USER_URL;
    diploma: any;
    graduationCertificate: any;
    // 省的数据
    provinceData: any[];
    // 市的数据
    cityData: any[];
    // 区的数据
    areasData: any[];

    constructor(private fb: FormBuilder, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private http: HttpClient, private msg: NzMessageService) {
        this.getProvince();
    }

    guid = this.tokenService.get().guid;
    uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=diploma';
    uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=graduationCertificate';
    // 户籍、籍贯、办公地点、社保、公积金等下拉框选项数据
    public optionList = [];
    private cityUrl = environment.SERVER_URL + environment.COMMONS_URL;

    submitForm() {
        this.http.patch(this.url + 'service/user/contact/' + this.tokenService.get().guid, [this.validateForm.value])
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success(res.message);
                } else {
                    this.msg.error(res.message);
                }
            });
    }

    /*
   * 获取城市数据
   *
   * */
    public getProvince(): void {
        /*provinceData*/
        this.http.get(this.cityUrl + 'service/provinces', {})
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.provinceData = res.data;
                } else {
                    this.msg.error(res.message);
                }
            });
    }

    /*
    * 获取市的数据
    * */
    public getNextCity() {
        /*provinceData*/
        this.http.get(this.cityUrl + 'service/provinces/' + this.validateForm.value.provinceId, {})
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.cityData = res.data;
                } else {
                    this.msg.error(res.message);
                }
            });
    }

    /*
    * 获取区的数据
    * */
    public getNextArea() {
        this.http.get(this.cityUrl + 'service/sysAreas/' + this.validateForm.value.cityId, {})
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.areasData = res.data;
                } else {
                    this.msg.error(res.message);
                }
            });
    }

    ngOnInit() {

        this.validateForm = this.fb.group({
            provinceId: [null, [Validators.required]],
            cityId: [null, [Validators.required]],
            areasId: [null, [Validators.required]],
            address: ['长江二路56号', [Validators.required]],
            email: ['1258630@qq.com', [Validators.required]],
            emergencyContact: ['傅正鸿', [Validators.required]],
            emergencyPhone: ['18883188480', [Validators.required]],
            userGuid: [this.tokenService.get().guid],
            guid: [null]
        });
    }
}
