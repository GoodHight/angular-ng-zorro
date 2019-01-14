import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-luyong',
  templateUrl: './luyong.component.html',
})
export class LuyongComponent implements OnInit {
    public q: any = {
        pageNum : 1,
        pageSize : 20,
        order: 'desc',
        orderBy: '',
        description: '',
        resumeState: '1',
    };
    public url = environment.HRM_URL +　'service';
    public  loading = false;
    public key = '';
    public dataList: any [];
    constructor(
        private http: HttpClient, public msg: NzMessageService, private router: Router, @Inject(DA_SERVICE_TOKEN) private token: ITokenService
    ) { }
    /*
    * 获取列表数据
    * */
    public getData() {
        this.pageChange(1).then(() => {
            this.loading = true;
            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
            // const _params = new HttpParams()
            //     .set('pageNum ', this.q.pageSize)
            //     .set('key', this.key)
            //     .set('pageSize  ', this.q.ps)
            this.http.get(this.url + '/resume/', {params: this.q})
                .subscribe((res: any) => {
                    if (res.code === 1) {
                        this.dataList = res.data;
                        this.loading = false;
                    }
                    if (res.code === 0) {
                        this.msg.error('没有数据');
                        this.loading = false;
                    }
                }, response => {
                    // console.log('服务器错误');
                    return;
                });
        });
    }
    /*
    * 详情
    * */
    details(guid: any) {
        // this.router.navigate(['/personnel-admin/employee-info/update', guid]);
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
        this.getData();
    }

}
