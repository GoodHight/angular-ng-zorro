import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NzFormatEmitEvent, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

export interface TreeNodeInterface {
    key: number;
    name: string;
    age: number;
    level: number;
    expand: boolean;
    address: string;
    children?: TreeNodeInterface[];
}

@Component({
    selector: 'app-duty-system',
    styleUrls: ['./duty-system.component.less'],
    templateUrl: './duty-system.component.html',
})

export class DutySystemComponent implements OnInit {
    validateForm: FormGroup;
    gsname = '';
    public url = environment.SERVER_URL + environment.ENTERPRISE_URL;
    expandDataCache = {};
    public title: any;
    public departmentParentGuid: any;
    loading = true;
    public isVisible = false;
    public employeeName: any;
    public isVisibleMiddle = false;
    public zgMiddle = false;
    public bmtitle = '';
    departmentCode = '';
    key = '';
    pageNum: any = 1;
    public pageSize: any = 100000;
    departmentList = [];
    public isOkLoading = false;
    public employeeInfo = [];
    data: any[];
    // 判断是新增还是修改 0修改1新增
    public type = '0';
    asd = '0';
    deptEmployeeMap = {};
    public dataList = {
        deptName: '',
        deptParentGuid: '',
        enterpriseGuid: this.reuseTabService.get().guid,
        userGuid: this.reuseTabService.get().guid
    };
    public ListData = [];
    public departmentName: any;
    public employeeId = this.reuseTabService.get().loginEid;
    public setEmployeeId = '';
    public setEmployeeState = false;
    peopleData = [];
    employeeList: any;
    selectPeopleData: any;
    selectPeopleName = '';
    constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, @Inject(DA_SERVICE_TOKEN) private reuseTabService: ITokenService,
        private message: NzMessageService) {

    }


    collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
        if ($event === false) {
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.key === d.key);
                    if (target.level === 0) {
                        target.expand = true;
                    } else {
                        target.expand = false;
                    }
                    this.collapse(array, target, false);
                });
            } else {
                return;
            }
        }
    }

    public submitForm() {

    }

    public getFormControl() {
        return this.validateForm.controls[name];
    }

    convertTreeToList(root: object): TreeNodeInterface[] {
        const stack = [];
        const array = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: false });

        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {

                    stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
                }
            }

        }
        array[0].expand = true;
        return array;
    }

    public getEmployeeName() {
        // const guid = this.dataList.departmentParentGuid;
        // this.http.get(this.url + 'employee/department/', { params: {departmentGuid: guid} })
        //     .subscribe((res: any) => {
        //         if (res.code === 0) {
        //             this.employeeUser = res.data;
        //         }
        //     });
    }


    getData() {
        this.ListData = this.ListData.filter(d => d.key === 0);
        this.http.get(this.url + 'service/enterprise/dept/employee', { params: { enterpriseGuid: this.reuseTabService.get().guid } })
            .subscribe((res: any) => {
                this.loading = false;
                if (res.code === 0) {
                    this.gsname = res.data.title;
                    this.employeeList = [new NzTreeNode(res.data)];
                    this.ListData = [...this.ListData, res.data];
                    this.ListData.forEach(item => {
                        // // console.log(this.expandDataCache[ item.departmentCode ] = '1');
                        this.expandDataCache[item.departmentCode] = this.convertTreeToList(item);
                    });
                    this.convertToEmployee(res.data);
                } else {
                    this.message.error(res.message);
                }
            });
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            departmentParentGuid: [this.departmentParentGuid, [Validators.required]],
            departmentName: [this.departmentName],
        });
        this.getData();
    }

    showModalMiddle(employeeId: any): void {
        this.isVisibleMiddle = true;
        this.employeeId = employeeId;
    }

    private showModal(guid: any, departmentName: any, deptCode: any, departmentCode: any, employeeName: any, type: any) {
        this.validateForm = this.fb.group({
            departmentParentGuid: [departmentCode],
            departmentName: [departmentName],
        });
        this.dataList = {
            deptName: departmentName,
            deptParentGuid: departmentCode,
            enterpriseGuid: this.reuseTabService.get().guid,
            userGuid: this.reuseTabService.get().guid
        };
        this.type = type;
        if (type === '1') {

            this.title = '新增部门';
        } else {
            this.title = '修改部门';
        }

        if (guid === '') {
            guid = this.reuseTabService.get().guid;
        }
        this.employeeId = guid;
        this.isVisible = true;
        this.departmentName = departmentName;
        this.departmentParentGuid = departmentCode;
        this.http.get(this.url + 'service/enterprise/dept/getParentOptionList?enterpriseGuid=' + this.reuseTabService.get().guid + '&currentDeptCode=' + deptCode)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.employeeInfo = res.data;
                    // this.departmentName = res.data.departmentName;
                }
            });
        if (type === '0') {
            this.http.get(this.url + 'service/enterprise/dept/' + guid)
                .subscribe((res: any) => {
                    if (res.code === 0) {
                        // this.employeeInfo.push()
                        this.dataList.deptName = res.data.deptName;
                        this.dataList.deptParentGuid = res.data.deptParentGuid;
                    }
                });
        }

    }

    private visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    public handleOk(): void {
        if (this.type === '0') {
            this.http.patch(this.url + 'service/enterprise/dept/' + this.employeeId, this.dataList).subscribe((res: any) => {
                if (res.code === 0) {
                    this.message.success('修改成功！');
                    this.getData();
                    this.isOkLoading = true;
                } else {
                    this.message.error(res.message);
                }
                this.isOkLoading = false;
                this.isVisible = false;
            });
        } else {
            if (this.dataList.deptParentGuid === '') {
                this.message.error('请选择上级部门');
                return;
            }
            if (this.dataList.deptName === '') {
                this.message.error('请填写部门名称');
                return;
            }
            this.http.post(this.url + 'service/enterprise/dept/', this.dataList).subscribe((res: any) => {
                if (res.code === 0) {
                    this.message.success('新增成功！');
                    this.getData();
                    this.isOkLoading = true;
                } else {
                    this.message.error(res.message);
                }
                this.isOkLoading = false;
                this.isVisible = false;
            });
        }

    }

    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const body = new HttpParams()
            .set('userGuid', this.reuseTabService.get().guid);
        this.http.delete(this.url + 'service/enterprise/dept/' + this.employeeId, { params: body }).subscribe((res: any) => {
            if (res.code === 0) {
                this.getData();
                this.message.success('删除成功');
                this.isVisibleMiddle = false;
                this.isVisible = false;
            } else {
                this.message.error(res.message);
            }
        });
    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;
    }
    getDepartment() {
        this.http.get(this.url + 'service/employee/departmentCode/key', {
            params: {
                key: this.key,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                departmentCode: this.departmentCode,
                enterpriseGuid: this.reuseTabService.get().guid,
            }
        }).subscribe((res: any) => {
            // console.log(res);
            if (res.code === 0) {
                this.departmentList = res.data;
            }
        });
    }
    // 设置主管
    zgOkMiddle(): void {
        this.zgMiddle = false;

    }
    zgshowModal(key, title): void {
        this.zgMiddle = true;
        this.bmtitle = title;
        this.departmentCode = key;
        this.getDepartment();
    }
    zgCancelMiddle(): void {
        this.zgMiddle = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    /**
     * 设置主管弹出框
     *
     * @param {*} employeeGuid
     * @memberof DutySystemComponent
     */
    setEmployeeshowModal(employeeGuid, selectPeopleName) {
        this.setEmployeeId = employeeGuid;
        this.selectPeopleName = selectPeopleName;
        this.setEmployeeState = true;

    }

    /**
     *设置主管确认按钮
     *
     * @memberof DutySystemComponent
     */
    setEmployeesOk() {
        this.http.patch(environment.ENTERPRISE_URL + 'service/enterprise/dept/setManager/' + this.setEmployeeId, {},
            { params: { employeeGuid: this.selectPeopleData, employeeName: this.selectPeopleName } })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.setEmployeeState = false;
                    this.getData();
                    this.selectPeopleData = '';
                } else {
                    this.message.error(res.message);
                }
            });
    }
    setEmployeesCancel() {
        this.setEmployeeState = false;
        this.selectPeopleData = '';
    }

    /**
     *
     *
     * @param {string} name
     * @param {NzFormatEmitEvent} event
     * @memberof DutySystemComponent
     */
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
    mouseAction(name: string, event: NzFormatEmitEvent): void {
        this.peopleData = [];
        this.peopleData = this.deptEmployeeMap[event.node.key];
    }

    /**
     *保存主管姓名以及id
     *
     * @memberof DutySystemComponent
     */
    getChecked(): void {
        this.peopleData.forEach(res => {
            if (this.selectPeopleData === res.guid) {
                this.selectPeopleName = res.name;
            }
        });
    }
}
