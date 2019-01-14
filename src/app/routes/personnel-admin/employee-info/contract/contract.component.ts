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
  selector: 'contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.less']
})
export class ContractComponent implements OnInit {
  startValue: Date = null;
  endValue: Date = null;
  endOpen: any = false;
  endOpens: any = false;
  public q: any = {
    pageNum: 1,
    pageSize: 200,
    dictTypeCode: '',
    dictName: ''
  };
  tabs = [];
  public employeeContracttables: any = {
    contracttableStartTime: '', // 首次合同开始日期
    contracttableEndTime: '', // 首次合同结束日期
    contracttableNowstartTime: '',
    contracttableNowendTime: '',
    contracttableTime: '',
    renewalNum: '',
    fileIds: [],
    userId: '', // 
    htGuid: '', // 合同模块id
    employeeGuid: ''
  };
  selectData4 = [];
  selectData5 = [];
  tab: any;
  public tabSelectIndex = 3;
  uuid = this.tokenService.get().guid;
  type: any;
  phone: any;
  kongkong = '';
  public form: FormGroup;
  realName;
  dateFormat: 'yyyyMMdd';
  delFileIds = []; // 删除图片数组
  // 文件存放
  fileList = [];
  previewImage = '';
  previewVisible = false;
  uploaderUrl = '';
  userID = '';
  loading: false;
  /*
  * 员工Guid
  * */
  guid;

  url = environment.SERVER_URL + environment.ENTERPRISE_URL;
  private cityUrl = environment.FRAMEWORK_URL + 'service';
  // private dictionaryUrl = environment.FRAMEWORK_URL + 'service';
  private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
  departmentOptions = [];
  public isLoading = false;
  @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
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
  /*
  * 获取下拉框数据
  * */
  private getSelectData() {

    this.http.get(this.dictionaryUrl + 'service/dictionary/all')
      .subscribe((res: any) => {
        if (res.code === 0) {
          res.data.forEach((value: any, key: any) => {
            if (value.dictCode === 'DIC_CONTRACT_PERIOD') {
              this.selectData4 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_RENEW_NUMBER') {
              this.selectData5 = value.childrenDictionaries;
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
  //
  //
  // 上下区分
  //
  disabledStartDates = (startValue: Date): any => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  }

  disabledEndDates = (endValue: Date): any => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  }
  onStartChanges(date: Date): void {
    // console.log(date);

    this.startValue = date;
  }

  onEndChanges(date: Date): void {
    // console.log(date);
    this.endValue = date;
  }

  handleStartOpenChanges(open: any): void {
    if (!open) {
      this.endOpens = true;
    }
    // // console.log('handleStartOpenChange', open, this.endOpen);
  }

  handleEndOpenChanges(open: any): void {
    this.endOpens = open;
  }



  // 提交
  _submitForm() {
    // console.log();

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const objs = [];
    const obj = JSON.parse(JSON.stringify(this.form.value));
    obj['contracttableStartTime'] = this.dateTransformToString(obj['contracttableStartTime']);
    obj['contracttableEndTime'] = this.dateTransformToString(obj['contracttableEndTime']);
    obj['contracttableNowstartTime'] = this.dateTransformToString(obj['contracttableNowstartTime']);
    obj['contracttableNowendTime'] = this.dateTransformToString(obj['contracttableNowendTime']);
    obj['enterpriseId'] = this.tokenService.get().guid;
    if (this.tokenService.get().type === 1) {
      obj['userId'] = this.tokenService.get().guid;
    } else {
      obj['userId'] = this.tokenService.get().userId;
    }
    obj['guid'] = this.employeeContracttables.htGuid;
    obj['fileIds'] = [];
    this.fileList.forEach(value => {
      obj['fileIds'].push(value.response);
    });
    obj['delFileIds'] = this.delFileIds;
    objs.push(obj);
    this.http.patch(this.url + 'service/employee/contracttable/' + this.guid, objs, { headers: headers })
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
  * 获取员工信息
  * */
  getEmployeeInfo() {
    this.http.get(this.url + 'service/employee/' + this.guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          if (res.data.employeeContracttables.length > 0) {
            this.employeeContracttables = res.data.employeeContracttables[0];
            this.employeeContracttables.htGuid = res.data.employeeContracttables[0].guid;
            this.fileList = this.employeeContracttables.fileIds;
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
          }
          this.setFormValue();
          // this.phone = res.data.employeeContacts[0].employeeContacts;
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
    this.uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=COMPACT' + '&loginEid=' + this.tokenService.get().guid;
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
    this.getSelectData();
    // this.getDepartList();
    this.setForm();
  }

  setForm() {
    this.form = this.fb.group({
      // 员工合同信息
      contracttableStartTime: [this.strTransFormDate(this.employeeContracttables.contracttableStartTime)],
      contracttableEndTime: [this.strTransFormDate(this.employeeContracttables.contracttableEndTime)],
      contracttableNowstartTime: [this.strTransFormDate(this.employeeContracttables.contracttableNowstartTime)],
      contracttableNowendTime: [this.strTransFormDate(this.employeeContracttables.contracttableNowendTime)],
      contracttableTime: [this.employeeContracttables.contracttableTime],
      renewalNum: [this.employeeContracttables.renewalNum],
      // fileIds: [this.employeeContracttables.fileIds],
      userId: [this.employeeContracttables.userId],
      guid: [this.employeeContracttables.htGuid],
      employeeGuid: [this.employeeContracttables.employeeGuid],
    });
  }
  setFormValue() {
    this.form.setValue({
      // 员工合同信息
      contracttableStartTime: this.strTransFormDate(this.employeeContracttables.contracttableStartTime),
      contracttableEndTime: this.strTransFormDate(this.employeeContracttables.contracttableEndTime),
      contracttableNowstartTime: this.strTransFormDate(this.employeeContracttables.contracttableNowstartTime),
      contracttableNowendTime: this.strTransFormDate(this.employeeContracttables.contracttableNowendTime),
      contracttableTime: this.employeeContracttables.contracttableTime,
      renewalNum: this.employeeContracttables.renewalNum,
      // fileIds: this.employeeContracttables.fileIds,
      userId: this.employeeContracttables.userId,
      guid: this.employeeContracttables.htGuid,
      employeeGuid: this.employeeContracttables.employeeGuid,
    });
  }
}
