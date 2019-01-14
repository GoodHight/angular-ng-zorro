import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { NzMessageService, NzModalService, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd';
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
    };
    public serachState = 0;
    public dataList: any;
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
    deptEmployeeMap: any = {};
    tagValue = ['a10', 'c12', 'tag'];
    expandKeys = ['1001', '10001'];
    checkedKeys = ['100011', '1002'];
    selectedKeys = ['10001', '100011'];
    expandDefault = false;
    selectPeopleData = [];
    peopleData = [];
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
    public getData() {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        this.http.get(this.url + 'service/role/getSysRole', { params: { enterpriseId: this.tokenService.get().guid }})
            .subscribe((res: any) => {
                if (res.code === 0) {
                    res.data.forEach((value, key) => {
                        if (value.hrmEmployees.length > 0) {
                            let str = '';
                            value.hrmEmployees.forEach((element, key1) => {
                                str = str + element.name + ',';
                            });
                            str = str.substring(0, str.lastIndexOf(','));
                            res.data[key].hrmEmployeesList = str;
                        }
                    });
                    this.roleList = res.data;
                    this.q.total = res.total;
                    this.loading = false;
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
            this.guid = item.guid;
        }
    }
    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        this.http.delete(this.url + '/hrm-role/' + this.guid)
            .subscribe((res: any) => {
                if (res.code === 0) {
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
    mouseAction(name: string, event: NzFormatEmitEvent): void {
            this.peopleData = []; // 
            console.log(this.deptEmployeeMap);
            console.log(event.node);
            this.peopleData = this.deptEmployeeMap[event.node.key] || [];
            if (this.selectData.length > 0) {
                this.selectData.forEach(value => {
                    this.peopleData.forEach(element => {
                        if (value === element.userGuid) {
                            element.checked = true;
                        }
                    });
                });
            }
    }
    getChecked(index): void {
        // console.log(this.selectPeopleData);

        const getGuid = this.peopleData[index].userGuid;
        const selectPeopleData = this.selectPeopleData;
        let flag = true;
        if (selectPeopleData.length > 0) {
            selectPeopleData.forEach((value, key) => {
                if (getGuid === value.userGuid && flag) {
                    selectPeopleData.splice(key, 1);
                    this.selectData.splice(key, 1);
                    return flag = false;
                }
            });
            if (flag) {
                selectPeopleData.push(this.peopleData[index]); 
                this.selectData.push(getGuid);
            }
        } else {
            selectPeopleData.push(this.peopleData[index]);
            this.selectData.push(getGuid);
        }
        console.log(this.selectData);
        
    }
    // updateAllChecked(userGuid): void {
    //     const getGuid = userGuid;
    //     if (this.selectData.length > 0) {
    //         if (this.isInArray3(this.selectData, getGuid)) {
    //             this.selectData.splice(this.selectData.indexOf(getGuid), 1);
    //             let indexs = -1;
    //             this.selectPeopleData.forEach((value, i) => {
    //                 if (userGuid === value.userGuid) {
    //                     indexs = i;
    //                 }
    //             });
    //             this.selectPeopleData.splice(indexs, 1);
    //         } else {
    //             this.selectData.push(getGuid);
    //         }
    //     } else {
    //         this.selectData.push(getGuid);
    //     }
    // }
    // 角色权限的弹出框控制
    handleOk(): void {
        
        this.isVisible = true;
        let selectData: any;
        if (this.selectData.length === 0) {
            selectData = [];
        } else {
            selectData = this.selectData;
        }
        this.http.post(this.url + 'service/role/bindRoleToUser', {}, {
            params: {
                userIds: selectData,
                enterpriseId: this.tokenService.get().guid,
                roleId: this.roleId
            }
        }).subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('配置成功');
                } else {
                    this.msg.error(res.message);
                }
                this.getData();
                this.isVisible = false;
            });

    }

    handleCancel(): void {
        this.isVisible = false;
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
    public pageChange(pi: number, state: any) {
        if (this.serachState !== 1 || pi > 1) {
            this.serachState = 0;
            this.q.pageNum = pi;
            this.loading = true;
            // this.getData();
        }

    }

    to(item: any) {
        this.router.navigateByUrl(`${item.key}`).then();
    }

    ngOnInit() {
        this.getData();
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
            this.router.navigate(['/admin/role/add/', item.guid]);
        }
    }
    convertToEmployee(root: any): void {
        this.convert2Employee(root);
        let v = [];
        for (const key in this.deptEmployeeMap) {
            if (this.deptEmployeeMap.hasOwnProperty(key)) {
                const element = this.deptEmployeeMap[key];
                v = v.concat(element);
            }
        }
        this.deptEmployeeMap[root.key] = v;
    }

    convert2Employee(department: any): void {
        const total = [].concat(department.employees);
        if (department.children.length > 0) {
            for (let i = 0; i < department.children.length; i++) {
                this.convert2Employee(department.children[i]);
            }
        }
        this.deptEmployeeMap[department.key] = total;
    }
    /**
     * 维护功能
     * @param item 
     */
    maintainFun(item, no, data) {
        this.selectPeopleData = [];
        this.peopleData = [];
        this.selectData = [];
        const datas = [];
        if (data.length > 0) {
            data.forEach(box => {
                datas.push(box.userGuid);
            });
            datas.forEach(value => {
                this.peopleData.forEach(element => {
                    if (value === element.userGuid) {
                        element.checked = true;
                    }
                });
            });
            this.selectData = datas;
        }
        console.log(datas);
        console.log(this.selectData);
        this.getmultiplexing();
        // this.selectData = datas;
        this.isVisible = true;
        this.roleId = item;
        this.http.get(environment.ENTERPRISE_URL + 'service/enterprise/dept/employee', { params: { enterpriseGuid: this.tokenService.get().guid } })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.convertToEmployee(res.data);
                    this.dataList = [new NzTreeNode(res.data)];
                }
            });
    }
    getmultiplexing() {
        this.http.get(environment.ENTERPRISE_URL + 'service/employee/enterprise?enterpriseGuid=' + this.tokenService.get().guid).subscribe((res: any) => {
            if (res.code === 0) {
                if (this.selectData.length > 0) {
                    this.selectData.forEach(value => {
                        res.data.forEach(element => {
                            console.log(element);

                            if (value === element.userGuid) {
                                element.checked = true;
                                element.guid = element.userGuid;
                                this.selectPeopleData.push(element);
                            }
                        });
                    });
                }

            }
        });
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
                        this.getData();
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
