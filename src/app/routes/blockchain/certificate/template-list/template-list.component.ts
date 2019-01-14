import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.less']
})

export class TemplateListComponent implements OnInit {
  public userId = ''; // 用户id
  public guid = this.tokenService.get().guid; // 企业id
  // 编号
  public code = 1;
  public loading = false;
  startTime = '';
  endTime = '';
  userID = '';
  wjguid = '';
  templateimgUrl = '';
  public q: any = {
    pageNum: 1,
    pageSize: 20,
    total: 0
  };
  isVisible = false;
  isVisibless = false;
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
    this.http.get(this.templateUrl + 'service/training/hrm', {
      params: {
        enterpriseGuid: this.tokenService.get().guid,
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

  showModal(wjguid): void {
    this.isVisible = true;
    this.wjguid = wjguid;
  }

  handleOk(): void {
    this.http.delete(this.templateUrl + 'service/training/hrm/' + this.wjguid, {
      params: {
        enterpriseId: this.tokenService.get().guid,
        userId: this.userID,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('删除成功');
        this.getData();
      } else {
        this.msg.error(res.message);
      }
    });
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  // 查看

  showModalss(templateFileId): void {
    // console.log(templateFileId);
    this.isVisibless = true;
    this.templateimgUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + templateFileId;
  }

  Cancel(): void {
    this.isVisibless = false;
  }
  Ok(): void {
    this.isVisibless = false;
  }

  handleOkss(): void {
    this.isVisibless = false;
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
}
