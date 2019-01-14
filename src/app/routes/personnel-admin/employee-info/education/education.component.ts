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
  selector: 'education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.less']
})
export class EducationComponent implements OnInit {
  tabs = [];

  tab: any;
  public tabSelectIndex = 5;
  uuid = this.tokenService.get().guid;
  type: any;
  public form: FormGroup;
  dateFormat: 'yyyyMMdd';
  loading = false;
  userEducations: any = []; // 教育信息
  selectData10: any = []; // 
  selectData11: any = []; // 
  egitlist: any = []; // 
  isVisibless = false;
  isVisible = false;
  sisVisible = false;
  templateimgUrl = '';
  graduationCertificate = '';
  diploma = '';
  deleteguid = '';
  userID: ''; // 操作者id
  // 文件存放
  fileList = [[], []];
  delFileIds = []; // 删除图片数组
  previewImage = '';
  previewVisible = false;
  uploaderUrl = '';
  uploaderGradUrl = '';
  public files_url = environment.UPLOADER_URL + environment.FILE_URL;
  /*
  * 员工Guid
  * */
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
  // 提交
  _submitForm() {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');
    // const obj = JSON.parse(JSON.stringify(this.form.value));
    // obj['titleTime'] = this.dateTransformToString(obj['titleTime']);
    // obj['enterpriseId'] = this.tokenService.get().guid;
    // if (this.tokenService.get().type === 1) {
    //   obj['userId'] = this.tokenService.get().guid;
    // } else {
    //   obj['userId'] = this.tokenService.get().userId;
    // }
    // this.http.patch(this.url + 'service/employee/title/' + this.guid, obj, { headers: headers })
    //   .subscribe((res: any) => {
    //     if (res.code === 0) {
    //       // this.dataList = res.data;
    //       this.msg.success('修改成功');
    //       this.router.navigate(['/personnel-admin/employee-info/']);
    //     } else {
    //       this.msg.error(res.message);
    //     }
    //     this.loading = false;
    //   }, response => {
    //     this.msg.error('系统异常');
    //     return;
    //   });
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
        this.graduationCertificate = this.fileList[type][0].response.data || '';
      } else if (type === 1) {
        this.diploma = this.fileList[type][0].response.data || '';
      }
    } else if (info.file.status === 'removed') {
      if (type === 0) {
        this.graduationCertificate = '';
        this.delFileIds.push(info.file.response.data);
      } else if (type === 1) {
        this.diploma = '';
        this.delFileIds.push(info.file.response.data);
      }
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
            if (value.dictCode === 'DIC_HIGHEST_ENDUCATION_TYPE') {
              this.selectData10 = value.childrenDictionaries;
            }
            if (value.dictCode === 'DIC_HIGHEST_ENDUCATION') {
              this.selectData11 = value.childrenDictionaries;
            }
          });
        } else {
          this.msg.error(res.message);
          this.loading = false;
        }
      });
  }
  showModal(e): void {
    this.fileList[0] = [];
    this.fileList[1] = [];
    if (e === '1') {
      this.egitlist = [];
      this.isVisible = true;
      this.setFormValues();
      this.titlename = '新增教育信息';
    } else {

      this.titlename = '编辑教育信息';
      this.userEducations.forEach(value => {
        if (value.guid === e) {
          this.egitlist = value;
        }
      });
      this.setFormValue();
      this.diploma = this.egitlist.diploma;
      this.graduationCertificate = this.egitlist.graduationCertificate;
      this.isVisible = true;
      const obj1 = {
        uid: -1,
        name: '学位证.png',
        status: 'done',
        url: this.files_url + 'service/files/' + this.egitlist.diploma,
        response: {
          data: this.egitlist.diploma
        },
      };
      if (this.egitlist.diploma !== '') {
        this.fileList[1].push(obj1);
      }
      const obj2 = {
        uid: -1,
        name: '毕业证.png',
        status: 'done',
        url: this.files_url + 'service/files/' + this.egitlist.graduationCertificate,
        response: {
          data: this.egitlist.graduationCertificate
        },
      };
      if (this.egitlist.graduationCertificate !== '') {
        this.fileList[0].push(obj2);
      }
    }

  }

  handleOk(): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const objs = [];
    const obj = JSON.parse(JSON.stringify(this.form.value));
    obj['entryTime'] = this.dateTransformToString(obj['entryTime']);
    obj['graduateTime'] = this.dateTransformToString(obj['graduateTime']);
    obj['diploma'] = this.diploma;
    obj['graduationCertificate'] = this.graduationCertificate;
    obj['delFileIds'] = this.delFileIds;
    objs.push(obj);
    this.loading = true;
    this.http.patch(this.url + 'service/employee/education/' + this.guid, objs, { headers: headers })
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
  /*
  * 取消todo
  * */
  cancel() {
    this.router.navigate(['/personnel-admin/employee-info/index']);
  }

  /*
  * 获取个人信息
  * */
  private getEnterprise() {
     this.http.get(this.url + 'service/employee/' + this.guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.userEducations = res.data.employeeEducations;
          this.loading = false;
        } else {
          this.msg.error(res.message);
          this.loading = false;
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

  to(item: any) {
    this.router.navigateByUrl(`${item.key}`).then();
  }
  ngOnInit(): void {
    this.loading = true;
    this.getSelectData();
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
    this.uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=GRADUATION_CERTIFICATE' + '&loginEid=' + this.tokenService.get().guid;
    this.uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=DIPLOMA' + '&loginEid=' + this.tokenService.get().guid;
    // this.getEmployeeInfo();
    // this.getDepartList();
    this.getEnterprise();
    this.setForm();
  }

  setForm() {
    this.form = this.fb.group({
      // 员工教育信息
      schoolName: [''], // 学习名称
      major: [''], // 专业
      entryTime: [''], // 入学时间
      graduateTime: [''], //  毕业时间
      educationType: [''], // 学历类型(0统招，1自考，2成考)
      education: [''],  // 学历
      graduationCertificate: [''], // 毕业证书
      diploma: [''], // 学位证书
      userGuid: [this.userID],
      guid: [''],
      employeeGuid: [this.guid],
    });
  }
  setFormValue() {
    this.form.setValue({
      // 员工教育信息
      schoolName: this.egitlist.schoolName, // 学习名称
      major: this.egitlist.major, // 专业
      entryTime: this.strTransFormDate(this.egitlist.entryTime), // 入学时间
      graduateTime: this.strTransFormDate(this.egitlist.graduateTime), //  毕业时间
      educationType: this.egitlist.educationType, // 学历类型(0统招，1自考，2成考)
      education: this.egitlist.education, // 学历
      graduationCertificate: this.egitlist.graduationCertificate, // 毕业证书
      diploma: this.egitlist.diploma, // 学位证书
      userGuid: this.userID,
      guid: this.egitlist.guid,
      employeeGuid: this.guid,
    });
  }
  setFormValues() {
    this.form.setValue({
      // 员工教育信息
      schoolName: '', // 学习名称
      major: '', // 专业
      entryTime: '', // 入学时间、
      graduateTime: '', //  毕业时间
      educationType: '', // 学历类型(0统招，1自考，2成考)
      education: '', // 学历
      graduationCertificate: '', // 毕业证书
      diploma: '', // 学位证书
      userGuid: this.userID,
      guid: '',
      employeeGuid: this.guid,
    });
  }

  shandleOk(): void {
    this.loading = true;
    this.http.delete(this.url + 'service/employee/deleteEducation/' + this.deleteguid, {
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
        this.loading = false;
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
