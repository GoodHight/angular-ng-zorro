import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  // 接口字符串
  typeUrl = environment.SERVER_URL + environment.MESSAGE_URL;
  // 定义的数组
  dataList: any;
  public serachState = 0;
  // 未读人数
  notReadcCount: any;
  // 用户登录id
  userGuid: any;
  guid: any;
  // 按钮禁用
  disableBtn = false;
  // 总的页数
  total: any;
  public paramsData: any = {
    pageNum: 1,
    pageSize: 20
  };
  // 删除判断
  public Visible = false;
  constructor(private router: Router, private http: HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public msg: NzMessageService) { }

  ngOnInit() {
    // 获取用户登录id
    this.userGuid = this.tokenService.get().guid;
    this.getMessageData(null);
  }
  // 获取数据
  getMessageData(callbackfun) {
    this.http.get(this.typeUrl + 'service/message/getListByUser?userId=' + this.userGuid, { params: this.paramsData })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.dataList = res.data.list;
          this.notReadcCount = res.data.notReadcCount;
          this.total = res.total;
          const allr = this.dataList.some(ele => {
            return  ele.isRead === 0;
          });
          if (allr) {
            this.disableBtn = false;
          } else {
            this.disableBtn = true;
          }
          if (callbackfun) {
            callbackfun();
          }
        }
      });
  }
  _submitForm() {

  }
  // 分页
  public pageChange(pi: number, state: any) {
    if (this.serachState !== 1 || pi > 1) {
      this.serachState = 0;
      this.paramsData.pageNum = pi;
      this.getMessageData(null);
    }
  }
  // 删除提示框
  handleCancelMiddle(guid) {
    this.Visible = true;
    this.guid = guid;
  }

  // 删除
  del() {
    this.http.delete(this.typeUrl + 'service/message/delByUser/' + this.guid, { params: { userId: this.userGuid } }).subscribe((res: any) => {
      if (res.code === 0) {
        this.repeatRequest();
        this.msg.success('删除成功');
        this.Visible = false;
      }
    });
  }
  // 取消删除
  canle() {
    this.Visible = false;
  }
  // 详情
  detail(detailGuid) {
    this.router.navigate(['/message/detail', detailGuid]);

  }
  // 全部标记为已读
  allread() {
      this.http.patch(this.typeUrl + 'service/message/setAllRead/' + this.userGuid, {}).subscribe((res: any) => {
        if (res.code === 0) {
          this.msg.success('全部已读');
          this.getMessageData(null);
        } else {
          this.msg.error(res.message);
        }
      });

  }
  repeatRequest(): Promise<any> {
    return new Promise((resolve) => {
        this.getMessageData(resolve);
    }).then((res) => {
        if (this.dataList.length < 1) {
            this.paramsData.pageNum = this.paramsData.pageNum - 1;
            if (this.paramsData.pageNum <= 0) {
                this.paramsData.pageNum = 1;
            }
            this.getMessageData(null);
        }
    });
}

}
