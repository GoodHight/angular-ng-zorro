import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Component({
    selector: 'app-employee-add',
    styleUrls: ['./employee-add.component.less'],
    templateUrl: './employee-add.component.html',
})
export class EmployeeAddComponent implements OnInit {

    form: FormGroup;
    loading = true;
    isLoading = false;

    count = 0;
    selectValue;
    typeUrl = environment.FRAMEWORK_URL + 'service';
    url = environment.SERVER_URL + environment.ENTERPRISE_URL;
    private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
    private deptUrl = environment.SERVER_URL + environment.ENTERPRISE_URL;
    public optionList = [];
    // 证件类型
    public selectData0 = [];
    // 试用期限
    probationTime = [];
    // isManager = [{
    //     guid: '0',
    //     dictName: '否',
    // }, {
    //     guid: '1',
    //     dictName: '是',
    // }];
    departmentOptions = [
        { guid: '0', departmentName: '前端' },
        { guid: '1', departmentName: '后端' },
    ];
    // 工作性质
    workTypeList = [];
    // 员工状态
    status = [];
    isLoadingOne = false;
    // 省
    public selectDataShen = [];
    // 市
    public selectDataShi = [];
    // 区
    public selectDataQu = [];
    public enterpriseId = this.tokenService.get().loginEid;

    dateFormat = 'yyyyMMdd';

    constructor(private http: HttpClient,
        private fb: FormBuilder, private msg: NzMessageService, private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {

    }

    // loginEid = this.tokenService.get().loginEid;
    // loginUid = this.tokenService.get().userGuid;

    // getDepartment() {
    //     this.http.get(this.url + 'department/employee-part', {
    //         params: {
    //             enterpriseGuid: this.enterpriseId
    //         }
    //     }).subscribe((res: any) => {
    //         if (res.code === 1) {
    //             this.departmentOptions = res.data;
    //             // console.log(this.departmentOptions);
    //         }
    //     });
    // }


    _submitForm() {
        this.isLoadingOne = true;
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
            // return;
        }
        this.loading = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const obj = this.form.value;
        if (this.form.get('entryTime').value) {
            const entryTime = new Date(this.form.get('entryTime').value);
            obj['entryTime'] = '' + entryTime.getFullYear() +
                (entryTime.getMonth() + 1 < 10 ? '0' + (entryTime.getMonth() + 1) : (entryTime.getMonth() + 1)) +
                (entryTime.getDate() < 10 ? '0' + entryTime.getDate() : entryTime.getDate()) + '000000';
        }
        this.http.post(this.url + 'service/employee', obj, { headers: headers }).subscribe((res: any) => {
            if (res.code === 0) {
                this.msg.success('新增成功', { nzDuration: 1000 });
                this.loading = false;
                // 清空路由复用信息
                // setTimeout(() => {
                this.router.navigate(['/personnel-admin/employee-info/index']);
                // }, 1000);

            } else {
                this.msg.error(res.message, { nzDuration: 1000 });
            }
            this.isLoadingOne = false;
        }, response => {
            this.isLoadingOne = false;
            // this.error = `账户或密码错误`;
            this.msg.error('服务器错误');
            return;
        });
    }

    /**
     * 证件下拉框数据变化时，相应变化证件号码的验证格式
     * @param e 证件guid
     */
    certificateChange(e) {
        let dictCode = '';
        for (let i = 0, length = this.selectData0.length; i < length; i++) {
            if (this.selectData0[i]['guid'] === e) {
                dictCode = this.selectData0[i]['dictCode'];
                break;
            }
        }
        switch (dictCode) {
            case '01':  /** 身份证 */
                this.form.get('idNumber').setValidators(Validators.compose([Validators.required,
                Validators.pattern(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/)]));
                break;
            case '02':  /** 护照 */
                this.form.get('idNumber').setValidators(Validators.compose([Validators.required,
                Validators.pattern(/^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/)]));
                break;
            case '03': /** 军官证 */
                this.form.get('idNumber').setValidators(Validators.compose([Validators.required,
                Validators.pattern(/^[a-zA-Z0-9]{7,21}$/)]));
                break;
            case '04': /** 台胞证 */
                this.form.get('idNumber').setValidators(Validators.compose([Validators.required,
                Validators.pattern(/\d{10}\(B\)/)]));
                break;
            default:   /** 其他 */
                this.form.get('idNumber').setValidators(Validators.compose([Validators.required]));
                break;
        }
        this.form.get('idNumber').setValue('');
    }

