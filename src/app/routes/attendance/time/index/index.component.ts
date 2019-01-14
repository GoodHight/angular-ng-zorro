import { Component, OnInit } from '@angular/core';
import { en_US, zh_CN, NzI18nService, NzMessageService } from 'ng-zorro-antd';
import { TimeService } from '../service/time.service';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private timeService: TimeService,
    private i18n: NzI18nService, 
    public msg: NzMessageService) { }


  public dateFormat = 'yyyy-MM-dd';
  public key = '';
  public starttime = undefined; // 开始日期
  public endtime = undefined; // 结束日期
  public starttimeCorrect = undefined; // 开始日期
  public endtimeCorrect = undefined; // 结束日期
  
  public dataSet = [];
  public dateRangeSource = [];
  
  public serachType = 0;
  
  loading = false;

  public queryParams: any = {
    pageIndex: 1,
    pageSize: 20,
    totals: 0,
    searchName: this.key,
    startTime: this.starttimeCorrect,
    endTime: this.endtimeCorrect
  };

  
 
  /*
  * 搜索框
  * */
  showSerach(): void {
    this.serachType = 1;
  }


  getData(): void {
    this.timeService.getData2(this.queryParams)
    .subscribe((response: any) => {
      // record
      if (response.code === 0) {
        this.queryParams.totals = response.total;
        this.dataSet = response.data;
        this.loading = false;
        if (!this.key) {
          this.serachType = 0;
        }
      }
      
    });
  }

  export(): void {
    this.timeService.export(this.queryParams);
  }

  // initQueryDateRange(): void {
  //   // 默认为本月
  //   let switcher = true;
  //   const currentMonthFirst = new Date();
  //   currentMonthFirst.setDate(1);
  //   this.starttime = new Date(currentMonthFirst.valueOf());
  //   this.starttimeCorrect = new Date(currentMonthFirst.valueOf());
  //   while (switcher) {
  //     this.dateRangeSource.push(this.formatDate(currentMonthFirst));
  //     currentMonthFirst.setDate(currentMonthFirst.getDate() + 1);
  //     if (new Date().getMonth() < currentMonthFirst.getMonth()) {
  //       currentMonthFirst.setDate(currentMonthFirst.getDate() - 1);
  //       this.endtime = new Date(currentMonthFirst.valueOf());
  //       this.endtimeCorrect = new Date(currentMonthFirst.valueOf());
  //       switcher = false;
  //     }
  //   }
  // }
  initQueryDateRange(): void {
    // 默认为本月
    let switcher = true;
    const currentMonthFirst = new Date();
    currentMonthFirst.setDate(1);
    this.starttime = new Date(currentMonthFirst.valueOf());
    const starttimess = new Date(currentMonthFirst.valueOf());
    this.starttimeCorrect = new Date(currentMonthFirst.valueOf());
    this.endtime = new Date(currentMonthFirst.setDate(new Date().getDate()));
    this.endtimeCorrect = new Date(currentMonthFirst.setDate(new Date().getDate()));
    this.dateRangeSource = [];
    while (switcher) {
      this.dateRangeSource.push(this.formatDate(starttimess));
      starttimess.setDate(starttimess.getDate() + 1);
      if (starttimess > this.endtime) {
        switcher = false;
      }
    }
  }
  getDateRange(start: Date, end: Date): void {
    const s = new Date(start.valueOf());
    const e = new Date(end.valueOf());
    this.dateRangeSource = [];
    // 默认为本月
    let switcher = true;
    while (switcher) {
      this.dateRangeSource.push(this.formatDate(s));
      s.setDate(s.getDate() + 1);
      if (s > e) {
        switcher = false;
      }
    }
  }

  /**
   * format date
   * @param date
   */
  formatDate(date: Date): string {
    const m = (date.getMonth() + 1).toString().length > 1 ?
      (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString();
    const d = date.getDate().toString().length > 1 ? 
      date.getDate().toString() : '0' + date.getDate().toString();
    return date.getFullYear() + '-' + m + '-' + d;
  }


  /**
   * Judge whether the time period is longer than 31 days.
   * @returns true or false
   */
  check31Days(): boolean {
    // reset date
    this.starttime.setHours(0);
    this.starttime.setMinutes(0);
    this.starttime.setSeconds(0);
    this.starttime.setMilliseconds(0);
    this.endtime.setHours(0);
    this.endtime.setMinutes(0);
    this.endtime.setSeconds(0);
    this.endtime.setMilliseconds(0);
    if (this.endtime.valueOf() - this.starttime.valueOf() < 3600 * 24 * 31 * 1000) {
      return false;
    }
    return true;
  }

  /**
   * checkNormalDateRange
   * @param type 1.start 2.end
   * @returns true or false
   */
  checkNormalDateRange(type: number): boolean {
    if (this.starttime.valueOf() > this.endtime.valueOf()) {
      if (type === 1) {
        this.msg.error('开始时间不能大于结束时间.');
        this.starttime = this.starttimeCorrect;
        
      } else {
        this.msg.error('结束时间不能小于开始时间.');
        this.endtime = this.endtimeCorrect;
      }
      return false;
    }
    return true;
  }

  /**
   * page index change event.
   * @param pageIndex page index
   */
  pageChange(pageIndex: number): void {
    if (pageIndex === 0) {
      return;
    }
    this.queryParams.pageIndex = pageIndex;
    this.refreshNzTable();
  }

  enterEvent(): void {
    this.refreshNzTable();
  }

  /**
   * refresh table data.
   */
  refreshNzTable(): void {
    this.queryParams.searchName = this.key;
    this.queryParams.startTime = this.starttimeCorrect;
    this.queryParams.endTime = this.endtimeCorrect;
    this.loading = true;
    this.getData();
  }

  /**
   * date-picker change events
   * @param result select date
   * @param type 'start' or 'end'
   */
  onChange(result: Date, type: string) {
    // start date
    if (type === 'start') {
      if (!this.checkNormalDateRange(1)) {
        return false;
      }
    }
    // end date
    if (type === 'end') {
      if (!this.checkNormalDateRange(2)) {
        return false;
      }
    }
    if (!this.check31Days()) {
      // this.msg.success('ok');
      if (type === 'start') {
        this.starttimeCorrect = new Date(this.starttime.valueOf());
      } else {
        this.endtimeCorrect = new Date(this.endtime.valueOf());
      }
      this.getDateRange(this.starttimeCorrect, this.endtimeCorrect);
      this.refreshNzTable();
    } else {
      this.msg.error('开始时间与结束时间间隔不能超过31天.');
      if (type === 'start') {
        this.starttime = this.starttimeCorrect;
      } else {
        this.endtime = this.endtimeCorrect;
      }
    }
    

  }


  ngOnInit() {
    this.initQueryDateRange();
    this.refreshNzTable();
  }

}
