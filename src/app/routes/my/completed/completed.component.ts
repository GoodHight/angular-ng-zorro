import { Component, OnInit } from '@angular/core';
import {HttpHeaders, HttpParams, HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {environment} from '@env/environment';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
})
export class CompletedComponent implements OnInit {
    public tabSelectIndex = 1;
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
    url = environment.FRAMEWORK_URL + '/service';
    constructor(
        private http: HttpClient, private msg: NzMessageService, private router: Router
    ) { }

    getData() {
        this.pageChange(1).then(() => {
            this.loading = true;
            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
            const _params = new HttpParams()
                .set('pageNum ', this.q.pi)
                .set('pageSize  ', this.q.ps);
            this.http.get(this.url + '/sysMessage/get-page-index')
                .subscribe((res: any) => {
                        if (res.code === 1) {
                            this.dataList = res.data;
                            this.msg.success('查询成功');
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
