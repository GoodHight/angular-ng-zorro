import { Component, EventEmitter, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private modalService: NzModalService, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }
  public userId: any;
  startTime = '';
  endTime = '';
  download = '预览';
  public guid = this.tokenService.get().guid; // 企业id
  public loading = false;
  public dataSet: any[] = [];
  public deleteGuid: any;
  public q: any = {
    pageNum: 1,
    pageSize: 20,
    searchStr: '',
    isEnterprise: 1,
    total: 0,
    status: '',
    typeId: '',
    // contractLifeEnd: '',
    // contractLifeStart: '',
  };
  signState: any;
  contractId = '';
  signStateList = [
    {
      name: '同意',
      guid: 0
    }, {
      name: '拒绝',
      guid: 1
    }
  ];
  // 签订状态（0完成，1待签，2已签，3拒签，4审核通过，5审核拒绝，6完成，7过期）
  employeeStateList = [
    {
      str: '待处理',
      status: ''
    },
    {
      str: '待签',
      status: '1'
    },
    {
      str: '已签待审',
      status: '2'
    },
    {
      str: '拒签',
      status: '3'
    },
    {
      str: '审核通过',
      status: '4'
    },
    {
      str: '审核中',
      status: '5'
    },
    {
      str: '审核不通过',
      status: '6'
    },
    {
      str: '完成',
      status: '7'
    }
  ];
  pageNum: any = 1;
  pageSize: any = 1000;
  downHref = '';
  isVisible = false;
  searchStr = '';
  str = '';
  activationTlyltle = '';
  disuseTlyltle = '';
  deleteguid = '';
  carsystemlist = [];
  public dateFormat = 'yyyy/MM/dd';
  public url = environment.SERVER_URL + environment.CONTRACT_URL;
  public reportList = [];
  public serachType = 0;
  public serachState = 0;
  public key = '';
  loginType = this.tokenService.get().type;
  // 编号
  public code = 1;
  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
      this.employeeStateList[0].str = '全部';
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.getData();
    this.getContractType();
  }

  signBtn(contractId) {
    this.isVisible = true;
    this.signState = 0;
    this.contractId = contractId;
  }

  onChange(result: Date): void {
    this.q.startDate = this.dateTransformToString(result[0]);
    this.q.endDate = this.dateTransformToString(result[1]);
    this.getData();
    // console.log(result[0]);
    // console.log(result[1]);
  }
  handleOk(): void {
    const obj = {
      contractId: this.contractId,
      state: this.signState,
      userId: this.userId
    };
    this.http.patch(this.url + 'service/contract/sign', obj).subscribe((res: any) => {
      if (res.code === 0) {
        this.getData();
        this.msg.success('操作成功', { nzDuration: 3000 });
      } else {
        this.msg.error(res.message, { nzDuration: 3000 });
      }
    }, response => {
    });
    this.isVisible = false;
  }
  getContractType() { // h获取合同类型
    this.http.get(environment.SERVER_URL + environment.COMMONS_URL + 'service/dictionary/type', {
      params: {
        dictType: 'CONTRACT_TYPE',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
    })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.carsystemlist = res.data;
        } else {
          this.msg.error(res.message);
          this.loading = false;
        }
      });
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  delet(guid) {
    this.str = '确认要删除吗？';
    this.modalService.confirm({
      nzTitle: this.str,
      nzWrapClassName: 'vertical-center-modal',
      nzOnOk: () => {
        this.http.delete(this.url + 'service/contract/sign', {
          params: {
            contractId: guid,
            userId: this.userId,
          }
        }).subscribe((res: any) => {
          if (res.code === 0) {
            this.msg.success('删除成功');
            this.getData();
            this.getContractType();
          } else {
            this.msg.error(res.message);
          }
        });
      },
      nzOnCancel() {
      }
    });

  }
  activation(guid) {
    this.activationTlyltle = '确认要重新发起该合同吗？';
    this.modalService.confirm({
      nzTitle: this.activationTlyltle,
      nzWrapClassName: 'vertical-center-modal',
      nzOnOk: () => {
        this.loading = true;
        this.http.patch(this.url + 'service/contract/sign/contractContinue', {}, {
          params: {
            contractId: guid,
            userId: this.userId,
          }
        }).subscribe((res: any) => {
          if (res.code === 0) {
            this.loading = false;
            this.getData();
            this.msg.success('操作成功', { nzDuration: 3000 });
          } else {
            this.msg.error(res.message, { nzDuration: 3000 });
            this.loading = false;
          }
        }, response => {
          this.loading = false;
        });
      },
      nzOnCancel() {
      }
    });
  }
  disuse(guid) {
    this.disuseTlyltle = '确认要弃用吗？';
    this.modalService.confirm({
      nzTitle: this.disuseTlyltle,
      nzWrapClassName: 'vertical-center-modal',
      nzOnOk: () => {
        this.loading = true;
        this.http.patch(this.url + 'service/contract/sign/contractCancel', {}, {
          params: {
            contractId: guid,
            userId: this.userId,
          }
        }).subscribe((res: any) => {
          if (res.code === 0) {
            this.loading = false;
            this.getData();
            this.msg.success('操作成功', { nzDuration: 3000 });
          } else {
            this.msg.error(res.message, { nzDuration: 3000 });
            this.loading = false;
          }
        }, response => {
          this.loading = false;
        });
      },
      nzOnCancel() {
      }
    });
  }
  /**
   * 获取数据
   */
  public getData() {
    this.loading = true;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.q['userId'] = this.userId,
      this.q['enterpriseId'] = this.tokenService.get().guid,
      // delete this.q.total;
      this.http.get(this.url + 'service/contract/sign/getEnterpriseList', { params: this.q }).subscribe((res: any) => {
        if (res.code === 0) {
          this.reportList = res.data;
          this.q.total = res.total;
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;
      });
  }
  // 点击调到下一页
  public pageChange(pi: number, state: any) {
    if (this.serachState !== 1 || pi > 1) {
      this.serachState = 0;
      this.q.pageNum = pi;
      this.getData();
    }

  }
  details(guid: any) {
    this.router.navigate(['/contract/list/detalis/', guid]);
  }
  // 下拉框改变
  employeeStateChange(e) {
    this.q.status = e;
    this.getData();
  }
  // 下拉框改变
  typeChange(e) {
    this.q.typeId = e;
    this.getData();
  }
  /*
   * 搜索框
   * */
  showSerach() {
    this.serachType = 1;
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
}
