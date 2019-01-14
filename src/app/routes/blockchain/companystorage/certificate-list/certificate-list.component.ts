import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.less']
})
export class CertificateListComponent implements OnInit {
  public guid = this.tokenService.get().guid; // 企业id
  // 编号
  public code = 1;
  showSearch = 0;
  public loading = false;
  // 展示搜索框，默认为0不展示
  searchKey = '';
  userID = ''; // 用户id
  isVisible = false;
  templateimgUrl = '';
  dataHash = '';
  public q: any = {
    pageNum: 1,
    pageSize: 20,
    total: 0
  };
  dataList = [];
  templateUrl = environment.SERVER_URL + environment.TRAINING_URL;
  constructor(private router: Router, private http: HttpClient, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {

  }

  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userID = this.tokenService.get().guid;
    } else {
      this.userID = this.tokenService.get().userId;
    }
    this.getData();
  }


  getData() {
    this.loading = true;
    this.http.get(this.templateUrl + 'service/training/tempRecord/getPageList', {
      params: {
        key: this.searchKey,
        enterpriseGuid: this.tokenService.get().guid,
        userGuid: this.userID,
        pageNum: this.q.pageNum,
        pageSize: this.q.pageSize,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.dataList = res.data;
        this.q.total = res.total;
        this.loading = false;
      } else {
        this.msg.error(res.message);
        this.loading = false;
      }
    });
  }
  detalis(dataHash) {
    this.isVisible = true;
    this.dataHash = dataHash;
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
  handleOk(): void {
    window.setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
