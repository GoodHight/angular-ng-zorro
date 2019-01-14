import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { _Validators } from '@delon/util';

@Component({
  selector: 'communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.less']
})
export class CommunicationComponent implements OnInit {
  startValue: Date = null;
  endValue: Date = null;
  endOpen: any = false;
  public q: any = {
    pageNum: 1,
    pageSize: 200,
    dictTypeCode: '',
    dictName: ''
  };
  public tabSelectIndex = 1;
  tabs: any;
  // 部门领导列表
  departmentLeaders = [];
  // 岗位列表
  stations = [];
  certificateNumber: any;
  gender: any;
  age: any;
  birthday;
  zodiac;
  constellation: any;
  origin: any;
  nation;
  city: any;
  entryTime: any;
  departmentName: any;
  directDepartmentHead: any;
  postion: any;
  workNumber: any;
  major: any;
  remark: any;
  departmentGuid: any;
  uuid = this.tokenService.get().guid;
  type: any;
  phone: any;
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
  realName;
  dateFormat: 'yyyyMMdd';

  employeeContacts = { // 员工通讯信息
    phone: '', // 
    hidePhone: 0, //  是否隐藏手机号(0=不隐藏  1=隐藏)
    workEmail: '', //  企业邮箱
    qq: '', //  qq
    wechat: '', // 微信
    extNumber: '', // 分机号
    workProvinceId: '', // 办公地点-省id
    workCityId: '', // 办公地点-市id
    workAreasId: '', // 办公地点-区id
    workAddress: '', // 办公地点详细地址
    liveProvinceId: '', // 居住地-省id
    liveCityId: '', // 居住地-市id
    liveAreasId: '', // 居住地-区id
    liveAddress: '', // 居住地详细地址
    liveStartDate: '', // 居住证到期(结束)日期
    liveEndDate: '', // 居住证到期(结束)日期
    email: '', // 个人邮箱
    emergencyContact: '', // 紧急联系人姓名
    emergencyPhone: '', // 紧急联系人电话
    relation: '', // 关系
    provinceId: '', // 联系地址-省id
    cityId: '', // 联系地址-市id
    areasId: '', // 联系地址-区id
    address: '', // 联系地址详细地址
    userId: '', // 
    txGuid: '', // 通讯模块id
  };
  hidePhone = [{
    guid: 0,
    dictName: '否',
  }, {
    guid: 1,
    dictName: '是',
  }];
  loading: false;
  /*
  * 员工Guid
  * */
  guid;
  // 户籍、籍贯、办公地点、社保、公积金等下拉框选项数据
  public optionList = [];
  url = environment.SERVER_URL + environment.ENTERPRISE_URL;
  private cityUrl = environment.FRAMEWORK_URL + 'service';
  private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
  public cityData: any[];
  departmentOptions = [];
  workPhone;
  public isLoading = false;
  @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {

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



  disabledStartDate = (startValue: Date): any => {
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
  }

  handleStartOpenChange(open: any): void {
    if (!open) {
      this.endOpen = true;
    }
    // // console.log('handleStartOpenChange', open, this.endOpen);
  }

  handleEndOpenChange(open: any): void {
    this.endOpen = open;
  }


  /*
  * 获取下拉框数据
  * */
  getSelectData() {

    this.http.get(this.dictionaryUrl + 'service/dictionary/all')
      .subscribe((res: any) => {
        if (res.code === 0) {
          res.data.forEach((value: any, key: any) => {
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

  // 提交
  _submitForm() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const obj = JSON.parse(JSON.stringify(this.form.value));
    obj['liveEndDate'] = this.dateTransformToString(obj['liveEndDate']);
    obj['liveStartDate'] = this.dateTransformToString(obj['liveStartDate']);
    obj['enterpriseId'] = this.tokenService.get().guid;
    if (this.tokenService.get().type === 1) {
      obj['userId'] = this.tokenService.get().guid;
    } else {
      obj['userId'] = this.tokenService.get().userId;
    }
    const dataLits = [];
    dataLits.push(obj);
    this.http.patch(this.url + 'service/employee/contact/' + this.guid, dataLits, { headers: headers })
      .subscribe((res: any) => {
        if (res.code === 0) {
          // this.dataList = res.data;
          this.msg.success('修改成功');
          this.router.navigate(['/personnel-admin/employee-info/']);
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;
      }, response => {
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
  * 获取部门
  * */
  public getDepartList() {
    this.http.get(this.url + '/department/employee-part', {
      params: {
        enterpriseGuid: this.tokenService.get().loginEid
      }
    })
      .subscribe((res: any) => {
        if (res.code === 1) {
          this.departmentOptions = res.data;
        }
      });
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
          this.employeeContacts = res.data.employeeContacts[0];
          this.employeeContacts.txGuid = res.data.employeeContacts[0].guid;
          this.setFormValue();
          this.realName = res.data.employee.name;
          this.phone = res.data.employeeContacts[0].employeeContacts;
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

      // 员工通讯信息
      phone: [this.employeeContacts.phone, [Validators.required, _Validators.mobile]],
      hidePhone: [this.employeeContacts.hidePhone],
      workEmail: [this.employeeContacts.workEmail, [Validators.email]],
      qq: [this.employeeContacts.qq, [Validators.pattern(/^[0-9]{5,11}$/)]],
      wechat: [this.employeeContacts.wechat],
      extNumber: [this.employeeContacts.extNumber],
      workProvinceId: [this.employeeContacts.workProvinceId],
      workCityId: [this.employeeContacts.workCityId],
      workAreasId: [this.employeeContacts.workAreasId],
      workAddress: [this.employeeContacts.workAddress],
      liveProvinceId: [this.employeeContacts.liveProvinceId],
      liveCityId: [this.employeeContacts.liveCityId],
      liveAreasId: [this.employeeContacts.liveAreasId],
      liveAddress: [this.employeeContacts.liveAddress],
      liveStartDate: [this.strTransFormDate(this.employeeContacts.liveStartDate)],
      liveEndDate: [this.strTransFormDate(this.employeeContacts.liveEndDate)],
      email: [this.employeeContacts.email, [Validators.email]],
      emergencyContact: [this.employeeContacts.emergencyContact],
      emergencyPhone: [null, [Validators.pattern(/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/)]],
      relation: [this.employeeContacts.relation],
      provinceId: [this.employeeContacts.provinceId],
      cityId: [this.employeeContacts.cityId],
      areasId: [this.employeeContacts.areasId],
      address: [this.employeeContacts.address],
      userId: [this.employeeContacts.userId],
      guid: [this.employeeContacts.txGuid],
    });
  }
  setFormValue() {
    this.form.setValue({
      // 员工通訊信息
      phone: this.employeeContacts.phone,
      hidePhone: this.employeeContacts.hidePhone,
      workEmail: this.employeeContacts.workEmail,
      qq: this.employeeContacts.qq,
      wechat: this.employeeContacts.wechat,
      extNumber: this.employeeContacts.extNumber,
      workProvinceId: this.employeeContacts.workProvinceId,
      workCityId: this.employeeContacts.workCityId,
      workAreasId: this.employeeContacts.workAreasId,
      workAddress: this.employeeContacts.workAddress,
      liveProvinceId: this.employeeContacts.liveProvinceId,
      liveCityId: this.employeeContacts.liveCityId,
      liveAreasId: this.employeeContacts.liveAreasId,
      liveAddress: this.employeeContacts.liveAddress,
      liveStartDate: this.strTransFormDate(this.employeeContacts.liveStartDate),
      liveEndDate: this.strTransFormDate(this.employeeContacts.liveEndDate),
      email: this.employeeContacts.email,
      emergencyContact: this.employeeContacts.emergencyContact,
      emergencyPhone: this.employeeContacts.emergencyPhone ? this.employeeContacts.emergencyPhone : null,
      relation: this.employeeContacts.relation,
      provinceId: this.employeeContacts.provinceId,
      cityId: this.employeeContacts.cityId,
      areasId: this.employeeContacts.areasId,
      address: this.employeeContacts.address,
      userId: this.employeeContacts.userId,
      guid: this.employeeContacts.txGuid,
    });
  }
}
