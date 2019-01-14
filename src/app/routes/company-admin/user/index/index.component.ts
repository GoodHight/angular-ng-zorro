import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '@env/environment';
import {NzMessageService} from 'ng-zorro-antd';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
    tabs: any[] = [{
        key: 'user',
        tab: '企业子账户管理',
    }
    ];
    public isVisibleMiddle = false;
    public q: any = {
        pageNum: 1,
        pageSize: 20,
        total: 20,
        queryKey: this.iTokenService.get().enterprisesInfo.enterprisesName,
        order: 'desc',
        orderBy: '',
        loginUid: this.iTokenService.get().userGuid
    };
    public serachState = 0;
    public dataList: any [];
    public loading = false;
    public count = 1;
    public url = environment.HRM_URL + 'service';
    public guid;
    public loginEid =  this.iTokenService.get().loginEid;
    constructor(private http: HttpClient, private router: Router, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private iTokenService: ITokenService) {
    }

    /*
   * 获取列表数据
   * */
    public getData() {
        this.http.get(this.url + '/hrm-virtual-user', {params: this.q})
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataList = res.data;
                    this.q.total = res.total;
                    this.loading = false;
                }
                if (res.code !== 1) {
                    this.dataList = [];
                    this.q.total = 1;
                    // this.msg.error('没有数据');
                    this.loading = false;
                }
            }, response => {
                // console.log('服务器错误');
                return;
            });
    }

    /*
    * 详情
    * */
    details(guid: any) {
        this.router.navigate(['/recruit/resume/details', guid]);
    }


    /*
    * 一系列操作
    * */
    public deleteRole(guid: any) {
        this.isVisibleMiddle = true;
        this.guid = guid;
    }
    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        this.http.delete(this.url + '/hrm-virtual-user/', {
            params: {
                guids: this.guid
            }
        })
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('删除成功');
                    this.isVisibleMiddle = false;
                    this.getData();
                } else {
                    this.msg.error(res.message);
                }
            });

    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;

    }

    public pageChange(pi: number, state: any) {
        if (this.serachState !== 1 || pi > 1) {
            this.serachState = 0;
            this.q.pageNum = pi;
            this.loading = true;
            this.getData();
        }

    }

    to(item: any) {
        this.router.navigateByUrl(`/news/${item.key}`).then();
    }

    ngOnInit() {
        this.getData();
    }


}
