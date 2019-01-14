import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }
  public userId = ''; // 用户id
  public guid = this.tokenService.get().guid; // 企业id
  public loading = false;
  public outdisabled = false;
  public dataSet: any[] = [];
  public deleteGuid: any;
  startTime = '';
  endTime = '';
  public q: any = {
    enterpriseId: this.guid,
    order: 'desc',
    orderBy: '',
    pageNum: 1,
    pageSize: 20,
    searchName: '',
    reportType: ' ',
    type: '',
    total: 0
  };
  downHref = '';
  isVisible = false;
  reportType = '';
  deleteguid = '';
  public dateFormat = 'yyyy/MM/dd';
  public url = environment.SERVER_URL + environment.REPORT_URL;
  public reportList = [];
  public serachType = 0;
  public key = '';
  // 编号
  public code = 1;
  employeeStateList = [{
    dictName: '全部',
    guid: '0'
  }, {
    dictName: '日报',
    guid: '1'
  }, {
    dictName: '周报',
    guid: '2'
  }, {
    dictName: '月报',
    guid: '3'
  }];
  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.getData();
  }

  onChange(result: Date): void {
    this.startTime = result[0];
    this.endTime = result[1];
    this.getData();
    // console.log(result[0]);
    // console.log(result[1]);
  }

  /**
   * 获取数据
   */
  public getData() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.get(this.url + 'service/report/findStatisticsReport', {
      params: {
        enterpriseId: this.tokenService.get().guid,
        pageNum: this.q.pageNum,
        pageSize: this.q.pageSize,
        reportType: this.q.reportType,
        searchStr: this.key,
        startTime: this.dateTransformToString(this.startTime),
        endTime: this.dateTransformToString(this.endTime)
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.reportList = res.data;
        if (this.reportList.length === 0) {
          this.outdisabled = true;
        }
        this.loading = false;
        this.q.total = res.total;
      } else {
        this.msg.error(res.message);
      }
    });
  }
  public exportReport() {
    // this.http.get(this.url + 'service/report/exportReport', {
    //   params: {
    //     enterpriseId: this.tokenService.get().guid,
    //     pageNum: this.q.pageNum,
    //     pageSize: this.q.pageSize,
    //     reportType: this.q.reportType,
    //     searchStr: this.key,
    //     startTime: this.dateTransformToString(this.startTime),
    //     endTime: this.dateTransformToString(this.endTime)
    //   }
    // }).subscribe((res: any) => {
    //   if (res.code === 0) {

    //   } else {
    //     this.msg.error(res.message);
    //   }
    // });

    location.href = environment.SERVER_URL + environment.REPORT_URL + 'service/report/exportReport?enterpriseId=' + this.tokenService.get().guid + '&reportType=' + this.q.reportType + '&searchStr=' + this.key + '&startTime=' + this.dateTransformToString(this.startTime) + '&endTime=' + this.dateTransformToString(this.endTime);
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
    this.getData();
  }
  /*
   * 搜索框
   * */
  showSerach() {
    this.serachType = 1;
  }
  employeeStateChange(e) {
    this.q.reportType = e;
    this.getData();
  }
  delete(guid, reportType) {
    this.deleteguid = guid;
    this.reportType = reportType;
    this.isVisible = true;

  }
  handleOk(): void {
    this.isVisible = false;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.delete(this.url + 'service/report/delete/' + this.deleteguid, {
      params: {
        enterpriseId: this.tokenService.get().guid,
        reportType: this.reportType
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('删除成功');
        this.getData();
      } else {
        this.msg.error(res.message);
      }
    });
  }

  handleCancel(): void {
    this.isVisible = false;
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
