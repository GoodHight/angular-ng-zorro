import { Component, Inject, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { _Validators } from '@delon/util';
import { locateHostElement } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnInit {

  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }

  tab: any;
  public tabSelectIndex = 1;
  tabs = [{
    key: '/hrservice/version/order',
    tab: '订单中心',
  }];
  public q: any = {
    pageNum: '1',
    pageSize: '20',
    total: '',
    searchStr: '',
    payMode: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    business: '',
  };
  orderStatus: any = [
    {
      str: '关闭',
      status: 0
    },
    {
      str: '未付款',
      status: 1
    },
    {
      str: '处理中',
      status: 2
    },
    {
      str: '已支付',
      status: 3
    },
    {
      str: '交易成功',
      status: 4
    }
  ];
  businesslist: any = [
    {
      str: '测评',
      status: 1
    },
    {
      str: '合同',
      status: 2
    },
    {
      str: '版本套餐',
      status: 3
    },
    {
      str: '账户充值',
      status: 4
    }
  ];
  orderTime: any;
  userID = '';
  public _sortField = '';
  public _sortValue = '';
  public loading = true;
  public dataSet: any[] = [];
  protected refreshData(reset: boolean = false) {
    if (reset) {
      this.q.pageNum = '1';
    }
    this.q.userId = this.userID;
    this.q.enterpriseId = this.tokenService.get().guid;
    this.loading = true;
    this.http.get(environment.ORDER_URL + 'service/order/getPageList', { params: this.q }).subscribe((res: any) => {
      if (res.code === 0) {
        this.dataSet = res.data;
        this.q.total = res.total;
        // console.log(this.dataSet);
        this.loading = false;
      } else {
        this.dataSet = [];
        this.loading = false;
        this.msg.error(res.message);
      }
    });
  }
  to(item: any) {
    this.router.navigateByUrl(`${item.key}`).then();
  }
  // 下拉框改变
  employeeStateChange(e) {
    if (e === null || e === '') {
      this.q.orderStatus = '';
      this.refreshData(true);
    } else {
      this.q.orderStatus = e;
      this.refreshData(true);
    }
  }
  businessTypeChange(e) {
    if (e === null || e === '') {
      this.q.business = '';
      this.refreshData(true);
    } else {
      this.q.business = e;
      this.refreshData(true);
    }
  }
  pageChange(pageIndex: number) {
    this.q.pageNum = pageIndex + '';
    this.refreshData(false);
  }
  onChange(result: Date): void {
    this.q.startDate = this.dateTransformToString(result[0]);
    this.q.endDate = this.dateTransformToString(result[1]);
    this.refreshData(false);
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
  sort(sort: { key: string, value: string }) {
    if (sort.value === 'descend') {
      this._sortField = sort.key;
      this._sortValue = 'desc';
    } else if (sort.value === 'ascend') {
      this._sortField = sort.key;
      this._sortValue = 'asc';
    } else {
      this._sortField = '';
      this._sortValue = '';
    }
    this.refreshData(true);
  }

  details(item) {
    // this.msg.error('还在开发中..');
    this.router.navigate(['/hrservice/version/orderdetail', item.guid]);
  }
  pay(item) {
    this.router.navigate(['/hrservice/account/orderpay/', item.orderNo]);
  }
  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userID = this.tokenService.get().guid;
    } else {
      this.userID = this.tokenService.get().userId;
    }
    this.refreshData(true);
    // 获取详情状态字段实时刷新
  }

}
