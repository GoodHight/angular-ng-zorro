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
  selector: 'employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.less']
})
export class EmploymentComponent implements OnInit {
  tabs = [];
  startValue: Date = null;
  endValue: Date = null;
  endOpen: any = false;
  endOpens: any = false;
  tab: any;
  public tabSelectIndex = 6;
  uuid = this.tokenService.get().guid;
  userID: ''; // 操作者id
  type: any;
  public form: FormGroup;
  dateFormat: 'yyyyMMdd';
  templateimgUrl = '';
  dimission = '';
  deleteguid = '';
  sisVisible = false;
  isVisibless = false;
  isVisible = false;
  loading: false;
  userEmployments: any = [];
  egitlist: any = [];
  public files_url = environment.UPLOADER_URL + environment.FILE_URL;
  // 文件存放
  fileList = [[], []];
  delFileIds = []; // 删除图片数组
  previewImage = '';
  previewVisible = false;
  uploaderUrl = '';
  uploaderGradUrl = '';
  guid;
  titlename = '';
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
        this.dimission = this.fileList[type][0].response.data || '';
      } else if (type === 1) {
        // this.diploma = this.fileList[type][0].response.data || '';
      }
    } else if (info.file.status === 'removed') {
      if (type === 0) {
        this.dimission = '';
        this.delFileIds.push(info.file.response.data);
      } else if (type === 1) {
        
      }
    }
  }

  //
  disabledStartDates = (startValue: Date): any => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue > this.endValue;
  }

  disabledEndDates = (endValue: Date): any => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue <= this.startValue;
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

  // 查看

  showModalss(templateFileId): void {
    // console.log(templateFileId);
    this.isVisibless = true;
    this.templateimgUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + templateFileId;
  }
  Cancel(): void {
    this.isVisibless = false;
  }
  Ok(): void {
    this.isVisibless = false;
  }

  handleOkss(): void {
    this.isVisibless = false;
  }
  /*
  * 取消todo
  * */
  cancel() {
    this.router.navigate(['/peoplecenter/information']);
  }

  /*
  * 获取个人信息
  * */
  private getEnterprise() {
    this.http.get(this.url + 'service/employee/' + this.guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.userEmployments = res.data.employeeEmployments;
        }
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

  showModal(e): void {
    this.fileList[0] = [];
    this.isVisible = true;
    if (e === '1') {
      this.titlename = '新增从业信息';
      this.egitlist = [];
      this.setFormValues();
    } else {
      this.titlename = '编辑从业信息';
      this.userEmployments.forEach(value => {
        if (value.guid === e) {
          this.egitlist = value;
        }
      });
      this.dimission = this.egitlist.dimission;
      this.setFormValue();
      const obj1 = {
        uid: -1,
        name: '学位证.png',
        status: 'done',
        url: this.files_url + 'service/files/' + this.egitlist.dimission,
        response: {
          data: this.egitlist.dimission
        },
      };
      if (this.egitlist.dimission !== '') {
        this.fileList[0].push(obj1);
      }
    }

  }

  handleOk(): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const objs = [];
    const obj = JSON.parse(JSON.stringify(this.form.value));
    // console.log(obj);

    obj['entryTime'] = this.dateTransformToString(obj['entryTime']);
    obj['quitTime'] = this.dateTransformToString(obj['quitTime']);
    obj['dimission'] = this.dimission;
    obj['delFileIds'] = this.delFileIds;
    objs.push(obj);
    this.http.patch(this.url + 'service/employee/employment/' + this.guid, objs, { headers: headers })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.msg.success('操作成功');
          this.getEnterprise();
          // this.router.navigate(['/personnel-admin/employee-info/']);
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;
      }, response => {
        this.msg.error('系统异常');
        return;
      });
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
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
    this.getEnterprise();
    this.uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=DIMISSION' + '&loginEid=' + this.tokenService.get().guid;
    // this.getEmployeeInfo();
    // this.getDepartList();
    this.setForm();
  }

  setForm() {
    this.form = this.fb.group({
      enterpriseName: [''], // 
      entryTime: [''], // 时间
      quitTime: [''], //  时间
      position: [''], // 
      positionDescription: [''],  // 
      userGuid: [this.userID],
      guid: [''],
    });
  }
  setFormValue() {
    this.form.setValue({
      enterpriseName: this.egitlist.enterpriseName, // 
      entryTime: this.strTransFormDate(this.egitlist.entryTime),
      quitTime: this.strTransFormDate(this.egitlist.quitTime),
      position: this.egitlist.position,
      positionDescription: this.egitlist.positionDescription,
      userGuid: this.userID,
      guid: this.egitlist.guid,
    });
  }
  setFormValues() {
    this.form.setValue({
      enterpriseName: '', // 
      entryTime: '', // 
      quitTime: '', // 
      position: '', // 
      positionDescription: '', // 
      userGuid: this.userID,
      guid: '', //  
    });
  }
  shandleOk(): void {
    this.http.delete(this.url + 'service/employee/deleteEmployment/' + this.deleteguid, {
      params: {
        enterpriseId: this.tokenService.get().guid,
        userId: this.userID
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('删除成功');
        this.getEnterprise();
      } else {
        this.msg.error(res.message);
      }
    });
    this.sisVisible = false;
  }

  shandleCancel(): void {
    this.sisVisible = false;
  }
  delete(guid) {
    this.deleteguid = guid;
    this.sisVisible = true;
  }
}
