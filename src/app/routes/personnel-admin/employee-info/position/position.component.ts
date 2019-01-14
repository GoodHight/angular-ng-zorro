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
  selector: 'position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.less']
})
export class PositionComponent implements OnInit {
  public q: any = {
    pageNum: 1,
    pageSize: 200,
    dictTypeCode: '',
    dictName: ''
  };
  tabs = [];
  tab: any;
  public tabSelectIndex = 2;
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
  public txform: FormGroup;
  realName;
  dateFormat: 'yyyyMMdd';
  // 工作性质
  workTypeList = [];
  employeeStation = {  // 员工岗位信息
    status: '', // 员工状态（0正式员工，1试用，2离职）
    entryTime: '', // 入职日期
    probationTime: '', // 试用期限
    fullmemTime: '', // 转正时间
    fullmemMoney: '', // 转正工资
    trialMoney: '', // 试用工资
    fullmemEvaluate: '', // 转正评价
    fileIds: [], // 转正附件IDs
    workType: '', // 工作性质
    workTime: '', // 工作年龄(年)
    departmentId: '', // 部门
    employeeGuid: '', // 
    guid: '', // 员工id
    managerId: '', //  直属部门主管
    position: '', // 职位
    stationId: '', // 岗位id
    stationTime: '', // 调岗时间
    stationReason: '', // 调岗原因
    jobNumber: '', // 工号
    name: '', // 员工姓名
    userId: '', // 
    gwGuid: ''
  };
  positionName: '123132';
  gangweilist = [];
  employeeName = ''; // 部门领导
  userID = '';
  delFileIds = []; // 删除图片数组
  // 文件存放
  fileList = [];
  previewImage = '';
  previewVisible = false;
  uploaderUrl = '';

  loading: false;
  isVisible = false;
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
  @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {

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
              for (let i = 0; i < this.selectData14.length; i++) {
                if (this.selectData14[i].dictName === '离职') {
                  const member2 = this.selectData14[i];
                  this.selectData14.splice(i, 1);
                  break;
                }
              }
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
            if (value.dictCode === 'DIC_WORK_TYPE') {
              this.workTypeList = value.childrenDictionaries;
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
      // Get this url from response in real world.
      this.msg.success('上传成功');
      const length = this.fileList.length;
      const obj1 = {
        uid: info.file.uid,
        name: info.file.name,
        status: 'done',
        url: './assets/img/template/other.png',
        response: info.file.response.data
      };
      this.fileList[length - 1] = obj1;
    } else if (info.file.status === 'removed') {
      this.delFileIds.push(info.file.response);
    }
  }
  // 提交
  _submitForm() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const obj = JSON.parse(JSON.stringify(this.form.value));
    obj['entryTime'] = this.dateTransformToString(obj['entryTime']);
    obj['fullmemTime'] = this.dateTransformToString(obj['fullmemTime']);
    obj['stationTime'] = this.dateTransformToString(obj['stationTime']);
    obj['enterpriseId'] = this.tokenService.get().guid;
    if (this.tokenService.get().type === 1) {
      obj['userId'] = this.tokenService.get().guid;
    } else {
      obj['userId'] = this.tokenService.get().userId;
    }
    obj['fileIds'] = [];
    this.fileList.forEach(value => {
      obj['fileIds'].push(value.response);
    });
    obj['delFileIds'] = this.delFileIds;
    this.http.patch(this.url + 'service/employee/station/' + this.guid, obj, { headers: headers })
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
  // 查询领导
  PaperChange(e) {
    this.employeeStation.managerId = '';
    this.http.get(this.deptUrl + 'service/enterprise/dept/' + e)
      .subscribe((res: any) => {
        if (res.code === 0) {
          // console.log(res);
          this.employeeStation.managerId = res.data.employeeName;
        } else {
          this.msg.error(res.message);
          this.loading = false;
        }
      });
  }

