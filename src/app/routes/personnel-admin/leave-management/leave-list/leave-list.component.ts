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
  selector: 'leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.less']
})
export class LeaveListComponent implements OnInit {
  tabs = [];
  tab: any;
  public tabSelectIndex = 0;
  public serachType = 0;
  public key = '';
  reportList: any = [];
  // 编号
  public code = 1;
  public q: any = {
    pageNum: 1,
    pageSize: 20,
    total: 0
  };
  isVisible = false;
  isVisibles = false;
  editLeave = false;
  dimissionStatus: any = 1;
  status: any = 0;
  guid = '';
  public form: FormGroup;
  turnoverList: any = [];
  categoryList = [{
    dictName: '已开具',
    guid: '1'
  }, {
    dictName: '未开具',
    guid: '0'
  }, {
    dictName: '不需要',
    guid: '-1'
  }];
  leaveData = {
    handoverName: '',
    dimissionaTime: '',
    reason: '',
    needDimission: '',
    dimissionType: ''
  };
  pageNum: any = 1;
  pageSize: any = 100;
  private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
  public loading = false;
  isLoadingOne = false;
  type: any;
  dateFormat: 'yyyyMMdd';
  leaveNumber = 0;
  daiNumber = 0;
  userId = '';
  leaveguid = '';
  dimissionaTime: any = '';
  reason = '';

