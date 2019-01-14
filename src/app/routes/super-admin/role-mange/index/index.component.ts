import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
@Component({
    selector: 'index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

    tabs: any[] = [{
        key: '/admin/authority',
        tab: '权限管理',
    }, {
        key: '/admin/authority/role',
        tab: '角色管理',
    }
    ];
    public isVisibleMiddle = false;
    public isVisible = false;
    public q: any = {
        pageNum: 1,
        pageSize: 20,
        total: 20,
        order: 'desc',
        orderBy: '',
        enterpriseId: this.tokenService.get().guid
    };
    public serachState = 0;
    public dataList = [];
    public roleList = [];
    public loading = false;
    public count = 1;
    public url = environment.ENTERPRISE_URL;
    public guid;
    allChecked = false;
    indeterminate = false;
    roleId = ''; // 角色ID
    checkOptionsOne = [
        { label: 'Apple', value: 'Apple', checked: false },
        { label: 'Pear', value: 'Pear', checked: false },
        { label: 'Orange', value: 'Orange', checked: false }
    ];
    // 存放選中的數據
    selectData = [];
    // 當前角色所有的權限
    roleDataList = [];
    constructor(private http: HttpClient,
        private router: Router,
        private msg: NzMessageService,
        private modal: NzModalService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    }

    /*
    * 获取列表数据
    * */
    public getData(callbackfun) {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        this.http.get(this.url + 'service/role/getSysRole', { params: { enterpriseId: this.tokenService.get().guid } })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    res.data.forEach((value, key) => {
                        if (value.menus.length > 0) {
                            let str = '';
                            value.menus.forEach((element, key1) => {
                                str = str + element.name + ',';

                            });
                            str = str.substring(0, str.lastIndexOf(','));
                            res.data[key].menusList = str;
                        }
                    });
                    this.roleList = res.data;
                    this.q.total = res.total;
                    this.loading = false;
                    if (callbackfun) {
                        callbackfun();
                    }
                } else {
                    this.roleList = [];
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
        if (item.isTemplate === 0) {
            this.msg.info('该角色不能删除！');
            return;
        } else {
            this.isVisibleMiddle = true;
            this.roleId = item.guid;
        }
    }
    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        this.http.delete(this.url + 'service/role/delSysRole?enterpriseId=' + this.tokenService.get().guid + '&roleId=' + this.roleId)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('删除成功');
                } else {
                    this.msg.error(res.message);
                }
                this.repeatRequest();
                this.isVisibleMiddle = false;
            });

    }
