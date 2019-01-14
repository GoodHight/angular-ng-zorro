import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { _Validators } from '@delon/util';

@Component({
    selector: 'app-business-info',
    styleUrls: ['./business-info.component.less'],
    templateUrl: './business-info.component.html',
})
export class BusinessInfoComponent implements OnInit {
    departmentParentGuid;
    employeeInfo: {
        title: '',
        key: ''
    };
    get fb(): FormBuilder {
        return this._fb;
    }

    set fb(value: FormBuilder) {
        this._fb = value;
    }

    get form(): FormGroup {
        return this._form;
    }

    set form(value: FormGroup) {
        this._form = value;
    }

    loading = false;
    avatarUrl: string;
    uploaderUrl = '';
    userID = '';
    logoImgId = '';
    private cityUrl = environment.SERVER_URL + environment.COMMONS_URL;
    public commons_url = environment.SERVER_URL + environment.COMMONS_URL;
    // 行业下拉框数据
    public selectData = [];
    // 行业子集下拉框数据
    public selectDataChild: any[];
    public selectDataAll = [];
    public keyVaule = 0;
    provinceData = [];
    areasData = [];
    public cityData = [];
    scaleId = [];
    validateForm: FormGroup;
    public datas = {
        guid: '',
        phone: '',
        name: '',
        website: '',
        scale: '',
        introduce: '',
        username: '',
        idNumber: '',
        enterpriseName: '',
        type: '0',
        unifiedSocialCreditCode: '',
        // 省
        officeProvinceId: '',
        provinceName: '',
        // 市
        officeCityId: '',
        cityName: '',
        // 区
        officeAreasId: '',
        countyName: '',
        // 详细地址
        address: '',
        registerNo: '',
        // scaleId 规模ID
        // scaleId: '',
        scaleName: '',
        industryId: '',
        inlevelOne: '',
        industryNextId: '',
        inlevelTwo: '',
        businessStart: '',
        businessEnd: '',
        creditNo: '',
        pictureIds: '',
        officeAddress: '',
    };
    /*
    * 企业认证的状态码
    * 0=已认证
    * 0= 未认证
    * */
    Authentication = 1;
    /*
    * 企业信息
    * */
    public dataList: any = {};
    /*
    * 企业对公账户信息
    * */
    public enterpriseAccount = {
        openingBank: '',
        isEnterpriseAccountAuthentication: 0,
        openingBankAddress: '',
        publicAccount: ''

    };
    /*
    * 行业列表
    * */
    public trade: any[];
    telNumber;
    moble;
    corporationIdCard;
    enterpriseName;
    registerAddress;
    link;
    taxNumber;
    updateState = 0;
    disableds = true;
    private _form: FormGroup;

