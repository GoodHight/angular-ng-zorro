import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  public url = environment.ENTERPRISE_URL;
  public dataType0 = [];
  public dataType1 = [];
  userId = '';
  constructor(private router: Router, private http: HttpClient, private msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private modalService: NzModalService) { }
  public guid = this.tokenService.get().guid;
  ngOnInit() {
    this.getData();
    if (this.tokenService.get().type === 1) {
      this.userId = this.guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
  }

  /**
   * 获取数据
   */
  public getData() {
    this.dataType0 = [];
    this.dataType1 = [];
    this.http.get(this.url + 'service/approvalSet/' + this.guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          res.data.forEach(item => {
            if (item.approvalScope === 1) {
              this.dataType1.push(item);
            } else {
              this.dataType0.push(item);
            }
          });
        }
      });
  }
  // 修改状态
  updateState(guid, state, index) {
    const _that = this;
    this.modalService.confirm({
      nzTitle: '确认要修改状态吗？',
      nzWrapClassName: 'vertical-center-modal',
      nzOnOk: () => {
        this.http.patch(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/approvalSet/' + guid, {}, {
          params: {
            userId: this.userId,
            state: state
          }
        }).subscribe((res: any) => {
          if (res.code === 0) {
            this.msg.success('修改成功', { nzDuration: 3000 });
            this.getData();
          } else {
            this.msg.error(res.message, { nzDuration: 3000 });
          }
        }, response => {

        });
      },
      nzOnCancel() {
        _that.getData();
      }
    });

  }
}
