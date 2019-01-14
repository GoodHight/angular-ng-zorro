import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-train-list',
  templateUrl: './my-train-list.component.html',
  styleUrls: ['./my-train-list.component.less']
})
export class MyTrainListComponent implements OnInit {
  httpUrl = environment.HRM_URL + 'service';
  // 加载等待
  loading = false;
  // 显示搜索按钮
  showSearch = 0;
  // 搜索关键字
  searchKey;
  dataList;
  // 分页相关
  pageTotal = 0;
  pageIndex = 1;
  pageSize = 20;
  // 状态
  states = {
    1: '申请通过',
    0: '等待申请',
    '-1': '申请失败',
    '-2': '未申请'
  };
  constructor(
    private http: HttpClient,
    private router: Router,
    private msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private nzModal: NzModalService
  ) { 
  }
  
  ngOnInit() {
    this.pageChange(1);
  }

  pageChange(i) {
    if (i === 0) {
      return;
    } else {
      this.http.get(this.httpUrl + '/classes/user', {
        params: {
          userGuid: this.tokenService.get().userGuid,
          pageNum: this.pageIndex + '',
          pageSize: this.pageSize + ''
        }
      }).subscribe((res: any) => {
        if (res.code === 1) {
          this.dataList = res.data;
        } else {
          this.dataList = [];
        }
      });
    }
  }

  addClass() {
    this.router.navigate(['/myTrain/issue/add']);
  }

  deleteClass(item) {
    this.nzModal.confirm({
      nzTitle: '删除',
      nzContent: '是否删除该班级？',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.http.delete(this.httpUrl + '/student/' + item.studentGuid).subscribe((res: any) => {
          if (res.code === 1) {
            this.msg.success('删除成功！');
          } else {
            this.msg.error(res.message);
          }
          this.pageChange(1);
        });
      }
    });
  }
}