// 请求数据
    repeatRequest(): Promise<any> {
        return new Promise((resolve) => {
            this.getData(resolve);
        }).then((res) => {
            if (this.roleList.length < 1) {
                this.q.pageNum =  this.q.pageNum - 1;
                if (this.q.pageNum <= 0) {
                    this.q.pageNum = 1;
                }
                this.getData(null);
            }
        });
    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;

    }
    // 角色权限的弹出框控制
    handleOk(): void {
        this.isVisible = true;
        this.http.post(this.url + 'service/menu/bindRoleMenu', {}, {
            params: {
                menuIds: this.selectData,
                enterpriseId: this.tokenService.get().guid,
                roleId: this.roleId
            }
        })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('配置成功');
                    this.selectData = [];
                } else {
                    this.msg.error(res.message);
                    this.selectData = [];
                }
                this.getData(null);
                this.isVisible = false;
            });

    }

    handleCancel(): void { 
        this.isVisible = false;
        this.selectData = [];
    }
    updateAllChecked(subtype, index): void {
        
        const getGuid = this.dataList[subtype].subMenus[index].guid;
        console.log(getGuid);
        
        const getPGuid = this.dataList[subtype].guid;
        if (this.selectData.length > 0) {
            if (this.isInArray3(this.selectData, getGuid)) {
                this.selectData.splice(this.selectData.indexOf(getGuid), 1);
            } else {
                this.selectData.push(getGuid);
            }
            // if (this.isInArray3(this.selectData, getPGuid)) {
            //     // this.selectData.splice(this.selectData.indexOf(getPGuid), 1); 
            //     // 原本注释
            // } else {
            //     this.selectData.push(getPGuid);
            // }
        } else {
            this.selectData.push(getGuid);
            // this.selectData.push(getPGuid);
        }

    }

    updateSingleChecked(): void {
        if (this.checkOptionsOne.every(item => item.checked === false)) {
            this.allChecked = false;
            this.indeterminate = false;
        } else if (this.checkOptionsOne.every(item => item.checked === true)) {
            this.allChecked = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = true;
        }
    }
    pageChange(pi: number, state: any) {
        this.serachState = state;
        if (this.serachState !== 1 || pi > 1) {
            this.serachState = 0;
            this.q.pageNum = pi;
            this.loading = true;
            this.getData(null);
        }

    }

    to(item: any) {
        this.router.navigateByUrl(`${item.key}`).then();
    }

    ngOnInit() {
        this.getData(null);
    }

    /**
     * 编辑
     * @param item
     */
    edit(item) {
        if (item.isTemplate === 0) {
            this.msg.info('该角色不能编辑！');
            return;
        } else {
            this.router.navigate(['/admin/authority/role/add/', item.guid]);
        }
    }
    /**
     * 维护功能
     * @param item 
     */
    maintainFun(item, no) {
        this.isVisible = true;
        this.roleId = item;
        const arr = this.roleList[no].menus;
        // console.log(arr);
        if (arr !== '') {
            arr.forEach(element => {
                this.roleDataList.push(element.guid);
            });
        }
        this.http.get(environment.ENTERPRISE_URL + 'service/menu/getMenus', { params: { name: this.tokenService.get().email, status: '0' } })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    if (arr !== '') {
                        arr.forEach(element => {
                            res.data.forEach(value => {
                                // if (element.guid === value.guid) {
                                //     console.log(value.guid);
                                    
                                //     value.checked = true;
                                //     if (this.isInArray3(this.selectData, value.guid)) {

                                //     } else {
                                //         this.selectData.push(value.guid);
                                //     }
                                // }
                                if (value.subMenus.length > 0) {
                                    value.subMenus.forEach(sub => {
                                        if (element.guid === sub.guid) {
                                            sub.checked = true;
                                            if (this.isInArray3(this.selectData, sub.guid)) {
                                                console.log(sub.guid);
                                            } else {
                                                this.selectData.push(sub.guid);
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    }
                    this.dataList = res.data;
                }
            });
        // this.router.navigate(['/admin/menu/setting/' + item.guid + '/0']);
    }
    /**
     * 开启/关闭
     * @param item 
     */
    changeRoleState(item) {
        this.modal.confirm({
            nzTitle: '变更状态',
            nzContent: `是否${item.roleState === 0 ? '停用' : '开启'}该角色`,
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.http.patch(this.url + '/hrm-role/state/' + item.guid, {}).subscribe((res: any) => {
                    if (res.code === 0) {
                        this.msg.success('变更成功！');
                        this.getData(null);
                    } else {
                        this.msg.error(res.message);
                    }
                });
            }
        });
    }
    /**
     * 格式化數據
     * 
     */
    initData(data) {
        data.forEach((element, key) => {
            element.checked = false;
            data[key] = element;
            if (element.subMenus.length > 0) {
                element.subMenus.forEach((value, key1) => {
                    value.checked = false;
                    data[key].subMenus[key1] = value;
                });
            }
        });
    }
    /**
 * 使用indexOf判断元素是否存在于数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
    isInArray3(arr, value) {
        if (arr.indexOf && typeof (arr.indexOf) === 'function') {
            const index = arr.indexOf(value);
            if (index >= 0) {
                return true;
            }
        }
        return false;
    }
}
