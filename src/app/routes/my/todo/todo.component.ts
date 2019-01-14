import {Component, Inject, OnInit} from '@angular/core';
// import {  } from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {environment} from '@env/environment';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
    public tabSelectIndex = 0;
    tabs = [{
        key: '/my/todo',
        tab: '待办事项',
    }, {
        key: '/my/completed',
        tab: '已办事项',
    }];
    dataList: any[] = [];
    q: any = {
        pi: 1,
        ps: 20,
        description: '',
        sorter: '',
        status: null,
        statusList: []
    };
    data: any[] = [];
    loading = false;
    selectedRows: any[] = [];
    curRows: any[] = [];
    totalCallNo = 0;
    allChecked = false;
    indeterminate = false;
    sortMap: any = {};
    expandForm = false;
    modalVisible = false;
    description = '';
    url = environment.FRAMEWORK_URL + 'service';

    constructor(private http: HttpClient, private msg: NzMessageService, private router: Router, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    }

    getData() {
        this.pageChange(1).then(() => {
            this.loading = true;
            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
            const _params = new HttpParams()
                .set('pageNum ', this.q.pi)
                .set('pageSize  ', this.q.ps);
            this.http.get(this.url + '/sysMessage/get-page-index', {params: _params})
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
                        // console.log('POST call in error', response);
                        return;
                    },
                    () => {
                        // console.log('The POST observable is now completed.');
                    });
        });
    }

    // details(guid: any) {
    //     this.router.navigate(['/personnel-admin/employee-info/employee-update', guid]);
    // }
    pageChange(pi: number): Promise<any> {
        this.q.pi = pi;
        this.loading = true;
        return new Promise((resolve) => {
            setTimeout(() => {
                this.loading = false;
                resolve();
            }, 500);
        });
    }
    to(item: any) {
        this.router.navigateByUrl(`${item.key}`).then();
    }
    details(guid: any) {
        this.router.navigate(['/personnel-admin/employee-info/employee-birthday']);
    }

    ngOnInit() {
        this.getData();
    }

}
