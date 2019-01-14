import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.less']
})
export class AccountListComponent implements OnInit {
  tabs: any[] = [{
    key: '',
    tab: '账号列表',
  }
  ];
  // (0：未分配 1=已分配 )
  distribute: any[] = [{
    text: '未分配',
    value: 0
  }, {
    text: '已分配',
    value: 1
  }, {
    text: '未分配过期',
    value: -1
  }, {
    text: '已分配过期',
    value: -2
  }];
  // (0=未使用 1=已使用 2=已完成)
  state: any[] = [{
    text: '未使用',
    value: 0
  }, {
    text: '已使用',
    value: 1
  }, {
    text: '已完成',
    value: 2
  }];
  public q: any = {
    pageNum: 1,
    pageSize: 20,
  };
  public total = 0;
  public totalPage = 0;
  dataList = [];
  public serachState = 0;
  loading = true;
  public userId = ''; // 用户id
  public enterpriseId = ''; // 企业ID
  isVisible = false;
  isOkLoading = false;
  assementTypeList = []; // 量表类型列表
  listGuid: ''; // 当前列表的id
  currentPageStarNo: any;
  assementTypeSearch = '';
  selectSatusSearch = '';
  selectDistributeSearch = '';
  searchPhone = '';
  form: FormGroup;
  public url = environment.SERVER_URL + environment.ASSESSMENT;
  constructor(private http: HttpClient,
    private router: Router,
    private msg: NzMessageService,
    private modalService: NzModalService, private fb: FormBuilder,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) { }

  ngOnInit() {
    this.form = this.fb.group({
      assementDay: [null, [Validators.required]],
      selectedAssementId: [null, [Validators.required]],
      assementerName: [null, [Validators.required]],
      assementerPhone: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]]
    });
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.enterpriseId = this.tokenService.get().guid;
    this.getData();
    this.getAssementType();
  }
  public pageChange(pi: number, state: any) {
    this.q.pageNum = pi;
    this.getData();
    // if (this.serachState !== 1 || pi > 1) {
    //   this.serachState = 0;
    //   this.q.pageNum = pi;
    //   this.getData();
    // }
  }
  /*
    * 获取列表数据
    * */
  public getData() {
    const obj = {
      userId: this.userId,
      enterpriseId: this.enterpriseId,
      pageNum: this.q.pageNum,
      pageSize: this.q.pageSize,
      order: '',
      orderBy: '',
      searchStr: '',
      phone: this.searchPhone,
      gaugeId: this.assementTypeSearch,
      state: this.selectSatusSearch, // (0：未分配 1=未使用 2=已使用 3=已完成)
      isActivated: this.selectDistributeSearch, // 激活状态(0：未激活 1=已激活)
      minDateTime: '',
      maxDateTime: ''
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    this.http.get(this.url + 'service/assessmentAccount/getPageList', { params: obj })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.dataList = res.data;
          this.total = res.total;
          this.totalPage = Math.ceil(res.total / this.q.pageSize);
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;
        this.currentPageStarNo = (this.q.pageNum - 1) * this.q.pageSize;
      }, response => {
        this.msg.error('服务器错误');
        return;
      });
  }
  public issueCdk() {
    const formValue = this.form.value;
    const obj = {
      accountId: this.listGuid,
      delay: formValue.assementDay, // 延时时间
      enterpriseId: this.enterpriseId,
      gaugeId: formValue.selectedAssementId,
      user: formValue.assementerPhone,
      userId: this.userId,
      userName: formValue.assementerName
    };
    this.http.patch(this.url + 'service/assessmentAccount/issue', obj)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.isVisible = false;
          this.isOkLoading = false;
          this.clearContent();
          this.msg.success('分配成功');
          this.getData();
        } else {
          this.isVisible = false;
          this.isOkLoading = false;
          this.msg.error(res.message);
        }
        this.loading = false;
      }, response => {
        this.msg.error('服务器错误');
        return;
      });
  }
  public getAssementType() {
    this.http.get(this.url + 'service/assessmentGauge/typeForSelect')
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.assementTypeList = res.data;
          console.log(this.assementTypeList, '----this.assementTypeList');
        } else {
          this.msg.error(res.message);
        }
      }, response => {
        this.msg.error('服务器错误');
        return;
      });
  }
  /*
    * 回车搜索简历
    * */
  public enterSearch(e) {
    const keyCode = window.event ? e.keyCode : e.which;
    if (keyCode === 13) {
      this.q.pageNum = 1;
      this.getData();
    }
  }
  // 下拉框改变
  typeChange(e, type) {
    this.q.pageNum = 1;
    if (type === 1) {
      this.assementTypeSearch = e;
    }
    if (type === 2) {
      this.selectSatusSearch = e;
    }
    if (type === 3) {
      this.selectDistributeSearch = e;
    }
    this.getData();
  }
  resetSearch() {
    this.searchPhone = '';
    this.assementTypeSearch = '';
    this.selectSatusSearch = '';
    this.selectDistributeSearch = '';
    this.getData();
  }
  clickBtn() {
    this.q.pageNum = 1;
    this.getData();
  }
  downLoad(guid) {
    window.open(this.url + 'service/assessmentResultAccount/downloadResults?accountId=' + guid);
  }
  showModal(id): void {
    this.isVisible = true;
    this.listGuid = id;
  }

  handleOk(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.status !== 'VALID' || !this.form.valid) {
      // this.msg.error('验证不通过,请仔细检查.');
      return;
    }
    console.log(this.form.value, '----this.form.value');
    this.isOkLoading = true;
    this.issueCdk();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.clearContent();
  }
  // 清空分配内容
  clearContent() {
    this.form.reset();
  }
}
