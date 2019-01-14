import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { _Validators } from '@delon/util';

@Component({
  selector: 'user',
  styleUrls: ['./user.component.less'],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  public q: any = {
    pageNum: 1,
    pageSize: 200,
    dictTypeCode: '',
    dictName: ''
  };
  tabs = [];
  tab: any;
  public tabSelectIndex = 0;
  // 部门领导列表
  departmentLeaders = [];
  // 岗位列表
  stations = [];
  // 证件类型
  public selectData0 = [];
  // 国籍
  public selectData1 = [];
  // 省
  public selectDataShen = [];
  // 市
  public selectDataShi = [];
  // 区
  public selectDataQu = [];
  // 政治面貌
  public selectData2 = [];
  // 属相
  public selectData3 = [];
  public selectData4 = [];
  public selectData5 = [];
  public selectData6 = [];
  public selectData7 = [];
  // 星座
  public selectData8 = [];
  public selectData9 = [];
  public selectData10 = [];
  public selectData11 = [];
  public selectData12 = [];
  public selectData13 = [];
  public selectData14 = [];
  // 试用期限
  public selectData15 = [];
  // 招聘渠道
  public selectData16 = [];
  public selectData17 = [];
  public selectData18 = [];
  // 民族
  public selectData19 = [];
  public selectData20 = [];
  public form: FormGroup;
  public txform: FormGroup;
  realName;
  dateFormat: 'yyyyMMdd';
  employee = {  // 基本信息
    age: '', // 年龄
    birthday: '', // 生日"
    blood: '', // 血型
    censusRegisterAddress: '', // 户籍所在地-详细地址
    censusRegisterAreasId: '', // 户籍所在地-区
    censusRegisterCityId: '', // 户籍所在地-市
    censusRegisterProvinceId: '', // 户籍所在地-省
    childrenCommercialInsurance: '', // 子女有无商业险
    constellation: '', // 星座
    enterpriseGuid: '', // 企业id
    fileOrganization: '', // 存档机构
    gender: '', // 性别
    guid: '', // 
    haveChildren: '', // 子女状态(有无子女)
    haveIllegal: '', // 有无违法违纪行为
    haveMedicalHistory: '', // 有无重大病史
    height: '', // 身高(单位：cm)
    idCardBackId: '', // 身份证反面照片ID
    idCardFrontId: '', // 身份证正面照片ID
    idNumber: '', // 证件号码
    idType: '', // 证件类型
    joinPartyTime: '', // 入党日期
    marriage: '', // 婚姻状况
    name: '', // 员工姓名
    nation: '', // 民族
    nationality: '', // 国籍
    nativeAreasId: '', // 籍贯-区
    nativeCityId: '', // 籍贯-市
    nativeProvinceId: '', // 籍贯-省
    userId: '', // 
    politicalOutlook: '', // 政治面貌
    recruitmentType: '', // 招聘渠道
    weight: '', // 身高(单位：cm)
    zodiac: '', // 属相
    remark: '',
    medicalExaminationReport: '', // 体检报告
    accountsNature: '', // 户口性质
  };
  loading: false;
  /*
  * 员工Guid
  * */
  guid;
  // 户籍、籍贯、办公地点、社保、公积金等下拉框选项数据
  public optionList = [];
  url = environment.SERVER_URL + environment.ENTERPRISE_URL;
  private cityUrl = environment.FRAMEWORK_URL + 'service';
  // private dictionaryUrl = environment.FRAMEWORK_URL + 'service';
  private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
  userID = '';
  delFileIds = [];
  // 文件存放
  fileList = [[], [], []];
  previewImage = '';
  previewVisible = false;
  uploaderUrl = '';
  uploaderGradUrl = '';
  public files_url = environment.UPLOADER_URL + environment.FILE_URL;
  uploadertj = ''; // 体检报告
  public cityData: any[];
  departmentOptions = [];
  accountsNaturelist = [
    { dictName: '农村', guid: '0' },
    { dictName: '城镇', guid: '1' },
  ];
  options = [
    { value: '身份证', label: '0' },
    { value: '护照', label: '1' },
  ];
  isLoadingOne = false;
  workPhone;
  public isLoading = false;
  @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) { }

  loginEid = this.tokenService.get().loginEid;
  loginUid = this.tokenService.get().userGuid;
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
    this.form.get('idNumber').markAsDirty({ onlySelf: true });
    this.form.get('idNumber').setValue(this.form.get('idNumber').value);
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
      // console.log(info.file);
      // Get this url from response in real world.
      this.msg.success('上传成功');
      if (type === 0) {
        this.employee.idCardFrontId = this.fileList[type][0].response.data || '';
      } else if (type === 1) {
        this.employee.idCardBackId = this.fileList[type][0].response.data || '';
      } else if (type === 2) {
        this.employee.medicalExaminationReport = this.fileList[type][0].response.data || '';
      }
    } else if (info.file.status === 'removed') {
      if (type === 0) { 
        this.delFileIds.push(info.file.response.data);
      } else if (type === 1) {
        this.delFileIds.push(info.file.response.data);
      } else if (type === 2) {
        this.delFileIds.push(info.file.response.data);
      }
    }
  }
  /*
  * 获取部门名
  * */
  public getEmployeeName() {

    // const guid = this.dataList.departmentGuid;
    // for (let i = 0; i < this.departmentOptions.length; i++) {
    //     if (this.departmentOptions[i]['key'] === this.dataList.departmentGuid) {
    //         this.dataList.departmentName = this.departmentOptions[i]['title'];
    //         // console.log(this.dataList.departmentName);
    //     }
    // }
  }
  /**
   * 获取部门领导列表
   */
  getDepartmentLeaders() {
    this.http.get(this.url + '/employee/department-head', {
      params: {
        enterpriseGuid: this.tokenService.get().enterprisesInfo.enterprisesId
      }
    }).subscribe((res: any) => {
      if (res.code === 1) {
        this.departmentLeaders = res.data;
      }
    });
  }
  /**
   * 获取岗位列表接口
   */
  getStations() {
    this.http.get(this.url + '/hrm-dictionary').subscribe((res: any) => {
      if (res.code === 1) {
        this.stations = res.data;
      }
    });
  }

  // 籍贯列表
  originNameList = [];
  // 户籍所在地
  householdsAddressCodeList = [];
  // 社保缴纳地
  socialSecurityAddressCodeList = [];
  // 公积金缴纳地
  accumulationFundAddressCodeList = [];
  // 获取办公地点
  /**
   * 
   * @param value 
   * @param type 类型 1:籍贯,2:户籍所在地,3: 社保缴纳地,4：公积金缴纳地
   */
  public onSearch(value: string, type?: number): void {
    this.isLoading = true;
    this.http.get(this.cityUrl + '/range', { params: { key: value } })
      .subscribe((res: any) => {
        if (res.code === 1) {
          if (type === 1) {
            this.originNameList = res.data;
          } else if (type === 2) {
            this.householdsAddressCodeList = res.data;
          } else if (type === 3) {
            this.socialSecurityAddressCodeList = res.data;
          } else if (type === 4) {
            this.accumulationFundAddressCodeList = res.data;
          } else {
            this.optionList = res.data;
          }
          this.isLoading = false;
        }
      });
  }

  /*
  * 获取下拉框数据
  * */
  getSelectData() {

    this.http.get(this.dictionaryUrl + 'service/dictionary/all')
      .subscribe((res: any) => {
        if (res.code === 0) {
          res.data.forEach((value: any, key: any) => {
            if (value.dictCode === 'DIC_ID_TYPE') {
              this.selectData0 = value.childrenDictionaries;
              this.certificateChange(this.employee.idType);
            }
            if (value.dictCode === 'DIC_NATIONALITY') {
              this.selectData1 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_POLITICAL_OUTLOOK') {
              this.selectData2 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_ZODIAC') {
              this.selectData3 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_CONTRACT_PERIOD') {
              this.selectData4 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_RENEW_NUMBER') {
              this.selectData5 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_RECRUIT_CHANNEL') {
              this.selectData6 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_EMPLOY_FORM') {
              this.selectData7 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_CONSTELLATION') {
              this.selectData8 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_DIMISSION_TYPE') {
              this.selectData9 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_HIGHEST_ENDUCATION_TYPE') {
              this.selectData10 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_HIGHEST_ENDUCATION') {
              this.selectData11 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_ENTERPRISE_SCALE') {
              this.selectData12 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_INDUSTRY') {
              this.selectData13 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_EMPLOYEE_STATUS') {
              this.selectData14 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_PROBATION_PERIOD') {
              this.selectData15 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_RECRUITMENT_CHANNEL') {
              this.selectData16 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_GENDER') {
              this.selectData17 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_MARRIAGE') {
              this.selectData18 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_NATION') {
              this.selectData19 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_BLOOD') {
              this.selectData20 = value.childrenDictionaries;
            }

          });

        } else {
          this.msg.error(res.message);
          this.loading = false;
        }
      });
  }
  /**
   * 将时间转换成yyyyMMddHHmmss类型的字符串
   * @param inDate 
   */
  dateTransformToString(inDate: Date | string | any, format?: string): string {
    let year = null,
      month = null,
      day = null,
      hour = null,
      minute = null,
      sec = null,
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
    hour = date.getHours();
    minute = date.getMinutes();
    sec = date.getSeconds();
    let returnStr = null;
    if (format === 'yyyyMM') {
      returnStr = '' + year + (month < 10 ? '0' + month : month);
    } else {
      returnStr = '' + year + (month < 10 ? '0' + month : month) +
        (day < 10 ? '0' + day : day) +
        (hour < 10 ? '0' + hour : hour) +
        (minute < 10 ? '0' + minute : minute) +
        (sec < 10 ? '0' + sec : sec);
    }
    return returnStr;
  }

  // 个人信息提交
  _submitForm() {
    this.isLoadingOne = true;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const obj = JSON.parse(JSON.stringify(this.form.value));
    obj['birthday'] = this.dateTransformToString(obj['birthday']);
    obj['joinPartyTime'] = this.dateTransformToString(obj['joinPartyTime']);
    obj['idCardFrontId'] = this.employee.idCardFrontId;
    obj['idCardBackId'] = this.employee.idCardBackId;
    obj['medicalExaminationReport'] = this.employee.medicalExaminationReport;
    obj['enterpriseId'] = this.tokenService.get().guid;
    if (this.tokenService.get().type === 1) {
      obj['userId'] = this.tokenService.get().guid;
    } else {
      obj['userId'] = this.tokenService.get().userId;
    }
    obj['delFileIds'] = this.delFileIds;
    this.http.patch(this.url + 'service/employee/' + this.guid, obj, { headers: headers })
      .subscribe((res: any) => {
        if (res.code === 0) {
          // this.dataList = res.data;
          this.msg.success('修改成功');
          this.router.navigate(['/personnel-admin/employee-info/']);
        } else {
          this.msg.error(res.message);
        }
        this.isLoadingOne = false;
        this.loading = false;
      }, response => {
        this.isLoadingOne = false;
        this.msg.error('系统异常');
        return;
      });
  }

  toHttpParams(obj: Object): HttpParams {
    let params = new HttpParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const val = obj[key];
        params = params.append(key, val);
      }
    }
    return params;
  }

  /*
  * 取消todo
  * */
  cancel() {
    this.router.navigate(['/personnel-admin/employee-info/index']);
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
    if (e === null || e === '') {

    } else {
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
    if (e === null || e === '') {

    } else {
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



  /*
  * 获取员工信息
  * */
  getEmployeeInfo() {
    this.http.get(this.url + 'service/employee/' + this.guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          // this.dataList = res.data;
          this.employee = res.data.employee;
          this.setFormValue();
          this.employee.name = res.data.employee.name;
          const obj1 = {
            uid: -1,
            name: '身份证正面.png',
            status: 'done',
            url: this.files_url + 'service/files/' + this.employee.idCardFrontId,
            response: {
              data: this.employee.idCardFrontId
            },
          };
          if (this.employee.idCardFrontId !== '') {
            this.fileList[0].push(obj1);
          }
          const obj2 = {
            uid: -2,
            name: '身份证反面.png',
            status: 'done',
            url: this.files_url + 'service/files/' + this.employee.idCardBackId,
            response: {
              data: this.employee.idCardBackId
            },
          };
          if (this.employee.idCardBackId !== '') {
            this.fileList[1].push(obj2);
          }
          const obj3 = {
            uid: -2,
            name: '体检报告.png',
            status: 'done',
            url: this.files_url + 'service/files/' + this.employee.medicalExaminationReport,
            response: {
              data: this.employee.medicalExaminationReport
            },
          };
          if (this.employee.medicalExaminationReport !== '') {
            this.fileList[2].push(obj3);
          }
          this.loading = false;
        } else {
          this.msg.error('没有数据');
          this.loading = false;
        }
      }, response => {
        this.msg.error('服务器错误');
        return;
      });
  }

  strTransFormDate(str: string) {
    if (str.match(/^[0-9]{8,14}$/)) {
      return new Date(str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2));
    } else if (str.match(/^[0-9]{6,14}$/)) {
      // console.log(new Date(str.substr(0, 4) + '-' + str.substr(4, 2)));
      return new Date(str.substr(0, 4) + '-' + str.substr(4, 2));
    } else {
      return '';
    }
  }
  to(item: any) {
    this.router.navigateByUrl(`${item.key}`).then();
  }
  ngOnInit(): void {
    if (this.tokenService.get().type === 1) {
      this.userID = this.tokenService.get().guid;
    } else {
      this.userID = this.tokenService.get().userId;
    }
    this.uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=ID_CARD_FRONT' + '&loginEid=' + this.tokenService.get().guid;
    this.uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=ID_CARD_BACK' + '&loginEid=' + this.tokenService.get().guid;
    this.uploadertj = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=MEDICAL_EXAMINATION_REPORT' + '&loginEid=' + this.tokenService.get().guid; // 体检报告

    // this.getStations();
    // this.getDepartmentLeaders();
    this.route.params
      .subscribe((params: Params) => {
        this.guid = params['guid'];
        this.tabs = [{
          key: '/personnel-admin/employee-info/indexs/user/' + this.guid,
          tab: '个人信息',
        }, {
          key: '/personnel-admin/employee-info/indexs/communication/' + this.guid,
          tab: '通讯信息',
        }, {
          key: '/personnel-admin/employee-info/indexs/position/' + this.guid,
          tab: '岗位信息',
        }, {
          key: '/personnel-admin/employee-info/indexs/contract/' + this.guid,
          tab: '合同信息',
        }, {
          key: '/personnel-admin/employee-info/indexs/social-security/' + this.guid,
          tab: '社保信息',
        }, {
          key: '/personnel-admin/employee-info/indexs/education/' + this.guid,
          tab: '教育信息',
        }, {
          key: '/personnel-admin/employee-info/indexs/employment/' + this.guid,
          tab: '从业信息',
        }, {
          key: '/personnel-admin/employee-info/indexs/title/' + this.guid,
          tab: '职称信息',
        }];
      });
    this.getEmployeeInfo();
    this.getProvinces();
    this.getSelectData();
    // this.getDepartList();
    this.setForm();
  }

  setForm() {
    this.form = this.fb.group({
      //  员工基本信息
      name: [this.employee.name, [Validators.required]],
      age: this.employee.age,
      idType: [this.employee.idType, [Validators.required]],
      idNumber: [this.employee.idNumber, [Validators.required]],
      gender: [this.employee.gender],
      birthday: [this.strTransFormDate(this.employee.birthday)],
      zodiac: [this.employee.zodiac],
      constellation: [this.employee.constellation],
      nationality: [this.employee.nationality],
      nativeProvinceId: [this.employee.nativeProvinceId],
      nativeCityId: [this.employee.nativeCityId],
      nativeAreasId: [this.employee.nativeAreasId],
      censusRegisterProvinceId: [this.employee.censusRegisterProvinceId],
      censusRegisterCityId: [this.employee.censusRegisterCityId],
      censusRegisterAreasId: [this.employee.censusRegisterAreasId],
      censusRegisterAddress: [this.employee.censusRegisterAddress],
      nation: [this.employee.nation],
      blood: [this.employee.blood],
      recruitmentType: [this.employee.recruitmentType],
      marriage: [this.employee.marriage],
      politicalOutlook: [this.employee.politicalOutlook],
      joinPartyTime: [this.strTransFormDate(this.employee.joinPartyTime)],
      fileOrganization: [this.employee.fileOrganization],
      haveChildren: [this.employee.haveChildren],
      childrenCommercialInsurance: [this.employee.childrenCommercialInsurance],
      haveIllegal: [this.employee.haveIllegal],
      haveMedicalHistory: [this.employee.haveMedicalHistory],
      // idCardFrontId: [this.employee.idCardFrontId],
      // idCardBackId: [this.employee.idCardBackId],
      enterpriseGuid: [this.employee.enterpriseGuid],
      userId: [this.employee.userId],
      remark: [this.employee.remark],
      accountsNature: [this.employee.accountsNature]
    });
  }
  setFormValue() {
    this.form.setValue({
      //  员工基本信息
      age: this.employee.age,
      name: this.employee.name,
      idType: this.employee.idType,
      idNumber: this.employee.idNumber,
      gender: this.employee.gender,
      birthday: this.strTransFormDate(this.employee.birthday),
      zodiac: this.employee.zodiac,
      constellation: this.employee.constellation,
      nationality: this.employee.nationality,
      nativeProvinceId: this.employee.nativeProvinceId,
      nativeCityId: this.employee.nativeCityId,
      nativeAreasId: this.employee.nativeAreasId,
      censusRegisterProvinceId: this.employee.censusRegisterProvinceId,
      censusRegisterCityId: this.employee.censusRegisterCityId,
      censusRegisterAreasId: this.employee.censusRegisterAreasId,
      censusRegisterAddress: this.employee.censusRegisterAddress,
      nation: this.employee.nation,
      blood: this.employee.blood,
      recruitmentType: this.employee.recruitmentType,
      marriage: this.employee.marriage,
      politicalOutlook: this.employee.politicalOutlook,
      joinPartyTime: this.strTransFormDate(this.employee.joinPartyTime),
      fileOrganization: this.employee.fileOrganization,
      haveChildren: this.employee.haveChildren,
      childrenCommercialInsurance: this.employee.childrenCommercialInsurance,
      haveIllegal: this.employee.haveIllegal,
      haveMedicalHistory: this.employee.haveMedicalHistory,
      // idCardFrontId: this.employee.idCardFrontId,
      // idCardBackId: this.employee.idCardBackId,
      enterpriseGuid: this.employee.enterpriseGuid,
      userId: this.employee.userId,
      remark: this.employee.remark,
      accountsNature: this.employee.accountsNature
    });
  }
}
