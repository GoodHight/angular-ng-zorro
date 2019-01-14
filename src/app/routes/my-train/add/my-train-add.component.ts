import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-train-add',
  templateUrl: './my-train-add.component.html',
})
export class MyTrainAddComponent implements OnInit {

  httpUrl = environment.HRM_URL + 'service';

  // 加载等待 
  loading = false;
  // 企业数据
  dataList;
  // 班级数据
  classList;
  // 分页相关
  pageIndex = 1;
  pageSize = 20;
  // 当前步骤
  nowStep = 1;
  // 当前选择tab
  tabSelectedIndex = 0;
  // 学生列表分页
  studentPageIndex = 1;
  studentPageSize = 20;
  constructor(
    private http: HttpClient,
    private msg: NzMessageService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private nzModal: NzModalService
  ) { }

  ngOnInit() {
    this.getCompanyList();
  }
  /**
   * 培训公司列表
   */
  getCompanyList() {
    this.http.get(this.httpUrl + '/classes/enterprise').subscribe((res: any) => {
      if (res.code === 1) {
        this.dataList = res.data;
      } else {
        this.dataList = [];
      }
    });
  }
  /**
   * 进入班级
   * @param item 
   */
  gotoClass(item) {
    this.nowStep++;
    this.classList = item.classes;
    this.tabSelectedIndex = 2;
  }
  /**
   * 
   * @param item 申请加入班级
   */
  applyJoin(item) {
    this.nzModal.confirm({
      nzTitle: '申请加入班级',
      nzContent: `是否申请加入<b>${item.name}</b><br><h3>并将个人身份信息同步到该班级所属的企业账号？</h3>`,
      nzOkText: '申请加入',
      nzCancelText: '取消加入',
      nzOnOk: () => {
        this.http.post(this.httpUrl + '/student', {
          classGuid: item.guid,
          className: item.name,
          userGuid: this.tokenService.get().userGuid
        }).subscribe((res: any) => {
          if (res.code === 1) {
            this.msg.success('申请成功！');
            this.router.navigate(['/myTrain/issue']);
          } else {
            this.msg.error(res.message);
          }
        });
      }
    });
  }
  /**
   * 返回
   */
  back() {
    if (this.nowStep === 1) {
      this.router.navigate(['/myTrain/issue', {}]);
    } else {
      this.nowStep = 1;
      this.tabSelectedIndex = 0;
      this.getCompanyList();
    }
  }
}