    constructor(private http: HttpClient, private _fb: FormBuilder, private router: Router , public msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    }
    beforeUpload = (file: File) => {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isGIF = file.type === 'image/gif';
        const isBMP = file.type === 'image/bmp';
        if (!isJPG && !isPNG && !isGIF && !isBMP) {
            this.msg.error('只能上传图片文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.msg.error('图像必须小于2MB!');
        }
        return (isJPG || isPNG || isGIF || isBMP) && isLt2M;
    }

    private getBase64(img: File, callback: (img: {}) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange(info: { file: UploadFile }): void {
        if (info.file.status === 'uploading') {
            this.loading = true;
            return;
        }
        if (info.file.status === 'done') {
            // console.log(info);
            const headers = new HttpHeaders().set('Content-Type', 'application/json');
            // const obj = {
            //     businessId: this.tokenService.get().guid,
            //     enterpriseId: this.tokenService.get().guid,
            //     fileIds: info.file.response.data,
            //     userId: this.userID,
            // };
            const fileIds = info.file.response.data;
            this.http.patch(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/enterprise/updateLog?enterpriseId=' + this.tokenService.get().guid + '&fileId=' + fileIds, { headers: headers }).subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('上传成功', { nzDuration: 3000 });
                    this.loading = false;
                } else {
                    this.msg.error(res.message, { nzDuration: 3000 });
                }
            }, response => {
                this.msg.error('上传失败', response);
                return;
            });
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, (img: string) => {
                this.loading = false;
                this.avatarUrl = img;
            });
        }
    }
    // service/enterprise/{guid}
    private url = environment.ENTERPRISE_URL;
    public userName = this.tokenService.get().userName;

    /*
    * 修改信息的具体实现
    * */
    public updateInfo() {
        // this.updateState = 1;
    }

    /*
    * 对公账户认证
    * */
    public enterpriseState() {
        alert('正在开发中....');
    }

    /*
    *
    * 查询所有行业
    * */
    public queryTrade() {
        this.http.get(this.url + 'dictionary/industry')
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.trade = res.data;
                }
            });
    }
    edit() {
        this.updateState = 0;
        this.getEnterprise();
    }

    reznheng() {
        if ( this.dataList.checkFlag === 4 ) {
            this.msg.error('正在审核中，请耐心等待');
        } else {
            this.router.navigate(['/my/authenticate']);
        }
    }

    _submitForm() {
        // // console.log(this.validateForm.value);
        const dataValue = this.validateForm.value;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        this.http.patch(this.url + 'service/enterprise/updateEnterpriseInfo', dataValue, { headers: headers }).subscribe((res: any) => {
            if (res.code === 0) {
                this.msg.success('修改成功', { nzDuration: 1000 });
                this.loading = false;
                this.updateState = 1;
                this.getEnterprise();
            } else {
                this.msg.error(res.message, { nzDuration: 1000 });
            }
        }, response => {
            this.msg.error('服务器错误');
            return;
        });

        // setTimeout(() => {
        //     this.loading = false;
        //     this.updateState = 0;
        // }, 1000);
    }

    /*
    * 获取企业信息
    * */
    private getEnterprise() {
        this.http.get(this.url + 'service/enterprise/account/' + this.tokenService.get().guid)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.dataList = res.data;
                    if (this.dataList.checkFlag === 0 || this.dataList.checkFlag === 2) {
                        this.disableds = false;
                    }
                    this.validateForm.setValue({
                        officeCityId: res.data.officeCityId,
                        officeProvinceId: res.data.officeProvinceId,
                        officeAreasId: res.data.officeAreasId,
                        officeAddress: res.data.officeAddress,
                        website: res.data.website,
                        industryId: res.data.industryId,
                        industryNextId: res.data.industryNextId,
                        introduce: res.data.introduce,
                        scale: res.data.scaleId,
                        phone: res.data.phone,
                        name: res.data.name,
                        guid: this.tokenService.get().guid,
                    });
                    // // console.log( this.validateForm.value);
                }
            });
    }
    getLogoImg() {
        this.http.get(environment.UPLOADER_URL + environment.FILE_URL + 'service/files/getFileByBusinessGuid', {
            params: {
                businessGuid: this.tokenService.get().guid,
                escrowType: 'ENTERPRISE_LOG',
                enterpriseGuid: this.tokenService.get().guid,
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                // // console.log(res);
                this.avatarUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + res.data.guid;
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
    public getNextCity(): void {
        this.provinceData.forEach((value: any) => {
            if (this.validateForm.value.officeProvinceId === value.code) {
                this.datas.provinceName = value.name;
            }
        });
        const officeProvinceId = this.validateForm.value.officeProvinceId || this.datas.officeProvinceId;
        /*provinceData*/
        if (officeProvinceId !== null && officeProvinceId !== 'null') {
            this.http.get(this.cityUrl + 'service/city/' + officeProvinceId, {})
                .subscribe((res: any) => {
                    if (res.code === 0) {
                        this.cityData = res.data;
                        this.getNextArea();
                    } else {
                        this.msg.error(res.message);
                    }
                });
        }
    }

    /*
    * 获取区的数据
    * */
    public getNextArea(): void {
        this.cityData.forEach((value: any) => {
            if (this.validateForm.value.officeCityId === value.code) {
                this.datas.cityName = value.name;
            }
        });
        const officeCityId = this.validateForm.value.officeCityId || this.datas.officeCityId;
        if (officeCityId !== null && officeCityId !== 'null') {
            this.http.get(this.cityUrl + 'service/sysAreas/' + officeCityId, {})
                .subscribe((res: any) => {
                    if (res.code === 0) {
                        this.areasData = res.data;
                    } else {
                        this.msg.error(res.message);
                    }
                });
        }

    }

    /*
    * 设置区的名字
    * */
    public setArea() {
        this.areasData.forEach((value: any) => {
            if (this.validateForm.value.officeAreasId === value.code) {
                this.datas.countyName = value.name;
            }
        });
    }

    /*
   * 获取下拉框数据
   * */
    private getSelectData() {

        this.http.get(this.commons_url + 'service/dictionary/industry')
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.selectData = res.data;
                } else {
                    this.selectData = [];
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }
    /*
  * 获取规模下拉框数据
  * */
    private getSelectDataAll() {

        this.http.get(this.commons_url + 'service/dictionary/all')
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.selectDataAll = res.data;
                    this.selectDataAll.forEach(element => {
                        if (element.dictCode === 'DIC_ENTERPRISE_SCALE') {
                           this.scaleId = element.childrenDictionaries;
                        }
                    });
                } else {
                    this.selectDataAll = [];
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    changeIndustry(type: any) {

        if (type === '0') {
            this.selectData.forEach((data, key) => {
                // // console.log(data);
                if (this.datas.industryId === data.guid) {
                    // // console.log(data.dictName);
                    this.datas.inlevelOne = data.dictName;
                    this.keyVaule = key;
                    this.selectDataChild = data.childrenDictionaries;
                }
            });
            // console.log(this.selectDataChild);
        }
        if (type === '1') {
            this.selectData[this.keyVaule].childrenDictionaries.forEach(data => {
                if (this.datas.industryNextId === data.guid) {
                    // // console.log(data.dictName);
                    this.datas.inlevelTwo = data.dictName;
                }
            });
        }
        if (type === '2') {
            this.scaleId.forEach(data => {
                if (this.datas.scale === data.guid) {
                    // // console.log(data.dictName);
                    this.datas.scaleName = data.dictName;
                }
            });
        }
    }

    ngOnInit() {
        if (this.tokenService.get().type === 1) {
            this.userID = this.tokenService.get().guid;
        } else {
            this.userID = this.tokenService.get().userId;
        }
        this.getProvince();
        this.getSelectData();
        this.getSelectDataAll();
        this.getLogoImg();
        this.uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=ENTERPRISE_LOG' + '&loginEid=' + this.tokenService.get().guid;
        this.getEnterprise();
        this.validateForm = this.fb.group({
            name: [this.datas.name],
            officeCityId: [this.datas.officeCityId],
            officeProvinceId: [this.datas.officeProvinceId],
            officeAreasId: [this.datas.officeAreasId],
            officeAddress: [this.datas.officeAddress],
            website: [this.datas.website],
            industryId: [this.datas.industryId],
            industryNextId: [this.datas.industryNextId],
            introduce: [this.datas.introduce],
            scale: [this.datas.scale],
            phone: [this.datas.phone],
            guid: [this.tokenService.get().guid],
        });
        // this.getEnterpriseAccount();
        // this.queryTrade();
        this.updateState = 1;
    }

}
