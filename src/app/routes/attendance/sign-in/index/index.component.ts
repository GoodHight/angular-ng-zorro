import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
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
    pageNum: 1,
    pageSize: 20,
    searchName: '',
    departmentId: '',
    total: 0
  };
  downHref = '';
  signTime = '';
  isVisible = false;
  deleteguid = '';
  public dateFormat = 'yyyy/MM/dd';
  public url = environment.SERVER_URL + environment.CHECKIN_URL;
  public reportList = [];
  public employeeStateList = [];
  public serachType = 0;
  public key = '';
  // 编号
  public code = 1;
  ngOnInit() {
    this.loading = true;
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.getDataPart();
    this.getData();
  }

  onChange(result: Date): void {
    this.startTime = result[0];
    this.endTime = result[1];
    this.getData();
  } 

  /**
   * 获取数据
   */
  public getData() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.get(this.url + 'service/signIn/getPageList', {
      params: {
        enterpriseId: this.tokenService.get().guid,
        pageNum: this.q.pageNum,
        userId: this.userId,
        pageSize: this.q.pageSize,
        departmentId: this.q.departmentId,
        searchStr: this.key,
        startDate: this.dateTransformToString(this.startTime),
        endDate: this.dateTransformToString(this.endTime)
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.reportList = res.data;
        this.reportList.forEach(element => {
          this.signTime = element.signDate + element.signTime + '00';
          element.dateTime = this.signTime;
        });
        if (this.reportList.length === 0) {
          this.outdisabled = true;
        } else {
          this.outdisabled = false;
        }
        this.loading = false;
        this.q.total = res.total;
      } else {
        this.msg.error(res.message);
      }
    });
  }

  public getDataPart() {
    this.http.get(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/enterprise/dept/employeePart', {
      params: {
        enterpriseGuid : this.tokenService.get().guid,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.employeeStateList = res.data;
      } else {
        this.msg.error(res.message);
      }
    });
  }
  public exportReport() {
    window.open(environment.SERVER_URL + environment.CHECKIN_URL + 'service/signIn/exportSignInRecordReport?enterpriseId=' + this.tokenService.get().guid + '&userId =' + this.userId + '&searchStr=' + this.key + '&startDate=' + this.dateTransformToString(this.startTime) + '&endDate=' + this.dateTransformToString(this.endTime));
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
    if (e !== null) {
      this.q.departmentId = e;
    } else {
      this.q.departmentId = '';
    }
    this.getData();
  }
  details(guid: any) {
    this.router.navigate(['/attendance/signIn/detalis', guid]);
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
