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
  selector: 'esignation',
  templateUrl: './esignation.component.html',
  styleUrls: ['./esignation.component.less']
})
export class EsignationComponent implements OnInit {
  tabs = [];
  tab: any;
  public tabSelectIndex = 1;
  public serachType = 0;
  public key = '';
  dimissionType: any = '';
  reportList: any = [];
  turnoverList: any = [];
  // 编号
  public code = 1;
  public q: any = {
    pageNum: 1,
    pageSize: 20,
    total: 0
  };
  dimissionStatus: any = 0;
  pageNum: any = 1;
  pageSize: any = 100;
  private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
  status: any = 1;
  guid = '';
  public loading = false;
  isVisible = false;
  isVisibles = false;
  leaveguid = '';
  userId = '';
  type: any;
  dateFormat: 'yyyyMMdd';
  leaveNumber = 0;
  daiNumber = 0;

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
 * 获取下拉框数据
 * */
  getTypeTurnover() {
    this.turnoverList = [];
    this.http.get(this.dictionaryUrl + 'service/dictionary/type', {
      params: {
        dictType: 'DIMISSION_TYPE',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.turnoverList = res.data;
        const item = {
          guid: '',
          dictName: '全部',
        };
        this.turnoverList.push(item);
      }
    });
  }
  /*
 * 分页以及编号的问题
 * */
  pageChange(pageNum: number): void {
    if (pageNum === 0) {
      return;
    }
    this.loading = true;
    if (pageNum === 1) {
      this.code = 1;
    } else {
      this.code = ((pageNum - 1) * 20) + 1;
    }
    this.q.pageNum = pageNum;
    this.getData(null);
    this.getTypeTurnover();
  }

  employeeStateChange(e) {
    if (e === null || e === '') {
      this.dimissionType = '';
      this.getData(null);
    } else {
      this.dimissionType = e;
      this.getData(null);
    }
  }
  /*
  * */
  getData(callbackfun) {
    this.http.get(this.url + 'service/enterprise/dimission', {
      params: {
        enterpriseGuid: this.tokenService.get().guid,
        key: this.key,
        dimissionStatus: this.dimissionStatus,
        dimissionType: this.dimissionType,
        pageNum: this.q.pageNum,
        pageSize: this.q.pageSize,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.reportList = res.data;
        this.daiNumber = res.total;
        this.q.total = res.total;
        this.getDatas(this.daiNumber);
        if (callbackfun) {
          callbackfun();
        }
      } else {
        this.msg.error(res.message);
      }
      this.loading = false;
    }, response => {
      this.msg.error('系统错误');
      return;
    });
  }
  getDatas(daiNumber) {
    this.http.get(this.url + 'service/enterprise/dimission', {
      params: {
        enterpriseGuid: this.tokenService.get().guid,
        dimissionStatus: this.status,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.leaveNumber = res.total;
        this.tabs = [{
          key: '/personnel-admin/leave-management/leave-list',
          tab: '待离职' + '(' + this.leaveNumber + ')',
        }, {
          key: '/personnel-admin/leave-management/leave-list/esignation',
          tab: '已离职' + '(' + daiNumber + ')',
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

  to(item: any) {
    this.router.navigateByUrl(`${item.key}`).then();
  }

  ngOnInit(): void {
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.loading = true;
    this.getData(null);
    this.getTypeTurnover();
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
  }
  details(guid: any) {
    this.router.navigate(['/personnel-admin/leave-management/leave-list/detalis/' + guid]);
  }
  // 黑名单
  blacklist(guid) {
    this.leaveguid = guid; 
    this.isVisibles = true;
  }

  handleOk(): void {
    this.isVisibles = false;
    this.http.patch(this.url + 'service/enterprise/dimission/joinToBlackList/' + this.leaveguid, {}, {
      params: {
        userGuid: this.userId
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('加入成功', { nzDuration: 3000 });
        this.getData(null);
        this.isVisibles = false;
      } else {
        this.msg.error(res.message, { nzDuration: 3000 });
        this.isVisibles = false;
      }
    }, response => {
      this.isVisibles = false;
    });
  }
  handleCancel(): void {
    this.isVisibles = false;
  }

  //  删除
  delete(guid) {
    this.leaveguid = guid;
    this.isVisible = true;
  }

  handleOks(): void {
    this.http.delete(this.url + 'service/enterprise/dimission/' + this.leaveguid, {
      params: {
        // guid: this.tokenService.get().guid,
        userGuid: this.userId
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('删除成功');
        this.repeatRequest();
      } else {
        this.msg.error(res.message);
      }
    });
    this.isVisible = false;
  }
  handleCancels(): void {
    this.isVisible = false;
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
