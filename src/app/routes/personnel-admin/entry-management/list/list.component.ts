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
  public dataSet: any[] = [];
  public deleteGuid: any;
  public q: any = {
    pageNum: 1,
    pageSize: 20,
    total: 0
  };
  downHref = '';
  isVisible = false;
  isVisibles = false;
  reportType = '';
  deleteguid = '';
  public url = environment.SERVER_URL + environment.ENTERPRISE_URL;
  public reportList = [];
  public serachType = 0;
  public key = '';
  entryguid = '';
  // 编号
  public code = 1;
  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.getData(null);
  }

  /**
   * 获取数据
   */
  public getData(callbackfun) {
    this.http.get(this.url + 'service/waitingEntry/enterprise/key', {
      params: {
        enterpriseGuid: this.tokenService.get().guid,
        pageNum: this.q.pageNum,
        pageSize: this.q.pageSize,
        key: this.key,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.reportList = res.data;
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
  employeeStateChange(e) {
    this.q.reportType = e;
    this.getData(null);
  }
  delete(guid) {
    this.deleteguid = guid;
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
    this.http.delete(this.url + 'service/waitingEntry/' + this.deleteguid, {
      params: {
        enterpriseId: this.tokenService.get().guid,
        userId: this.userId
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('删除成功');
        this.repeatRequest();
        // this.getData();
      } else {
        this.msg.error(res.message);
      }
    });
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  // 办理入职弹出 

  entryPost(guid) {
    this.isVisibles = true;
    this.entryguid = guid;
  }

  handleOks(): void {
    this.http.patch(this.url + 'service/waitingEntry/handleEntry/' + this.entryguid, {}, {
      params: {
        enterpriseId: this.tokenService.get().guid,
        userId: this.userId
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('办理成功', { nzDuration: 3000 });
        this.getData(null);
        this.isVisibles = false;
      } else {
        this.msg.error(res.message, { nzDuration: 3000 });
        this.isVisibles = false;
      }
    }, response => {
      this.isVisibles = false;
    });
  }
  handleCancels(): void {
    this.isVisibles = false;
  }
  edit(guid): void {
    this.router.navigate(['/personnel-admin/entry-management/list/add/' + guid]);
  }
  ebtryForm(guid): void {

    this.http.get(this.url + 'service/waitingEntry/entryReadOnly/' + guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.router.navigate(['/personnel-admin/entry-management/list/entry-form/' + guid]);
        } else {
          this.msg.error(res.message);
          this.loading = false;
        }
      }, response => {
        this.msg.error('系统错误');
        return;
      });

   
  }

  repeatRequest(): Promise<any> {
    return new Promise((resolve) => {
        this.getData(resolve);
    }).then((res) => {
        if (this.reportList.length < 1) {
            this.q.pi =  this.q.pi - 1;
            if (this.q.pi <= 0) {
                this.q.pi = 1;
            }
            this.getData(null);
        }
    });
}
}
