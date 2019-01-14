import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'person-plan',
  templateUrl: './person-plan.component.html',
  styleUrls: ['./person-plan.component.less']
})
export class PersonPlanComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }
  public userId = ''; // 用户id
  public guid = ''; // 企业id
  public loading = false;
  
  public q: any = {
    pageNum: 1,
    pageSize: 20,
    searchStr: '', // 搜索关键字
    // moduleId: '492035588166254592',
  };
  public typeCode = '1'; // 人员计划是1

  // downHref = '';

  // isVisible = false;
  // isVisibles = false;
  // reportType = '';
  // deleteguid = '';

  public url = environment.SERVER_URL + `/sys-management/`;
  selftemplateGuid = '492035588166254592';
  public dataList = [];
  public serachType = 0;

  // public key = '';
  entryguid = '';
  // 编号
  public code = 1;
  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.guid = this.tokenService.get().guid; // 企业id
    this.getData(null);
  }

  /**
   * 获取数据
   */
  public getData(callbackfun) {
    this.http.get(this.url + 'service/templateFiles/list/' + this.typeCode, {
      params: this.q
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.dataList = res.data;
        this.loading = false;
        this.q.total = res.total;
        if (callbackfun) {
          callbackfun();
        }
      } else {
        this.msg.error(res.message);
      }
    });
  }
/*
   * 文件下载
   * */
  downLoadFile(guid, fileUrl) {
    this.http.get(this.url + 'service/templateFiles/download/' + guid , {
      params: {userId: this.userId}
    }).subscribe((res: any) => {
    if (res.code === 0) {
      // location.href = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + guid;
       window.open(fileUrl);
      setTimeout(() => {
        // 数量刷新
      this.getData(null);
      }, 1000);
    } else {
      this.msg.error(res.message);
    }
   });
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
  /*
   * 搜索框
   * */
  showSerach() {
    this.serachType = 1;
  }

    /*
    * 回车搜索简历
    * */
   public enterSearch(e) {
    const keyCode = window.event ? e.keyCode : e.which;
    if (keyCode === 13) {
      this.q.pageNum = 1;
        this.getData(null);
    }
  }
  public searchAction() {
    this.q.pageNum = 1;
    this.getData(null);
  }
 
  repeatRequest(): Promise<any> {
    return new Promise((resolve) => {
        this.getData(resolve);
    }).then((res) => {
        if (this.dataList.length < 1) {
            this.q.pi =  this.q.pi - 1;
            if (this.q.pi <= 0) {
                this.q.pi = 1;
            }
            this.getData(null);
        }
    });
  }

}