    // 获取下拉数据
    public getdropDownlist() {
        this.http.get(this.dictionaryUrl + 'service/dictionary/all')
            .subscribe((res: any) => {
                if (res.code === 0) {
                    res.data.forEach((value: any, key: any) => {
                        if (value.dictCode === 'DIC_ID_TYPE') {
                            this.selectData0 = value.childrenDictionaries;
                        }
                        if (value.dictCode === 'DIC_PROBATION_PERIOD') {
                            this.probationTime = value.childrenDictionaries;
                        }
                        if (value.dictCode === 'DIC_EMPLOYEE_STATUS') { // 删除离职状态
                            this.status = value.childrenDictionaries;
                            for (let i = 0; i < this.status.length; i++) {
                                if (this.status[i].dictName === '离职') {
                                    const member2 = this.status[i];
                                    this.status.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        if (value.dictCode === 'DIC_WORK_TYPE') {
                            this.workTypeList = value.childrenDictionaries;
                        }
                    });
                }
            });
    }
    /* 
      获取部门
  */
    getPaperType() {
        this.http.get(this.deptUrl + 'service/enterprise/dept/employeePart', {
            params: {
                enterpriseGuid: this.tokenService.get().guid
            }
        })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.departmentOptions = res.data;
                } else {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }
    /* 
       获取省
   */
    getProvinces() {
        this.http.get(this.dictionaryUrl + 'service/provinces')
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.selectDataShen = res.data;
                } else {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }
    /* 
        获取市
    */
    CitysListChange(e) {
        if (e !== null) {
            this.form.value.nativeCityId = '';
            this.http.get(this.dictionaryUrl + 'service/city/' + e)
                .subscribe((res: any) => {
                    if (res.code === 0) {
                        this.selectDataShi = res.data;
                    } else {
                        this.msg.error(res.message);
                        this.loading = false;
                    }
                });
        }
    }
    /* 
        获取区
    */
    CountyListChange(e) {
        if (e !== null) {
            this.http.get(this.dictionaryUrl + 'service/sysAreas/' + e)
                .subscribe((res: any) => {
                    if (res.code === 0) {
                        this.selectDataQu = res.data;
                    } else {
                        this.msg.error(res.message);
                        this.loading = false;
                    }
                });
        }

    }

    // 获取办公地点
    // public onSearch(value: string): void {
    //     this.isLoading = true;
    //     this.http.get(this.typeUrl + '/range', { params: { key: value } })
    //         .subscribe((res: any) => {
    //             if (res.code === 1) {
    //                 this.optionList = res.data;
    //                 this.isLoading = false;
    //             }
    //         });
    // }

    // 取消
    cancel() {
        this.router.navigate(['/personnel-admin/employee-info/index']);
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            hidePhone: ['0'],
            departmentId: [null, [Validators.required]],
            position: ['', [Validators.required]],
            // isManager: ['0'],
            jobNumber: [null],
            entryTime: ['', [Validators.required]],
            workType: [null],
            probationTime: [null, [Validators.required]],
            status: [null, [Validators.required]],
            idType: [null, [Validators.required]],
            idNumber: [''],
            workEmail: ['', [Validators.email]],
            extNumber: [null],
            workProvinceId: [null],
            workCityId: [null],
            workAreasId: [null],
            workAddress: [''],
            enterpriseGuid: [this.tokenService.get().guid],
            operatorId: [this.tokenService.get().guid],
        });
        // this.getDepartment();
        this.getPaperType();
        this.getProvinces();
        this.getdropDownlist();
    }

}