  url = environment.SERVER_URL + environment.ENTERPRISE_URL;
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
    this.router.navigate(['/personnel-admin/employee-info/index']);
  }
  /*
    * 搜索框
    * */
  showSerach() {
    this.serachType = 1;
  }

  /*
      * 回车搜索
      * */
  public enterSearch(e) {
    const keyCode = window.event ? e.keyCode : e.which;
    if (keyCode === 13) {
      this.q.pageNum = 1;
      this.getData(null);
    }
  }
  /*
      * 条件搜索
      * */
  public serachAction() {
    this.q.pageNum = 1;
    this.getData(null);
  }

  /*
 * 分页以及编号的问题
 * */
  pageChange(pageNum: number): void {
    if (pageNum === 0) {
      return;
    }
    if (pageNum === 1) {
      this.code = 1;
    } else {
      this.code = ((pageNum - 1) * 20) + 1;
    }
    this.q.pageNum = pageNum;
    this.getData(null);
  }

  /*
  * */
  getData(callbackfun) {
    this.http.get(this.url + 'service/enterprise/dimission/', {
      params: {
        enterpriseGuid: this.tokenService.get().guid,
        key: this.key,
        dimissionStatus: this.dimissionStatus,
        pageNum: this.q.pageNum,
        pageSize: this.q.pageSize,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.reportList = res.data;
        this.leaveNumber = res.total;
        this.q.total = res.total;
        this.getDatas(this.leaveNumber);
        if (callbackfun) {
          callbackfun();
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
  getDatas(leaveNumber) {
    this.http.get(this.url + 'service/enterprise/dimission', {
      params: {
        enterpriseGuid: this.tokenService.get().guid,
        dimissionStatus: this.status,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.daiNumber = res.total;
        this.tabs = [{
          key: '/personnel-admin/leave-management/leave-list',
          tab: '待离职' + '(' + leaveNumber + ')',
        }, {
          key: '/personnel-admin/leave-management/leave-list/esignation',
          tab: '已离职' + '(' + this.daiNumber + ')',
        }];
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


  delete(guid) {
    this.leaveguid = guid;
    this.isVisible = true;
  }
  handleOk(): void {
    this.loading = true;
    this.isVisible = false;
    this.http.delete(this.url + 'service/enterprise/dimission/' + this.leaveguid, {
      params: {
        // guid: this.tokenService.get().guid,
        userGuid: this.userId
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('删除成功');
        this.repeatRequest();
        // this.getData();
      } else {
        this.msg.error(res.message);
      }
      this.loading = false;
    });
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  // 办理离职弹出 

  // entryPost(guid) {
  //   this.isVisibles = true;
  //   this.leaveguid = guid;
  // }

  // handleOks(): void {
  //   this.loading = true;
  //   this.http.patch(this.url + 'service/enterprise/dimission/handle/' + this.leaveguid, {}, {
  //     params: {
  //       // guid: this.tokenService.get().guid,
  //       userGuid: this.userId
  //     }
  //   }).subscribe((res: any) => {
  //     if (res.code === 0) {
  //       this.msg.success('办理成功', { nzDuration: 3000 });
  //       this.getData(null);
  //       this.isVisibles = false;
  //     } else {
  //       this.msg.error(res.message, { nzDuration: 3000 });
  //       this.isVisibles = false;
  //     }
  //     this.loading = false;
  //   }, response => {
  //     this.isVisibles = false;
  //   });
  // }
  // handleCancels(): void {
  //   this.isVisibles = false;
  // }

  /*
* 获取下拉框数据
* */
  getTypeTurnover() {
    this.http.get(this.dictionaryUrl + 'service/dictionary/type', {
      params: {
        dictType: 'DIMISSION_TYPE',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.turnoverList = res.data;
      }
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
    this.getTypeTurnover();
    this.form = this.fb.group({
      handoverName: ['', [Validators.required]], //
      dimissionaTime: ['', [Validators.required]], //
      reason: ['', [Validators.required]], //
      needDimission: [''], //
      dimissionType: ['', [Validators.required]], //
    });
    this.route.params
      .subscribe((params: Params) => {
        this.guid = params['guid'];
        this.tabs = [{
          key: '/personnel-admin/leave-management/leave-list',
          tab: '待离职' + '(' + this.leaveNumber + ')',
        }, {
          key: '/personnel-admin/leave-management/leave-list/esignation',
          tab: '已离职' + '(' + this.daiNumber + ')',
        }];
      });
    this.getData(null);
  }

  editLeaveqx(): void {
    this.editLeave = false;
    this.loading = false;
    this.form.reset();
  }

  editLeaveOk(): void {
    this.loading = true;
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    const obj = JSON.parse(JSON.stringify(this.form.value));
    obj['dimissionaTime'] = this.dateTransformToString(obj['dimissionaTime']);
    obj['userGuid'] = this.userId;
    if (obj.dimissionaTime === null || obj.dimissionaTime === '') {
      return;
    }
    if (obj.reason === null || obj.reason === '') {
      return;
    }
    if (obj.dimissionType === null || obj.dimissionType === '') {
      return;
    }
    if (obj.handoverName === null || obj.handoverName === '') {
      return;
    }
    this.http.patch(this.url + 'service/enterprise/dimission/handle/' + this.leaveguid, obj).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('办理成功');
        this.getData(null);
        this.editLeave = false;
      } else {
        this.msg.error(res.message, { nzDuration: 3000 });
        this.editLeave = false;
      }
      this.loading = false;
    }, response => {
      this.editLeave = false;
      this.loading = false;
    });
    this.editLeave = false;
  }
  edit(guid, dimissionaTime, reason): void {
    this.leaveguid = guid;
    this.reason = reason;
    this.editLeave = true;
    this.dimissionaTime = this.strTransFormDate(dimissionaTime);
    this.loading = true;
    this.getLeaveData(guid);
  }

  //  查询离职数据
  public getLeaveData(guid) {
    this.http.get(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/enterprise/dimission/' + guid).subscribe((res: any) => {
      if (res.code === 0) {
        this.form.setValue({
          handoverName: res.data.handoverName,
          dimissionaTime: this.strTransFormDate(res.data.dimissionaTime),
          reason: res.data.reason,
          needDimission: null,
          dimissionType: null
        });
      } else {
        this.msg.error(res.message);
      }
      this.loading = false;
    }, response => {
      this.loading = false;
    });
  }

  repeatRequest(): Promise<any> {
    return new Promise((resolve) => {
      this.getData(resolve);
    }).then((res) => {
      if (this.reportList.length < 1) {
        this.q.pi = this.q.pi - 1;
        if (this.q.pi <= 0) {
          this.q.pi = 1;
        }
        this.getData(null);
      }
    });
  }

}
