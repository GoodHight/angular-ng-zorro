import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '@env/environment';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
    selector: 'app-index',
    styleUrls: ['./index.component.less'],
    templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
    tabs: any[] = [{
        key: 'role',
        tab: '权限管理',
    }
    ];
    public isVisibleMiddle = false;
    public q: any = {
        pageNum: 1,
        pageSize: 20,
        total: 20,
        order: 'desc',
        orderBy: '',
    };
    public serachState = 0;
    public dataList: any [];
    public loading = false;
    public count = 1;
    public url = environment.HRM_URL + 'service';
    public guid;

    constructor(private http: HttpClient, private router: Router, private msg: NzMessageService,
        private modal: NzModalService ) {
    }

    /*
   * 获取列表数据
   * */
    public getData() {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        this.http.get(this.url + '/hrm-role/page-list', {params: this.q})
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
    public deleteRole(item) {
        if (item.isTemplate === 1) {
            this.msg.info('该权限不能删除！');
            return;
        } else {
            this.isVisibleMiddle = true;
            this.guid = item.guid;
        }
    }
    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        this.http.delete(this.url + '/hrm-role/' + this.guid)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('删除成功');
                } else {
                    this.msg.error(res.message);
                }
                this.getData();
                this.isVisibleMiddle = false;
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
        this.router.navigateByUrl(`/admin/${item.key}`).then();
    }

    ngOnInit() {
        this.getData();
    }

    /**
     * 编辑
     * @param item
     */
    edit(item) {
        if (item.isTemplate === 1) {
            this.msg.info('该权限不能编辑！');
            return;
        } else {
            this.router.navigate(['/companyadmin/role/add/', item.guid]);
        }
    }
    /**
     * 维护功能
     * @param item 
     */
    maintainFun(item) {
        this.router.navigate(['/admin/menu/setting/' + item.guid + '/0']);
    }
    /**
     * 开启/关闭
     * @param item 
     */
    changeRoleState(item) {
        this.modal.confirm({
            nzTitle: '变更状态',
            nzContent: `是否${ item.roleState === 1 ? '停用' : '开启'}该权限`,
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.patch(this.url + '/hrm-role/state/' + item.guid, {}).subscribe((res: any) => {
                    if (res.code === 1) {
                        this.msg.success('变更成功！');
                        this.getData();
                    } else {
                        this.msg.error(res.message);
                    }
                });
            }
        });
    }
}
