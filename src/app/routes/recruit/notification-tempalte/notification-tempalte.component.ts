import { Component, OnInit, EventEmitter, Inject,  Output  } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'notification-tempalte',
  templateUrl: './notification-tempalte.component.html',
  styleUrls: ['./notification-tempalte.component.less']
})
export class NotificationTempalteComponent implements OnInit {

  public dataList: any[] = [];
  public q: any = {
      pi: 1,
      ps: 20,
      total: 0,
      description: '',
      templateType: {
        category: '',
        type: ''
      },
      selecttemplateType: '',
  };
    templateList = [{
/* category 模板类别（1=Offer，2=面试） type 模板业务类型（1=短信，2=邮件）*/
    templatetName: '全部',
    category: '',
    type: '',
    ct: '',
  }, {
      templatetName: '面试邮件',
      category: '2',
      type: '2',
      ct: '2-2',
  }, {
    templatetName: '面试短信',
      category: '2',
      type: '1',
      ct: '2-1',
  }, {
    templatetName: 'offer短信',
    category: '1',
    type: '1',
    ct: '1-1',
  }, {
    templatetName: 'offer邮件',
      category: '1',
      type: '2',
      ct: '1-2',
  }];
  public serachType = 0;
  public data: any[] = [];

  // 编号
//   public code = 1;
  public newests: any = [];
  loading = false;
  private enterpriseGuid = this.token.get().guid;
  url = environment.SERVER_URL + '/recruit';
  userId = '';

  constructor(private http: HttpClient, public msg: NzMessageService, private router: Router, @Inject(DA_SERVICE_TOKEN) private token: ITokenService) {
  }

  @Output() click = new EventEmitter();

  ngOnInit() {
    if (this.token.get().type === 1) {
        this.userId = this.token.get().guid;
    } else {
        this.userId = this.token.get().userId;
    }
      this.getData(null);
     
  }


  // 默认列表
  getData(callbackfun) {
      this.loading = true;
      const loginEid = this.token.get().guid;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      /* const arr = this.q.selecttemplateType.split('-');
        const c = arr[0] || ''; */
      const _params = new HttpParams()
          .set('pageNum ', this.q.pi)
          .set('enterpriseGuid', this.enterpriseGuid)
          .set('category', this.q.templateType.category)
          .set('type',  this.q.templateType.type)
          .set('pageSize  ', this.q.ps);
      this.http.get(this.url + '/service/recruitSettingTemplate/getPageList', {
          params: {
              pageNum: this.q.pi,
              enterpriseId: loginEid,
              pageSize: this.q.ps,
              userId: this.userId,
              category: this.q.templateType.category,
              type: this.q.templateType.type,
          }
      })
          .subscribe((res: any) => {
              if (res.code === 0) {
                  this.dataList = res.data;
                  this.loading = false;
                  this.serachType = 0;
                  this.q.total = res.total;
                  if (callbackfun) {
                    callbackfun();
                  }
              } else {
                  this.msg.error('没有数据');
                  this.loading = false;
              }
          }, response => {
              // console.log('服务器错误');
              return;
          });
  }
  templateTypeChange(e) {
      // console.log(e);
      if (e.length > 1) {
        const arr = e.split('-');
        this.q.templateType.category = arr[0];
        this.q.templateType.type = arr[1];
      } else {
        this.q.templateType.category = '';
        this.q.templateType.type = '';
      }
      this.q.pi = 1;
    //   this.q.templateType = e;
      this.getData(null);
  }
  details(guid: any, category: any, type: any, act: any) {
      if (type === 1) {
        this.router.navigate(['/recruit/notification/messageDetail/', guid, category, type, act]);
      } else {
        this.router.navigate(['/recruit/notification/emailDetail/', guid, category, type, act]);
      }
      
  }
  newTemplate(type: any, act: any) {
    if (type === 1) {
      this.router.navigate(['/recruit/notification/messageDetail/', '', '2', type, act]); // 默认面试短信
    } else {
      this.router.navigate(['/recruit/notification/emailDetail/', '', '2', type, act]); // 默认面试邮件
    }
    
}
  pageChange(pi: number): void {
      if (pi === 0) {
          return;
      }
      this.loading = true;
      this.q.pi = pi;
      this.getData(null);
  }

//   reset(ls: any[]) {
//       for (const item of ls) item.value = false;
//   }
// 删除
    del(guid: any) {
        this.http.delete(this.url + '/service/recruitSettingTemplate/del/' + guid, {
            params: {
                enterpriseId: this.token.get().guid,
                userId: this.userId,
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.msg.success('删除成功');
                // this.getData();
                this.repeatRequest();
                this.loading = false;
            } else {
                this.msg.error(res.message);
                this.loading = false;
            }
        });
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
