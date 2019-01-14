import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
// import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { lang } from 'moment';

const USERDATA = {
    start: new Date(),
    end: new Date()
};

@Component({
    selector: 'app-authenticate',
    templateUrl: './authenticate.component.html',
    styleUrls: ['./authenticate.component.less'],
})

export class AuthenticateComponent implements OnInit, AfterViewInit {
    startValue: Date = null;
    endValue: Date = null;
    endOpen: any = false;
    dateFormat: 'yyyy/MM/dd';
    form: FormGroup;
    current = 0;
    loading = false;
    selectValue;
    type = '0';
    fileIDs = [];
    idCardGuid: any;
    private cityUrl = environment.SERVER_URL + environment.COMMONS_URL;
    public url = environment.SERVER_URL + environment.ENTERPRISE_URL;
    public files_url = environment.UPLOADER_URL + environment.FILE_URL;

    public commons_url = environment.SERVER_URL + environment.COMMONS_URL;
    public body = {};
    public registerAddressName = '';
    public cityData = [];
    // 行业下拉框数据
    public selectData = [];
    // 行业子集下拉框数据
    public selectDataChild: any[];
    enterpriseScale: any[];
    public selectDataAll = [];
    public datas = {
        guid: '',
        username: '',
        userId: this.tokenService.get().guid,
        enterpriseId: '',
        name: this.tokenService.get().name,
        idNumber: '',
        enterpriseName: '',
        type: '0',
        unifiedSocialCreditCode: '',
        // 省
        provinceId: '',
        provinceName: '',
        // 市
        cityId: '',
        cityName: '',
        // 区
        countyId: '',
        countyName: '',
        // 详细地址
        address: '',
        registerNo: '',
        // scaleId 规模ID
        scaleId: '',
        scaleName: '',
        industryLevelOne: '',
        inlevelOne: '',
        industryLevelTwo: '',
        inlevelTwo: '',
        businessStart: null,
        businessEnd: null,
        creator: this.tokenService.get().account,
        creditNo: '',
        pictureIds: '',
        officeAddress: '',
    };
    public keyVaule = 0;
    checked = false;
    closingDate = false;
    options = [
        { value: 'jack', label: 'Jack1' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'disabled', label: 'Disabled', disabled: true }
    ];
    provinceData = [];
    areasData = [];
    // 文件存放
    fileList = [[], [], []];
    previewImage = '';
    previewVisible = false;
    nzDisabled: any = [{ label: '无固定期限', value: '0', disabled: true, checked: false }];
    id_card_font: any;
    id_card_back: any;
    delFlag: any;
    // @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

    validateForm: FormGroup;

    constructor(private fb: FormBuilder, private msg: NzMessageService, private http: HttpClient,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private router: Router, private activateRoute: ActivatedRoute) {
        this.selectValue = this.options[0];

    }

    guid = this.tokenService.get().guid;
    uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=ID_CARD_FRONT';
    uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=ID_CARD_BACK';
    uploaderlicenseUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=BUSINESS_LICENSE';

    auditStatus = 0;

