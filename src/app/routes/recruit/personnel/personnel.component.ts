import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-personnel',
    styleUrls: ['./personnel.component.less'],
    templateUrl: './personnel.component.html',
})
export class PersonnelComponent implements OnInit {

    public isVisibleMiddle = false;
    public q: any = {
        pageNum: 1,
        pageSize: 20,
        order: 'desc',
        orderBy: '',
        userId: this.tokenService.get().guid,
        enterpriseId: this.tokenService.get().guid,
        searchStr: '', // 搜索条件关键字
    };
    constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        public msg: NzMessageService) { }
    // 人才库类型默认人才储备
    personState = 2;
    optionList = [
       /*  {
            dicName: '全部',
            guid: 0
        }, */
        {
            dicName: '人才储备',
            guid: 2
        },
        {
            dicName: '已淘汰',
            guid: 1
        },
        {
            dicName: '黑名单',
            guid: 3
        }
    ];
    selectedValu = '人才储备';

    // 搜索框
    public serachType = 0;
    // 简历ID
    public resumeId;
    public count = {
        blackListCount: '',
        dieOutCount: '',
        reserveCount: ''
    };
    public hrefValue = 1;
    public url = environment.SERVER_URL + '/recruit';
    public loading = false;
    public key = '';
    public dataList: any[];

    // 路径地址s
    personPath: any;
    /*
    * 条件搜索简历
    * */
    public serachResume(state: any) {
        this.hrefValue = state;
        this.q.resumeState = state;
        this.getData();
    }
    // 下拉框发生改变的时候
    employeeStateChange(e) {
        this.personState = e;
        this.getData();
    }
    /*
    * 获取列表数据
    * */
    public getData() {
        // console.log(this.personState);
       /*  this.optionList.forEach(data => {
        }); */
        this.loading = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        this.http.get(this.url + '/service/talentPool/getPageList/' + this.personState, { params: this.q })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.dataList = res.data;
                    // console.log(this.dataList);

                    this.count = res.data.count;
                    // this.msg.success('查询成功');
                    this.loading = false;
                }
                if (res.code === 1) {
                    this.msg.error('没有数据');
                    this.loading = false;
                }
            }, response => {
                // console.log('服务器错误');
                return;
            });
    }

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
 /*
        * 条件搜索
        * */
       public serachAction() {
        this.q.pageNum = 1;
        this.getData();
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
    public patchResume(type: any) {

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

    /*
    * 弹框
    * */
    showModalMiddle(resumeId: any): void {
        this.isVisibleMiddle = true;
        this.resumeId = resumeId;
    }

    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const body = new HttpParams()
            .set('userId', this.tokenService.get().guid)
            .set('enterpriseId', this.tokenService.get().guid);
        // this.http.delete(this.url + '/service/talentPool/delByResumeId/' + this.resumeId, null, {
        //     params: body
        // }
        this.http.delete(this.url + '/service/talentPool/delByResumeId/' + this.resumeId, {
            params: body
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.getData();
                this.msg.success('删除成功');
                this.isVisibleMiddle = false;
            } else {
                this.msg.error(res.message);
            }
        });
    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;
    }

    ngOnInit() {
        // console.log(this.personState);
        this.getData();
    }
    //  上传简历按钮
    _submitForm() {

    }


}
