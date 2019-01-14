import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';

@Component({
    selector: 'app-jianli',
    styleUrls: ['./jianli.component.less'],
    templateUrl: './jianli.component.html',

})
export class JianliComponent implements OnInit {
    constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        public msg: NzMessageService) { }

    pathGuid = '';
    public isVisibleMiddle = false;
    public q: any = {
        userId: this.tokenService.get().guid,
        enterpriseId: this.tokenService.get().guid,
        order: 'desc',
        pageNum: 1,
        pageSize: 20,
        orderBy: '',
        searchStr: ''
    };
    public toolbar = true;
    public tabSelectIndex = 0;
    // 判断显示隐藏
    public serachType = 0;
    tabs = [{
        key: '/recruit/resume',
        tab: '新简历',
        dataNum: ''
    }, {
        key: '/recruit/resume/alreadyresume',
        tab: '已推荐',
        dataNum: ''
    }];
    // 上传附件的初始化数据
    loading = false;
    avatarUrl: string;
    // 简历ID
    public resumeId;
    public count = {
        alterCount: '',
        isRecCount: '',
        newCount: '',
        notPassRecCount: '',
        passRecCount: ''
    };
    public serachState = 0;
    public radioValue: any;
    public hrefValue = 1;
    public url = environment.SERVER_URL + '/recruit';
    // public loading = false;
    public key = '';
    public dataList: any[];
    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.pathGuid = params['guid'];
        });

        if (this.tokenService.get().type === 1) {
            this.q.userID = this.tokenService.get().guid;
        } else {
            this.q.userID = this.tokenService.get().userId;
        }
        this.getData();
        
    }
    /*
* 搜索框
* */
    showSerach() {
        this.serachType = 1;
    }
    // tab表单
    to(item: any) {
        this.router.navigateByUrl(`${item.key}`).then();
    }
    refreshData() {
        this.q.pageNum = 1;
        this.getData();
    }

    /*
    * 获取列表数据
    * */
    public getData() {

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        this.http.get(this.url + '/service/resume/getPageList', { params: this.q })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.dataList = res.data;
                    // console.log(this.dataList);
                    this.q.total = res.total;
                    this.count = res.data.count;
                    this.loading = false;
                    this.tabs[0].dataNum = res.total ;
                    this.tabs[1].dataNum = res.extraData ;
                } else {
                    this.dataList = [];
                    this.q.total = 1;
                    this.msg.error('没有数据');
                    this.loading = false;
                }
            }, response => {
                return;
            });
            // console.log(this.dataList);
    }

    /*
    * 详情
    * */
    details(guid: any) {
        this.router.navigate(['/recruit/resume/details', guid]);
    }

    /*
    * 条件搜索简历
    * */
    public serachResume(state: any) {
        this.hrefValue = state;
        this.q.resumeState = state;
        this.dataList = [];
        // this.q.total = 0;
        this.q.pageNum = 0;
        this.serachState = 1;
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

    public pageChange(pi: number, state: any) {
        if (this.serachState !== 1 || pi > 1) {
            this.serachState = 0;
            this.q.pageNum = pi;
            this.loading = true;
            this.getData();
        }

    }

    /*
    * 弹框
    * */
    showModalMiddle(resumeId: any): void {
        this.isVisibleMiddle = true;
        this.resumeId = resumeId;
    }
    /*
    * 删除简历
    * */

    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        if (!this.radioValue) {
            this.msg.error('您未选择任何选项，请先选择！');
            return ;
        }
        const body = new HttpParams()
            .set('userId', this.q.userId)
            .set('resumeId', this.resumeId)
            .set('enterpriseId', this.q.enterpriseId)
            .set('state', this.radioValue);
        this.http.post(this.url + '/service/talentPool/1', null, {
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

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;
    }

}
