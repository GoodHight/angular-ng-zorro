import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'alreadyinterview',
    templateUrl: './alreadyinterview.component.html',
    styleUrls: ['./alreadyinterview.component.css']
})
export class AlreadyinterviewComponent implements OnInit {

    public tabs = [{
        key: '/recruit/interview',
        tab: '面试前',
        dataNum: ''
    }, {
        key: '/recruit/interview/alreadyinterview',
        tab: '面试后',
        dataNum: ''
    }];
  
    public tabSelectIndex = 1; // 当前选中的tab
    // 判断显示隐藏
    public serachType = 0;

    public serachState = 0;
    // 放弃简历 属性
    public isVisibleMiddle = false;
     // 面试状态（1=已面试，0=未面试）
     public state = 1;
    // 参数传参
    public q: any = {
        pageNum: 1,
        pageSize: 20,
        total: 100,
        order: 'desc',
        orderBy: '',
        description: '',
        searchStr: '', // 搜索条件关键字
        enterpriseId: '',
        userId : '',
    };
    // 简历ID
    public resumeId;
    public radioValue: string;
    public url = environment.SERVER_URL + '/recruit';

    public loading = false;

    public key = '';
    public dataList: any [];
    constructor(private http: HttpClient, public msg: NzMessageService, private router: Router, @Inject(DA_SERVICE_TOKEN) private token: ITokenService) {
    }
    /*
    * tab表单获取
    * */
    to(item: any) {
        this.router.navigateByUrl(`${item.key}`).then();
    }
    /*
    * 获取列表数据
    * */
    public getData() {
        // this.pageChange(1).then(() => {
            this.loading = true;
            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
            this.http.get(this.url + '/service/interview/getPageList/' + this.state, { params: this.q })
                .subscribe((res: any) => {
                    if (res.code === 0) {
                        this.dataList = res.data;
                        // console.log(this.dataList);
                        this.q.total = res.total;
                        this.loading = false;
                        this.tabs[1].dataNum = res.total;
                        this.tabs[0].dataNum = res.extraData;
                    } else {
                        this.dataList = [];
                        this.msg.error('没有数据');
                        this.loading = false;
                    }
                }, response => {
                    // console.log('服务器错误');
                    return;
                });
        // });
    }


    /*
   * 搜索框
   * */
    showSerach() {
        this.serachType = 1;
    }

    /*
    * 条件搜索
    * */
    public serachInterview() {
        this.q.pageNum = 1;
        this.getData();
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
    public pageChange(pi: number) {
        if (this.serachState !== 1 || pi > 1) {
            this.serachState = 0;
            this.q.pageNum = pi;
            this.loading = true;
            this.getData();
        }
    }
   /*  public pageChange(pi: number): Promise<any> {
        this.q.pageNum = pi;
        this.loading = true;
        return new Promise((resolve) => {
            setTimeout(() => {
                this.loading = false;
                resolve();
            }, 500);
        });
    } */

    /*
    * 弹框
    * */
    showModalMiddle(resumeId: any): void {
        this.isVisibleMiddle = true;
        this.resumeId = resumeId;
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
        this.http.post(this.url + '/service/talentPool/2', null, {
            params: body
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.getData();
                this.msg.success('加入人才库成功');
                this.isVisibleMiddle = false;
                this.isVisibleMiddle = false;
            } else {
                this.msg.error(res.message);
            }
        });
    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;
        this.radioValue = '';
    }

    ngOnInit() {
        if (this.token.get().type === 1) {
            this.q.userId = this.token.get().guid;
        } else {
            this.q.userId = this.token.get().userId;
        }
        this.q.enterpriseId = this.token.get().guid,
        this.getData();
    }

}