  /* 
    获取岗位
*/
  getgangwei() {
    this.http.get(this.deptUrl + 'service/station/enterprise/', {
      params: {
        enterpriseGuid: this.tokenService.get().guid
      }
    })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.gangweilist = res.data;
        } else {
          this.msg.error(res.message);
          this.loading = false;
        }
      });
  }

  showModal() {
    this.isVisible = true;
  }

  handleOk() {
    this.isVisible = false;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const obj = {
      enterpriseGuid: this.tokenService.get().guid,
      enterpriseId: this.tokenService.get().guid,
      name: this.positionName,
      userId: this.tokenService.get().guid,
    };
    this.http.post(this.url + 'service/station/', obj, { headers: headers }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('新增成功', { nzDuration: 3000 });
        this.loading = false;
        // 清空路由复用信息
        this.getgangwei();
      } else {
        this.msg.error(res.message, { nzDuration: 3000 });
      }

    }, response => {
      // console.log('POST call in error', response);
      return;
    });
    // this.http.post()
    // console.log('/');

  }

  handleCancel() {
    this.isVisible = false;
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
          // this.ganwei = res.data;
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
  /* 
      获取区
  */
  CountyListChange(e) {
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


  /*
  * 获取员工信息
  * */
  getEmployeeInfo() {
    this.http.get(this.url + 'service/employee/' + this.guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.employeeStation = res.data.employeeStation;
          this.employeeStation.gwGuid = res.data.employeeStation.guid;
          this.setFormValue();
          this.realName = res.data.employee.name;
          this.fileList = this.employeeStation.fileIds;
          // const fileIdslength = this.employeeStation.fileIds.length;
          if (this.fileList.length > 0) {
            for (let index = 0; index < this.fileList.length; index++) {
              const obj2 = {
                uid: this.fileList[index],
                name: '转正附件',
                status: 'done',
                url: './assets/img/template/other.png',
                response: this.fileList[index]
              };
              this.fileList[index] = obj2;
            }
            // console.log(this.fileList);
          }
          this.loading = false;
        } else {
          this.msg.error('没有数据');
          this.loading = false;
        }
      }, response => {
        this.msg.error('系统异常');
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
    this.uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=FULLMEMBER' + '&loginEid=' + this.tokenService.get().guid;
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
    this.getgangwei();
  }

  setForm() {
    this.form = this.fb.group({
      // 员工岗位信息
      status: [this.employeeStation.status],
      entryTime: [this.strTransFormDate(this.employeeStation.entryTime)],
      probationTime: [this.employeeStation.probationTime],
      fullmemTime: [this.strTransFormDate(this.employeeStation.fullmemTime)],
      fullmemMoney: [this.employeeStation.fullmemMoney],
      trialMoney: [this.employeeStation.trialMoney],
      fullmemEvaluate: [this.employeeStation.fullmemEvaluate],
      workTime: [this.employeeStation.workTime],
      departmentId: [this.employeeStation.departmentId, [Validators.required]],
      managerId: [this.employeeStation.managerId],
      position: [this.employeeStation.position],
      stationId: [this.employeeStation.stationId],
      stationTime: [this.strTransFormDate(this.employeeStation.stationTime)],
      stationReason: [this.employeeStation.stationReason],
      jobNumber: [this.employeeStation.jobNumber],
      userId: [this.employeeStation.userId],
      guid: [this.employeeStation.gwGuid],
      employeeGuid: [this.employeeStation.employeeGuid],
      workType: [this.employeeStation.workType],
      // fileIds: [this.employeeStation.fileIds],
    });
  }
  setFormValue() {
    this.form.setValue({
      // 员工岗位信息
      status: this.employeeStation.status,
      entryTime: this.strTransFormDate(this.employeeStation.entryTime),
      probationTime: this.employeeStation.probationTime,
      fullmemTime: this.strTransFormDate(this.employeeStation.fullmemTime),
      fullmemMoney: this.employeeStation.fullmemMoney,
      trialMoney: this.employeeStation.trialMoney,
      fullmemEvaluate: this.employeeStation.fullmemEvaluate,
      workTime: this.employeeStation.workTime,
      departmentId: this.employeeStation.departmentId,
      managerId: this.employeeStation.managerId,
      position: this.employeeStation.position,
      stationId: this.employeeStation.stationId,
      stationTime: this.strTransFormDate(this.employeeStation.stationTime),
      stationReason: this.employeeStation.stationReason,
      jobNumber: this.employeeStation.jobNumber,
      userId: this.employeeStation.userId,
      guid: this.employeeStation.gwGuid,
      // fileIds: this.employeeStation.fileIds,
      employeeGuid: this.employeeStation.employeeGuid,
      workType: this.employeeStation.workType,

    });
  }
}
