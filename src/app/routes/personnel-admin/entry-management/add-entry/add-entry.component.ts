import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';


@Component({
  selector: 'add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.less']
})
export class AddEntryComponent implements OnInit {

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
  hrmEntrySettingDTO = {
    contactFlag: '0',
    educationFlag: '0',
    employmentFlag: '0',
    entryGuid: '',
    fileFlag: '0',
    guid: '',
    salaryFlag: '0',
    titleFlag: '0',
    trainingFlag: '0',
    welfareFlag: '0',
  };
  viewModelSelect: any = {
    contactFlag: false,
    educationFlag: false,
    employmentFlag: false,
    entryGuid: false,
    fileFlag: false,
    guid: false,
    salaryFlag: false,
    titleFlag: false,
    trainingFlag: false,
    welfareFlag: false,
  };
  departmentOptions = [
    { guid: '0', departmentName: '前端' },
    { guid: '1', departmentName: '后端' },
  ];
  // 工作性质
  workTypeList = [];
  entrylist = [];
  // 员工状态
  status = [];
  isLoadingOne = false;
  public enterpriseId = this.tokenService.get().loginEid;
  userID = '';
  dateFormat = 'yyyyMMdd';
  isVisible = false;
  ymguid = '';
  typeNumber = '1';
  formData = {
    name: '',
    phone: '',
    departmentId: '',
    position: '',
    guid: '',
    // isManager: '',
    jobNumber: '',
    entryTime: '',
    workType: '',
    fullmemMoney: '',
    trialMoney: '',
    probationTime: '',
    status: '',
    hrmEntryInfoVO: '',
    // hrmEntrySettingDTO: {}
  };
  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {

  }
  showModal(): void {
    this.entrylist = [];
    this.isVisible = true;
  }
  log(value): void {
    this.entrylist = value;
    this.hrmEntrySettingDTO.contactFlag = '0',
      this.hrmEntrySettingDTO.educationFlag = '0',
      this.hrmEntrySettingDTO.employmentFlag = '0',
      this.hrmEntrySettingDTO.fileFlag = '0',
      this.hrmEntrySettingDTO.salaryFlag = '0',
      this.hrmEntrySettingDTO.titleFlag = '0',
      this.hrmEntrySettingDTO.trainingFlag = '0',
      this.hrmEntrySettingDTO.welfareFlag = '0',
      this.entrylist.forEach(i => {
        if (this.hrmEntrySettingDTO !== null) {
          this.hrmEntrySettingDTO[i] = '1';
        }
      });
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

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
    obj['hrmEntrySettingDTO'] = this.hrmEntrySettingDTO;
    obj['guid'] = this.ymguid;
    if (this.typeNumber === '1') {
      this.http.post(this.url + 'service/waitingEntry/1/', obj, { headers: headers }).subscribe((res: any) => {
        if (res.code === 0) {
          this.msg.success('新增成功', { nzDuration: 1000 });
          this.loading = false;
          this.router.navigate(['/personnel-admin/entry-management/list']);
        } else {
          this.msg.error(res.message, { nzDuration: 1000 });
        }
        this.isLoadingOne = false;
      }, response => {
        this.isLoadingOne = false;
        this.msg.error('服务器错误');
        return;
      });
    } else {
      this.http.patch(this.url + 'service/waitingEntry/' + this.ymguid, obj, { headers: headers }).subscribe((res: any) => {
        if (res.code === 0) {
          this.msg.success('修改成功', { nzDuration: 1000 });
          this.loading = false;
          // 清空路由复用信息
          this.router.navigate(['/personnel-admin/entry-management/list']);

        } else {
          this.msg.error(res.message, { nzDuration: 1000 });
        }
        this.isLoadingOne = false;
      }, response => {
        this.isLoadingOne = false;
        this.msg.error('服务器错误');
        return;
      });
    }

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

  // 取消
  cancel() {
    this.router.navigate(['/personnel-admin/entry-management/list']);
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
  edidGetData(guid) {
    this.http.get(this.deptUrl + 'service/waitingEntry/' + guid).subscribe((res: any) => {
      if (res.code === 0) {
        this.formData = res.data;
        this.hrmEntrySettingDTO = res.data.hrmEntrySettingDTO;
        this.formData.guid = res.data.hrmEntrySettingDTO.guid;
        for (const key in (this.hrmEntrySettingDTO)) {
          if (this.hrmEntrySettingDTO.hasOwnProperty(key)) {
            if (this.hrmEntrySettingDTO[key] === '1') {
              this.viewModelSelect[key] = true;
            }
          }
        }
        this.form.setValue({
          name: this.formData.name,
          phone: this.formData.phone,
          departmentId: this.formData.departmentId,
          position: this.formData.position,
          // isManager: ['0'],
          jobNumber: this.formData.jobNumber,
          entryTime: this.strTransFormDate(this.formData.entryTime),
          workType: this.formData.workType,
          fullmemMoney: this.formData.fullmemMoney,
          trialMoney: this.formData.trialMoney,
          probationTime: this.formData.probationTime,
          status: this.formData.status,
          enterpriseGuid: this.tokenService.get().guid,
          operatorId: this.userID,
          guid: this.ymguid
        });
      } else {
        this.msg.error(res.message);
        this.loading = false;
      }

    });
  }

  ngOnInit(): void {
    if (this.tokenService.get().type === 1) {
      this.userID = this.tokenService.get().guid;
    } else {
      this.userID = this.tokenService.get().userId;
    }
    this.route.params
      .subscribe((params: Params) => {
        this.ymguid = params['guid'];
      });
    if (this.ymguid === undefined) {

    } else {
      this.edidGetData(this.ymguid);
      this.typeNumber = '0';
    }

    // console.log(this.formData);
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      departmentId: [null, [Validators.required]],
      position: ['', [Validators.required]],
      // isManager: ['0'],
      jobNumber: [''],
      guid: [''],
      entryTime: ['', [Validators.required]],
      workType: [''],
      fullmemMoney: [''],
      trialMoney: [''],
      probationTime: ['', [Validators.required]],
      status: ['', [Validators.required]],
      enterpriseGuid: [this.tokenService.get().guid],
      operatorId: [this.userID],
    });
    // this.getDepartment();
    this.getPaperType();
    this.getdropDownlist();
  }

}
