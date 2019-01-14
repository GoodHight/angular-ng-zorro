import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }
  public userId = ''; // 用户id
  public guid = this.tokenService.get().guid; // 企业id
  public loading = false;
  public dataSet: any[] = [];
  public deleteGuid: any;
  startTime = '';
  endTime = '';
  public q: any = {
    pageNum: 1,
    pageSize: 20,
    searchStr: '',
    total: 0,
    status: ''
  };
  // 失效合同类型
  typeList = [{
    dictName: '全部',
    guid: '',
  }, {
    dictName: '合同终止',
    guid: '-2',
  }, {
    dictName: '合同到期',
    guid: '-1',
  }, {
    dictName: '合同废弃',
    guid: '-3',
  }];
  downHref = '';
  isVisible = false;
  searchStr = '';
  deleteguid = '';
  public dateFormat = 'yyyy/MM/dd';
  public url = environment.SERVER_URL + environment.CONTRACT_URL;
  public reportList = [];
  public serachType = 0;
  public serachState = 0;
  // public key = '';
  // 编号
  public code = 1;
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
  }
  // 下拉框改变
  typeChange(e) {
    this.q.status = e;
    this.getData();
  }

  /**
   * 获取数据
   */
  public getData() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.q['userId'] = this.userId,
      this.q['enterpriseId'] = this.tokenService.get().guid,
      // delete this.q.total;
      this.http.get(this.url + 'service/contract/sign/getEnterpriseInvalidList', { params: this.q }).subscribe((res: any) => {
        if (res.code === 0) {
          this.reportList = res.data;
          this.loading = false;
          this.q.total = res.total;
        } else {
          this.msg.error(res.message);
        }
      });
  }
  /*
    * 回车搜索简历
    * */
  public enterSearch(e) {
    const keyCode = window.event ? e.keyCode : e.which;
    if (keyCode === 13) {
      this.searchAction();
    }
  }
  public searchAction() {
    this.q.pageNum = 1;
    this.getData();
  }
  // 点击调到下一页
  public pageChange(pi: number, state: any) {
    if (this.serachState !== 1 || pi > 1) {
      this.serachState = 0;
      this.q.pageNum = pi;
      this.getData();
    }

  }
  /*
   * 搜索框
   * */
  showSerach() {
    this.serachType = 1;
  }
}