    /*
    * 获取企业信息
    * */
    private getData() {
        this.http.get(this.url + 'service/certification/' + this.tokenService.get().guid)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    // console.log(res);

                    // if (res.data.idNumber.length > 15) {
                    //     this.current = 1;
                    //     this.getLicenseData();
                    // } else {
                    this.fileList[0] = [];
                    this.fileList[1] = [];
                    this.datas.idNumber = res.data.idNumber;
                    this.datas.username = res.data.name;

                    this.id_card_font = res.data.idCardFront;
                    this.idCardGuid = res.data.guid;
                    this.id_card_back = res.data.idCardBack;
                    this.delFlag = res.data.delFlag;
                    if (res.data.idCardFront !== '') {
                        const obj = {
                            uid: -1,
                            name: '身份证正面.png',
                            status: 'done',
                            url: this.files_url + 'service/files/' + res.data.idCardFront
                        };
                        this.fileList[0].push(obj);
                    }
                    // console.log(this.fileList[0]);

                    if (res.data.idCardBack !== '') {
                        const obj1 = {
                            uid: -2,
                            name: '身份证反面.png',
                            status: 'done',
                            url: this.files_url + 'service/files/' + res.data.idCardBack
                        };
                        this.fileList[1].push(obj1);
                    }

                    this.auditStatus = res.data.checkFlag;
                }
                // }
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
            if (this.validateForm.value.provinceId === value.code) {
                this.datas.provinceName = value.name;
            }
        });
        const provinceId = this.validateForm.value.provinceId || this.datas.provinceId;
        /*provinceData*/
        // console.log(provinceId);

        if (provinceId !== null && provinceId !== 'null') {
            this.http.get(this.cityUrl + 'service/city/' + provinceId, {})
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
            if (this.validateForm.value.cityId === value.code) {
                this.datas.cityName = value.name;
            }
        });
        const cityId = this.validateForm.value.cityId || this.datas.cityId;
        if (cityId !== null && cityId !== 'null') {
            this.http.get(this.cityUrl + 'service/sysAreas/' + cityId, {})
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
            if (this.validateForm.value.countyId === value.code) {
                this.datas.countyName = value.name;
            }
        });
    }

    /*
    * 取消
    * */
    public cancel() {
        this.router.navigate(['/business-management/business-info']);
    }

    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    // 上傳的監控
    handleChange(info: { file: UploadFile }, type: any): void {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.msg.success('上传成功');
            if (type === 0) {
                this.id_card_font = this.fileList[type][0].response.data || '';
            } else if (type === 1) {
                this.id_card_back = this.fileList[type][0].response.data || '';
            } else {
                this.datas.pictureIds = this.fileList[type][0].response.data || '';
            }
        }
    }

    /**
     * 将时间转换成yyyyMMddHHmmss类型的字符串
     * @param inDate
     */
    dateTransformToString(inDate: Date | string | any): string {
        let year = null,
            month = null,
            day = null,
            date = null;

        if (inDate instanceof Date) {
            date = inDate;
        } else if (inDate === '' || inDate === null || inDate === undefined) {
            return '';
        } else {
            try {
                date = new Date(inDate);
            } catch (error) {
                return '';
            }
        }
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();

        return '' + year + (month < 10 ? '0' + month : month) +
            (day < 10 ? '0' + day : day);
    }

    /**
     * 将时间转换成yyyy-MM-dd类型的字符串
     * @param inDate
     */
    stringTransformToDate(value: string) {
        let year = '';
        let month = '';
        let day = '';
        year = value.substring(0, 4);
        month = value.substring(4, 6);
        day = value.substring(6, 8);
        return year + '-' + month + '-' + day;
    }

    returnEnterpriseAuthentication() {
        this.router.navigate(['/business-management/business-info']);
    }
    _submitForm() {

        // // console.log(this.datas);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        if (this.datas.type === '2') {
            if (this.datas.registerNo === '') {
                this.msg.error('请输入注册号');
                return;
            }
        } else {
            if (this.datas.creditNo === '') {
                this.msg.error('请输入注册号');
                return;
            }
        }
        if (this.datas.type === '') {
            this.msg.error('请选择营业执照类型');
            return;
        }
        if (this.fileList[2].length === 0) {
            this.msg.error('请上传营业执照');
            return;
        }
        if (this.datas.address === '') {
            this.msg.error('请输入详细地址');
            return;
        }
        // if (this.datas.officeAddress === '') {
        //     this.msg.error('请输入企业地址');
        //     return;
        // }
        if (this.datas.provinceId === '' || this.datas.provinceId === 'null' || this.datas.provinceId === null) {
            this.msg.error('请选择省');
            return;
        }
        // if (this.datas.cityId === '') {
        //     this.msg.error('请选择城市');
        //     return;
        // }
        // if (this.datas.countyId === '') {
        //     this.msg.error('请选择区');
        //     return;
        // }
        if (this.datas.industryLevelOne === '') {
            this.msg.error('请选择行业');
            return;
        }
        if (this.datas.industryLevelTwo === '') {
            this.msg.error('请选择二级行业');
            return;
        }
        if (this.datas.scaleId === '') {
            this.msg.error('请选择规模');
            return;
        }
        if (this.datas.businessStart === '') {
            this.msg.error('请选择营业开始时间');
            return;
        }
        if (this.datas.businessEnd === '') {
            this.msg.error('请选择营业结束时间');
            return;
        }
        this.validateForm.value.businessEnd = this.dateTransformToString(this.datas.businessEnd);
        this.validateForm.value.businessStart = this.dateTransformToString(this.datas.businessStart);
        this.validateForm.value.pictureIds = this.datas.pictureIds;
        this.validateForm.value.provinceName = this.datas.provinceName;
        this.validateForm.value.cityName = this.datas.cityName;
        this.validateForm.value.countyName = this.datas.countyName;
        this.validateForm.value.scaleName = this.datas.scaleName;
        this.validateForm.value.inlevelTwo = this.datas.inlevelTwo;
        this.validateForm.value.inlevelOne = this.datas.inlevelOne;
        if (this.auditStatus === 2) {
            this.validateForm.value['checkFlag'] = 3;
        }
        let href = this.http.post(this.url + 'service/license', {}, {
            headers: headers,
            params: this.validateForm.value
        });
        if (this.delFlag !== '') {
            href = this.http.patch(this.url + 'service/license/' + this.datas.guid, {}, {
                headers: headers,
                params: this.validateForm.value
            });
        }
        href.subscribe((res: any) => {
            if (res.code === 0) {
                this.msg.success('提交成功');
                this.loading = false;
                this.router.navigate(['/business-management/business-info']);
            } else {
                this.msg.error(res.message);
                this.loading = false;
                // this.router.navigate(['/business-management/business-info']);
            }
        }, response => {
            this.msg.error('系统异常');
            return;
        });
    }

    /*
    * 获取城市数据
    *
    * */
    public getCity(inp: any): void {
        /*cityData*/
        this.http.get(this.cityUrl + '/range', {
            params: {
                key: inp
            }
        })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.cityData = res.data;
                } else {
                    this.msg.error(res.message);
                }
            });
    }

    /*
    * 获取行业ID
    * */
    changeIndustry(type: any) {
        if (type === '0') {
            this.selectData.forEach((data, key) => {
                // // console.log(data);
                if (this.datas.industryLevelOne === data.guid) {
                    // // console.log(data.dictName);
                    this.datas.inlevelOne = data.dictName;
                    this.keyVaule = key;
                    this.selectDataChild = data.childrenDictionaries;
                }
            });
        }
        if (type === '1') {
            this.selectData[this.keyVaule].childrenDictionaries.forEach(data => {
                if (this.datas.industryLevelTwo === data.guid) {
                    // // console.log(data.dictName);

                    this.datas.inlevelTwo = data.dictName;
                }
            });
        }
        if (type === '2') {
            this.enterpriseScale.forEach(data => {
                if (this.datas.scaleId === data.guid) {
                    // // console.log(data.dictName);
                    this.datas.scaleName = data.dictName;
                }
            });
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    /*
    * 社会信用码的验证
    * */
    CheckSocialCreditCode() {
        const Code = this.datas.creditNo;
        const patrn = /^[0-9A-Z]+$/;

        // 18位校验及大写校验
        if ((Code.length !== 18) || (patrn.test(Code) === false)) {

            this.msg.error('社会信用码有错误');
        } else {
            let Ancode; // 统一社会信用代码的每一个值
            let Ancodevalue; // 统一社会信用代码每一个值的权重
            let total = 0;
            const weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
            const str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
            // 不用I、O、S、V、Z
            for (let i = 0; i < Code.length - 1; i++) {
                Ancode = Code.substring(i, i + 1);
                Ancodevalue = str.indexOf(Ancode);
                total = total + Ancodevalue * weightedfactors[i];
                // 权重与加权因子相乘之和
            }
            let logiccheckcode = 31 - total % 31 + '';

            if (logiccheckcode === '31') {
                logiccheckcode = '0';
            }
            const Str = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y';
            const Array_Str = Str.split(',');
            logiccheckcode = Array_Str[logiccheckcode];

            const checkcode = Code.substring(17, 18);
            if (logiccheckcode !== checkcode) {
                this.msg.error('不是有效的统一社会信用编码！');
                return false;
            } else {
                return true;
            }
        }
    }

    /*
    * 注册号的验证
    * */
    isValidBusCode() {
        let ret = false;
        const busCode = this.datas.registerNo;
        if (busCode.length === 15) {
            const s = [];
            const p = [];
            const a = [];
            const m = 10;
            p[0] = m;
            for (let i = 0; i < busCode.length; i++) {
                a[i] = parseInt(busCode.substring(i, i + 1), m);
                s[i] = (p[i] % (m + 1)) + a[i];
                if (0 === s[i] % m) {
                    p[i + 1] = 10 * 2;
                } else {
                    p[i + 1] = (s[i] % m) * 2;
                }
            }
            if (1 === (s[14] % m)) {
                ret = true;
            } else {
                ret = false;
                this.msg.error('营业执注册号错误!');
            }
        } else {
            ret = false;
            this.msg.error('营业执注册号错误!');
        }
        return ret;

    }

    ngOnInit(): void {
        this.getData();
        this.getProvince();
        this.getSelectData();
        this.getSelectDataAll();
        this.validateForm = this.fb.group({
            businessStart: [this.datas.businessStart, [Validators.required]],
            businessEnd: [this.datas.businessEnd, [Validators.required]],
            idNumber: [this.datas.idNumber, [Validators.required,
            Validators.pattern(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/)]],
            name: [this.tokenService.get().name, [Validators.required]],
            username: [this.datas.username, [Validators.required]],
            type: [this.datas.type, [Validators.required]],
            enterpriseName: [this.datas.enterpriseName, [Validators.required]],
            scaleName: [this.datas.scaleName, [Validators.required]],
            guid: [this.guid, [Validators.required]],
            industryLevelTwo: [this.datas.industryLevelTwo, [Validators.required]],
            inlevelTwo: [this.datas.inlevelTwo, [Validators.required]],
            inlevelOne: [this.datas.inlevelOne, [Validators.required]],
            industryLevelOne: [this.datas.industryLevelOne, [Validators.required]],
            scaleId: [this.datas.scaleId, [Validators.required]],
            provinceId: [this.datas.provinceId, [Validators.required]],
            provinceName: [this.datas.provinceName, [Validators.required]],
            cityId: [this.datas.cityId, [Validators.required]],
            cityName: [this.datas.cityName],
            countyId: [this.datas.countyId, [Validators.required]],
            countyName: [this.datas.countyName],
            address: [this.datas.address, [Validators.required]],
            officeAddress: [this.datas.officeAddress, [Validators.required]],
            registerNo: [this.datas.registerNo, Validators.required],
            creator: [this.datas.creator, Validators.required],
            creditNo: [this.datas.creditNo],
            pictureIds: [this.datas.pictureIds],
            enterpriseId: [this.tokenService.get().guid],
        });
    }

    // 下一步状态
    nextBtnState = false;

    next(): void {
        if (this.validateForm.get('username').errors) {
            this.msg.error('请填写法人姓名');
            return;
        }
        if (this.validateForm.get('idNumber').errors) {
            this.msg.error('身份证号填写错误！');
            return;
        }
        if (this.id_card_font === '') {
            this.msg.error('请上传身份证正面！');
            return;
        }
        if (this.id_card_back === '') {
            this.msg.error('请上传身份证反面！');
            return;
        }
        this.nextBtnState = true;
        let href = this.http.post(this.url + 'service/certification', {}, {
            params: {
                idCardFront: this.id_card_font,
                idCardBack: this.id_card_back,
                userId: this.tokenService.get().guid,
                enterpriseId: this.tokenService.get().guid,
                name: this.datas.username,
                idNumber: this.datas.idNumber
            }
        });
        if (this.delFlag !== '') {
            href = this.http.patch(this.url + 'service/certification/' + this.idCardGuid, {}, {
                params: {
                    idCardFront: this.id_card_font,
                    idCardBack: this.id_card_back,
                    userId: this.tokenService.get().guid,
                    enterpriseId: this.tokenService.get().guid,
                    name: this.datas.username,
                    idNumber: this.datas.idNumber
                }
            });
        }
        href.subscribe((res: any) => {
            if (res.code === 0) {
                this.current += 1;
                this.getLicenseData();
            } else {
                this.msg.error(res.message);
            }
            this.nextBtnState = false;
        });
        // this.getData();
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
                            this.enterpriseScale = element.childrenDictionaries;
                        }
                    });
                } else {
                    this.selectDataAll = [];
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    /*
  * 获取企业数据
  * */
    private getEnterpriseData() {
        this.http.get(this.cityUrl + 'service/enterprise/')
            .subscribe((res: any) => {
                if (res.code === 0) {
                    if (res.data !== '') {
                        this.datas = res.data;
                    }
                } else {
                    // this.datas = {};
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    /**
     * /service/license/{enterpriseId}
     * 获取企业营业信息
     */
    private getLicenseData() {
        this.http.get(this.url + 'service/license/' + this.guid, { params: { userId: this.guid } })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    if (res.data !== '') {
                        this.datas = res.data;
                        this.datas.type = this.datas.type.toString();
                        this.datas.businessStart = new Date(this.stringTransformToDate(this.datas.businessStart));
                        if (this.datas.businessEnd === '19700101') {
                            this.datas.businessEnd = new Date();
                            this.closingDate = true;
                            this.nzDisabled[0].checked = true;
                        } else {
                            this.datas.businessEnd = new Date(this.stringTransformToDate(this.datas.businessEnd));
                            this.nzDisabled[0].checked = false;
                        }
                        this.datas.type = this.datas.type.toString();
                        if (res.data.pictureIds !== '') {
                            const obj = {
                                uid: -1,
                                name: '营业执照.png',
                                status: 'done',
                                url: this.files_url + 'service/files/' + res.data.pictureIds
                            };
                            this.fileList[2].push(obj);
                        }
                        this.getNextCity();
                        // this.getNextArea();
                    } else {
                        this.delFlag = '';
                    }
                } else {
                    // this.datas = {};
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    disabledStartDate = (startValue: Date): any => {
        if (this.dateTransformToString(this.endValue) === '19700101') {
            return false;
        }
        if (!startValue || !this.endValue) {
            return false;
        }
        return startValue.getTime() > this.endValue.getTime();
    }

    disabledEndDate = (endValue: Date): any => {
        if (!endValue || !this.startValue) {
            return false;
        }
        return endValue.getTime() <= this.startValue.getTime();
    }

    onStartChange(date: Date): void {
        this.startValue = date;
    }

    onEndChange(date: Date): void {
        this.endValue = date;
        if (!date) {
            this.nzDisabled[0].disabled = false;
        }
    }
    log(value): void {
        console.log(value[0].checked);
        if (value[0].checked === true) {
            this.closingDate = true;
            this.datas.businessEnd = new Date(value[0].checked);
        } else {
            this.closingDate = false;
            this.datas.businessEnd = new Date();
            this.datas.businessEnd = new Date(this.stringTransformToDate(this.datas.businessEnd));
        }
    }
    handleStartOpenChange(open: any): void {
        if (!open) {
            // this.endOpen = true;
        }
        // // console.log('handleStartOpenChange', open, this.endOpen);
    }

    handleEndOpenChange(open: any): void {
        this.endOpen = open;
    }
    pre(): void {
        this.current -= 1;
        this.getData();
    }

    ngAfterViewInit() {
    }
}
