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
  selector: 'entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.less']
})
export class EntryFormComponent implements OnInit {
  tabs = [];

  tab: any;
  public tabSelectIndex = 8;
  uuid = this.tokenService.get().guid;
  type: any;
  public form: FormGroup;
  dateFormat: 'yyyyMMdd';
  loading: false;
  guid;
  dataList = [];
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
  hrmEntryDTO: any = {}; // 基本信息
  hrmEntryWelfareDTO: any = {}; // 工资卡
  hrmEntryContactDTO: any = {}; // 通讯信息
  hrmEntryEducationDTOs: any = []; // 教育信息
  hrmEntryEmploymentDTOs: any = []; // 从业信息
  hrmEntryEmergencyDTO: any = {}; // j紧急联系人信息
  hrmEntryTrainingDTOs: any = []; // 培训信息
  hrmEntryTitleDTOs: any = []; // 培训信息
  isVisibles = false;
  reason = false;
  isVisibless = false;
  isVisible = false;
  templateimgUrl = '';
  userId = '';
  returnReason = ''; // 退回原因
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

  /*
  * 取消todo
  * */
  cancel() {
    this.router.navigate(['/personnel-admin/entry-management/list']);
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
  * 获取员工信息
  * */
  getEmployeeInfo() {
    this.http.get(this.url + 'service/waitingEntry/entryReadOnly/' + this.guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.hrmEntryDTO = res.data.hrmEntry;
          this.hrmEntrySettingDTO = res.data.hrmEntrySetting;
          this.hrmEntryWelfareDTO = res.data.hrmEntryWelfare;
          this.hrmEntryContactDTO = res.data.hrmEntryContact;
          this.hrmEntryEducationDTOs = res.data.hrmEntryEducations;
          this.hrmEntryEmploymentDTOs = res.data.hrmEntryEmployments;
          this.hrmEntryEmergencyDTO = res.data.hrmEntryEmergency;
          this.hrmEntryTrainingDTOs = res.data.hrmEntryTrainings;
          this.hrmEntryTitleDTOs = res.data.hrmEntryTitles;
          this.loading = false;
        } else {
          this.msg.error('没有数据');
          this.loading = false;
        }
      }, response => {
        this.msg.error('系统错误');
        return;
      });
  }

  entryPost() {
    this.isVisibles = true;
  }
  handleCancels(): void {
    this.isVisibles = false;
  }
  handleOks(): void {
    this.http.patch(this.url + 'service/waitingEntry/handleEntry/' + this.guid, {}, {
      params: {
        enterpriseId: this.tokenService.get().guid,
        userId: this.userId
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('办理成功', { nzDuration: 3000 });
        this.isVisibles = false;
        this.router.navigate(['/personnel-admin/entry-management/list']);
      } else {
        this.msg.error(res.message, { nzDuration: 3000 });
        this.isVisibles = false;
      }
    }, response => {
      this.isVisibles = false;
    });
  }

  return() {
    this.reason = true;
  }
  handreason() {
    this.reason = false;
  }

  reasonOk() {
    this.http.patch(this.url + 'service/waitingEntry/entryAgain/' + this.guid, {}, {
      params: {
        reason: this.returnReason,
        userGuid: this.userId
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('操作成功', { nzDuration: 3000 });
        this.reason = false;
        this.router.navigate(['/personnel-admin/entry-management/list']);
      } else {
        this.msg.error(res.message, { nzDuration: 3000 });
        this.reason = false;
      }
    }, response => {
      this.reason = false;
    });
  }


  to(item: any) {
    this.router.navigateByUrl(`${item.key}`).then();
  }
  ngOnInit(): void {

    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.route.params
      .subscribe((params: Params) => {
        this.guid = params['guid'];
        this.tabs = [{
          key: '/personnel-admin/entry-management/list/entry-form/' + this.guid,
          tab: '入职登记表',
        }];
      });
    this.getEmployeeInfo();
  }

}
