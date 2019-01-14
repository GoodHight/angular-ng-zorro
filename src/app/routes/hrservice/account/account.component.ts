import { Component, EventEmitter, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {
  public userId: any;
  public loading = false;
  public q: any = {
    pageNum: 1,
    pageSize: 2,
    searchStr: '',
    isEnterprise: 1,
    total: 0,
    status: '',
    typeId: '',
  };
  public p: any = {
    pageNum: 1,
    pageSize: 1,
  };
  pageSizeOrder: any = 5;
  pageNumOrder: any = 1;
  form: FormGroup;
  contractList = [];
  accountList = [];
  orderList = [];
  enterpriseData = {
    balance: '',
    balanceVisible: '',
    enterpriseName: '',
    versionName: '',
    contract: '',
    cdKey: '',
    integral: '',
  };
  titleTC = '';
  tipsText = '';
  enterpriseLogo: any = '';
  currentPageStarNo: any;
  assementTypeSearch = '';
  selectSatusSearch = '';
  selectDistributeSearch = '';
  searchPhone = '';
  orderItemId = ''; // 充值商品id
  orderNo = ''; // 订单号
  isVisible = false;

  public url = environment.SERVER_URL + environment.CONTRACT_URL;
  public urls = environment.SERVER_URL + environment.ASSESSMENT;
  public urle = environment.SERVER_URL + environment.ENTERPRISE_URL;
  public urlo = environment.SERVER_URL + environment.ORDER_URL;
  public urli = environment.SERVER_URL + environment.ITEM_URL;
  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder, private modalService: NzModalService, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }

  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.form = this.fb.group({
      // assementDay: ['', [Validators.required]],
      assementDay: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    });
    this.loading = true;
    this.getContractData();
    this.getAccountData();
    this.getAccount();
    this.getOrder();
  }
  /**
 * 获取合同数据
 */
  public getContractData() {
    this.loading = true;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.q['userId'] = this.userId,
      this.q['enterpriseId'] = this.tokenService.get().guid,
      // delete this.q.total;
      this.http.get(this.url + 'service/contract/sign/getEnterpriseList', { params: this.q }).subscribe((res: any) => {
        if (res.code === 0) {
          this.contractList = res.data;
          this.q.total = res.total;
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;
      });
  }
  /*
   * 获取测评数据
   * */
  public getAccountData() {
    const obj = {
      userId: this.userId,
      enterpriseId: this.tokenService.get().guid,
      pageNum: this.p.pageNum,
      pageSize: this.p.pageSize,
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
    this.http.get(this.urls + 'service/assessmentAccount/getPageList', { params: obj })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.accountList = res.data;
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
  getAccount() {
    this.loading = true;
    const obj = {
      enterpriseId: this.tokenService.get().guid,
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    this.http.get(this.urle + 'service/enterprise/account/info', { params: obj })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.enterpriseData = res.data;
          if (res.data.enterpriseLogo !== '') {
            this.enterpriseLogo = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + res.data.enterpriseLogo;
          }
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
  getOrder() {
    this.loading = true;
    const obj = {
      pageNum: this.pageNumOrder,
      pageSize: this.pageSizeOrder,
      userId: this.userId,
      enterpriseId: this.tokenService.get().guid
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    this.http.get(this.urlo + 'service/order/getPageList', { params: obj })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.orderList = res.data;
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;
      }, response => {
        this.msg.error('服务器错误');
        return;
      });
  }
  getItem(businessType) {
    const obj = {
      businessType: businessType,
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    this.http.get(this.urli + 'service/item/getByBusinessIdAndType', { params: obj })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.orderItemId = res.data.guid;
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;
      }, response => {
        this.msg.error('服务器错误');
        return;
      });
  }
  showModal(type): void {
    if (type === 'balance_recharge') {
      const businessType = 'balance_recharge';
      this.getItem(businessType);
      this.titleTC = '充值余额';
      this.tipsText = '充值金额（元）';
    } else if (type === 'assessment_cdkey_recharge') {
      const businessType = 'assessment_cdkey_recharge';
      this.getItem(businessType);
      this.titleTC = '购买测评';
      this.tipsText = '购买数量（个）';
    } else if (type === 'contract_sign_buy') {
      const businessType = 'contract_sign_buy';
      this.getItem(businessType);
      this.titleTC = '购买合同';
      this.tipsText = '购买数量（份）';
    }
    this.orderNo = '';
    this.isVisible = true;
  }

  handleOk(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    const formValue = this.form.value;
    if (formValue.assementDay === '' || formValue.assementDay === null) {
      return;
    }
    const re = /^(0|\+?[1-9][0-9]*)$/;
    if (!re.test(formValue.assementDay)) {
      return;
    }
    this.loading = true;
    this.http.post(this.urlo + 'service/order/create', {
      buyNum: formValue.assementDay,
      itemId: this.orderItemId,
      userId: this.tokenService.get().guid,
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.orderNo = res.data.orderNo;
        this.form.reset();
        this.msg.success('操作成功');
        this.router.navigate(['/hrservice/account/orderpay', res.data.orderNo]);
      } else {
        this.msg.error(res.message);
        this.loading = false;
        this.isVisible = false;
      }
    });
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.form.reset();
  }
}
