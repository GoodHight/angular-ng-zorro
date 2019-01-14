import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-luyonggl',
    styleUrls: ['./luyonggl.component.less'],
    templateUrl: './luyonggl.component.html',
})
export class LuyongglComponent implements OnInit {

    public q: any = {
        pageNum: 1,
        pageSize: 20,
        resumeState: '1',
        enterpriseId: '',
        userId: '',
        searchStr: '', // 搜索条件关键字
    };
    public url = environment.SERVER_URL + '/recruit';
    public loading = false;
    public key = '';
    public dataList: any[];
    constructor(
        private http: HttpClient, public msg: NzMessageService, private router: Router, @Inject(DA_SERVICE_TOKEN) private token: ITokenService
    ) {
        // console.log('------sdsfsdaaf', this.token.get());

    }

    // 搜索框
    public serachType = 0;
    public hrefValue = 1;
    /*
    * 搜索框
    * */
    showSerach(): void {
        this.serachType = 1;
    }
    /*
        * 回车搜索简历
        * */
    public enterSearch(e) {
        const keyCode = window.event ? e.keyCode : e.which;
        if (keyCode === 13) {
            this.q.pageNum = 1;
            this.getData();
        }
    }
    serachAction() {
        this.q.pageNum = 1;
        this.getData();
    }
    /*
    * 条件搜索简历
    * */
    public serachResume(state: any) {
        this.hrefValue = state;
        this.q.resumeState = state;
        this.getData();
    }
    /*
    * 获取列表数据
    * */
    public getData() {

        this.loading = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        // console.log('url-------------', this.url);

        this.http.get(this.url + '/service/employApproval/getPageList', { params: this.q })
            .subscribe((res: any) => {
                // console.log(res);
                if (res.code === 0) {
                    this.dataList = res.data;
                    this.loading = false;
                } else {
                    this.msg.error(res.message);
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
        // this.router.navigate(['/personnel-admin/employee-info/update', guid]);
    }
    delet($event) {
        $event.stopPropagation();
    }
    /*
    * 弹框
    * */
    public isVisibleMiddle = false;
    public resumeId;
    public radioValue: any;
    showModalMiddle(resumeId: any): void {
        this.isVisibleMiddle = true;
        this.resumeId = resumeId;
    }
    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;
    }
    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        if (!this.radioValue) {
            this.msg.error('您未选择任何选项，请先选择！');
            return ;
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const body = new HttpParams()
            .set('userId', this.q.userId)
            .set('resumeId', this.resumeId)
            .set('enterpriseId', this.q.enterpriseId)
            .set('state', this.radioValue);
        this.http.post(this.url + '/service/talentPool/3', null, {
            params: body
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.getData();
                this.msg.success('加入人才库成功');
                this.isVisibleMiddle = false;
            } else {
                this.msg.error(res.message);
            }
        });
    }
    public pageChange(pi: number): Promise<any> {
        this.q.pageNum = pi;
        this.loading = true;
        return new Promise((resolve) => {
            setTimeout(() => {
                this.loading = false;
                resolve();
            }, 500);
        });
    }
    ngOnInit() {
        if (this.token.get().type === 1) {
            this.q.userId = this.token.get().guid;
        } else {
            this.q.userId = this.token.get().userId;
        }
        this.q.enterpriseId = this.token.get().guid;
        this.getData();
    }

}
