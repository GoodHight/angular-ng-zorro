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
  selector: 'social-security',
  templateUrl: './social-security.component.html',
  styleUrls: ['./social-security.component.less']
})
export class SocialSecurityComponent implements OnInit {
  public q: any = {
    pageNum: 1,
    pageSize: 200,
    dictTypeCode: '',
    dictName: ''
  };
  tabs = [];
  tab: any;
  public tabSelectIndex = 4;
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
  employeeWelfare = {  // 员工社保信息
    cardNumber: '', // 工资卡号
    bankOfdeposit: '', // 开户行
    insuranceNumber: '', // 社保账号
    iprovinceId: '', // 社保省
    icityId: '', // 社保市
    iareasId: '', // 社保区
    accumulationNumber: '',
    aprovinceId: '',
    acityId: '',
    aareasId: '',
    accumulationTime: '',
    userId: '',
    insuranceTime: '',
    payCard: '',
    sbguid: '' // 社保模块id
  };
  loading: false;
  /*
  * 员工Guid
  * */
  guid;

  url = environment.SERVER_URL + environment.ENTERPRISE_URL;
  private cityUrl = environment.FRAMEWORK_URL + 'service';
  // private dictionaryUrl = environment.FRAMEWORK_URL + 'service';
  private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
  private deptUrl = environment.SERVER_URL + environment.ENTERPRISE_URL;
  departmentOptions = [];
  workPhone;
  public isLoading = false;
  delFileIds = []; // 删除图片数组
  // 文件存放
  fileList = [[]];
  previewImage = '';
  previewVisible = false;
  userID = '';
  public files_url = environment.UPLOADER_URL + environment.FILE_URL;
  uploaderGradUrl = '';
  @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {

  }

  /*
  * 获取下拉框数据
  * */
  private getSelectData() {

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
        this.employeeWelfare.payCard = this.fileList[type][0].response.data || '';
      }
    } else if (info.file.status === 'removed') {
      if (type === 0) {
        this.employeeWelfare.payCard = '';
        this.delFileIds.push(info.file.response.data);
      }
    }
  }

  // 提交
  _submitForm() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const obj = JSON.parse(JSON.stringify(this.form.value));
    obj['enterpriseId'] = this.tokenService.get().guid;
    if (this.tokenService.get().type === 1) {
      obj['userId'] = this.tokenService.get().guid;
    } else {
      obj['userId'] = this.tokenService.get().userId;
    }
    obj['accumulationTime'] = this.dateTransformToString(obj['accumulationTime']);
    obj['insuranceTime'] = this.dateTransformToString(obj['insuranceTime']);
    obj['payCard'] = this.employeeWelfare.payCard;
    obj['delFileIds'] = this.delFileIds;
    this.http.patch(this.url + 'service/employee/welfare/' + this.guid, obj, { headers: headers })
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
          this.employeeWelfare = res.data.employeeWelfare;
          // // console.log(this.employeeWelfare);
          this.employeeWelfare.sbguid = res.data.employeeWelfare.guid;
          this.setFormValue();
          this.loading = false;
          const obj1 = {
            uid: -1,
            name: '学位证.png',
            status: 'done',
            url: this.files_url + 'service/files/' + this.employeeWelfare.payCard,
            response: {
              data: this.employeeWelfare.payCard
            },
          };
          if (this.employeeWelfare.payCard !== '') {
            this.fileList[0].push(obj1);
          }
        } else {
          this.msg.error('没有数据');
          this.loading = false;
        }
      }, response => {
        this.msg.error('系统错误');
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
    this.uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=PAY_CARD' + '&loginEid=' + this.tokenService.get().guid;
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
    this.getPaperType();
    this.setForm();
  }

  setForm() {
    this.form = this.fb.group({
      // 员工社保信息
      cardNumber: [this.employeeWelfare.cardNumber],
      bankOfdeposit: [this.employeeWelfare.bankOfdeposit],
      insuranceNumber: [this.employeeWelfare.insuranceNumber],
      iprovinceId: [this.employeeWelfare.iprovinceId],
      icityId: [this.employeeWelfare.icityId],
      iareasId: [this.employeeWelfare.iareasId],
      accumulationNumber: [this.employeeWelfare.accumulationNumber],
      aprovinceId: [this.employeeWelfare.aprovinceId],
      acityId: [this.employeeWelfare.acityId],
      aareasId: [this.employeeWelfare.aareasId],
      accumulationTime: [this.strTransFormDate(this.employeeWelfare.accumulationTime)],
      userId: [this.employeeWelfare.userId],
      insuranceTime: [this.strTransFormDate(this.employeeWelfare.insuranceTime)],
      guid: [this.employeeWelfare.sbguid],
    });
  }
  setFormValue() {
    this.form.setValue({
      // 员工社保信息
      cardNumber: this.employeeWelfare.cardNumber,
      bankOfdeposit: this.employeeWelfare.bankOfdeposit,
      insuranceNumber: this.employeeWelfare.insuranceNumber,
      iprovinceId: this.employeeWelfare.iprovinceId,
      icityId: this.employeeWelfare.icityId,
      iareasId: this.employeeWelfare.iareasId,
      accumulationNumber: this.employeeWelfare.accumulationNumber,
      aprovinceId: this.employeeWelfare.aprovinceId,
      acityId: this.employeeWelfare.acityId,
      aareasId: this.employeeWelfare.aareasId,
      accumulationTime: this.strTransFormDate(this.employeeWelfare.accumulationTime),
      userId: this.employeeWelfare.userId,
      insuranceTime: this.strTransFormDate(this.employeeWelfare.insuranceTime),
      guid: this.employeeWelfare.sbguid,
    });
  }
}
