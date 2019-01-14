import { Component, OnInit, Inject } from '@angular/core';
import { en_US, zh_CN, NzI18nService, NzMessageService } from 'ng-zorro-antd';
import { RecordService } from '../service/record.service';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  constructor(
    private recordService: RecordService,
    private i18n: NzI18nService, 
    public msg: NzMessageService) { }


  public dateFormat = 'yyyy-MM-dd';
  public key = '';
  public starttime = undefined; // 开始日期
  public endtime = undefined; // 结束日期
  public starttimeCorrect = undefined; // 开始日期
  public endtimeCorrect = undefined; // 结束日期
  
  public dataSet = [];

  
  public serachType = 0;
  
  loading = false;

  public queryParams: any = {
    pageIndex: 1,
    pageSize: 20,
    totals: 0,
    searchName: this.key,
    startTime: this.starttime,
    endTime: this.endtime
  };

  
 
  /*
  * 搜索框
  * */
  showSerach(): void {
    this.serachType = 1;
  }

  
  getData(): void {
    this.recordService.getData(this.queryParams)
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

  initQueryDateRange(): void {
    // 默认为今日
    const currentMonthFirst = new Date();
    this.starttime = new Date(currentMonthFirst.valueOf());
    this.starttimeCorrect = new Date(currentMonthFirst.valueOf());
    this.endtime = new Date(currentMonthFirst.valueOf());
    this.endtimeCorrect = new Date(currentMonthFirst.valueOf());
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

  /**
   * refresh table data.
   */
  refreshNzTable(): void {
    this.loading = true;
    this.queryParams.searchName = this.key;
    this.queryParams.startTime = this.starttimeCorrect;
    this.queryParams.endTime = this.endtimeCorrect;
    this.getData();
  }

  export(): void {
    this.recordService.export(this.queryParams);
  }

  enterEvent(): void {
    this.refreshNzTable();
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
