import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  public loading = false;
  public outdisabled = false;
  public dataSet: any[] = [];
  approvaltype = [
    {
      dickname: '全部',
      guid: 0
    }, {
      dickname: '离职',
      guid: 7
    }, {
      dickname: '请假',
      guid: 1
    }, {
      dickname: '外出',
      guid: 2
    }, {
      dickname: '出差',
      guid: 3
    }, {
      dickname: '补打卡',
      guid: 4
    }, {
      dickname: '转正',
      guid: 5
    }, {
      dickname: '调岗',
      guid: 6
    },
  ];
  // 编号
  public code = 1;
  public _sortField = '';
  public _sortValue = '';
  public url = environment.APPROVAL_URL;
  public isVisibleMiddle: any;
  constructor(private router: Router, private http: HttpClient, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }
  public deleteGuid: any;
  public guid = this.tokenService.get().guid;
  public q: any = {
    enterpriseId: this.guid,
    order: 'desc',
    orderBy: '',
    pageNum: 1,
    pageSize: 20,
    searchName: '',
    type: 0,
    total: 0
  };

  /**
   * details
   */
  public details(guid: any) {
    this.router.navigate(['/approval/record/', guid]);
  }

  ngOnInit() {
    this.getData(null);
  }
  dew() {
    location.href = environment.SERVER_URL + environment.APPROVAL_URL + 'service/approvalRecord/export?enterpriseId=' + this.tokenService.get().guid + '&type=' + this.q.type + '&searchName=' + this.q.searchName;
  }
  ngModelChangetData(event) {
    // console.log(event);
    this.q.type = event;
    this.getData(null);
  }
  /**
   * 获取数据
   */
  public getData(callbackfun) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.get(this.url + 'service/approvalRecord/list', { params: this.q })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.dataSet = res.data;
          if (this.dataSet.length === 0) {
            this.outdisabled = true;
          }
          this.q.total = res.total;
          this.dataSet.forEach((value, key) => {

            if (value.type === 1) {
              this.dataSet[key].type = '请假';
            }
            if (value.type === 2) {
              this.dataSet[key].type = '外出';
            }
            if (value.type === 3) {
              this.dataSet[key].type = '出差';
            }
            if (value.type === 4) {
              this.dataSet[key].type = '补打卡';
            }
            if (value.type === 5) {
              this.dataSet[key].type = '转正';
            }
            if (value.type === 6) {
              this.dataSet[key].type = '调岗';
            }
            if (value.type === 7) {
              this.dataSet[key].type = '离职';
            }
          });
          if (callbackfun) {
            callbackfun();
          }
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;

      });
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
  /**
     * 将yyyyMMdd格式字符串转换为时间
     * @param str 
     */
  stringTransformDate(str: string): Date {
    str = str.replace(/[^0-9]*/g, '');
    let year = '',
      month = '',
      day = '';
    if (str.length >= 8) {
      year = str.substring(0, 4);
      month = str.substring(4, 6);
      day = str.substring(6, 8);
      return new Date(year + '-' + month + '-' + day);
    } else {
      return new Date();
    }
  }
  showModalMiddle(deleteGuid: any): void {
    this.isVisibleMiddle = true;
    this.deleteGuid = deleteGuid;
  }
  handleOkMiddle(): void {
    this.isVisibleMiddle = true;
    const body = {
      'userId': this.tokenService.get().guid
    };
    this.http.delete(this.url + 'service/approvalRecord/' + this.deleteGuid, { params: body }).subscribe((res: any) => {
      if (res.code === 0) {
        // this.getData();
        this.msg.success('删除成功');
        this.isVisibleMiddle = false;
        this.repeatRequest();
      } else {
        this.msg.error(res.message);
      }
    });
  }

  repeatRequest(): Promise<any> {
    return new Promise((resolve) => {
      this.getData(resolve);
    }).then((res) => {
      if (this.dataSet.length < 1) {
        this.q.pi = this.q.pi - 1;
        if (this.q.pi <= 0) {
          this.q.pi = 1;
        }
        this.getData(null);
      }
    });
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
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
  }
}
