import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormatEmitEvent, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
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
    selector: 'app-recommend',
    styleUrls: ['./recommend.component.less'],
    templateUrl: './recommend.component.html',
})

export class RecommendComponent implements OnInit {

    form: FormGroup;
    public guid = this.tokenService.get().loginEid;
    public detailGuid;
    // 名字 电话 详情数据
    detailData = {
        name: '',
        phone: '',
        email: '',
        guid: ''
    };
    selectPeopleName = '';
    selectPeopleNameCopy = '';
    selectPeopleId = '';
    selectPeopleIdCopy = '';
    isLoadingOne = false;
    /*
  * 填写的数据列表
  * */
    public dataList = {
        deadline: '',
        departmentId: '',
        enterpriseId: '',
        interviewerIds: '',
        interviewerName: '',
        jobPostion: '',
        remark: '',
        resumeId: '',
        userId: this.tokenService.get().guid

    };
    /*
    * tag 相关
    * */
    ListData = [];
    deptEmployeeMap = {};
    inputVisible = false;
    inputValue = '';
    public resumeGuid: any;
    loading = true;
    // 企业职位数据
    public positionList: any[];
    // 获取所有的员工信息
    employeeData: any;
    setEmployeeId: any;
    // 面试官名称
    interviewerName: any;
    interviewerFlah = 1;

    // 获取部门名称
    departmentName: any;
    peopleData = [];
    selectPeopleData: any;
    employeeList: any;
    expandDataCache = {};
    ngOnInit(): void {
        this.getEducation();
        this.getDetail();
        // 获取部门主管
        this.getManager();
        // 获取树形图信息
        this.getData();
        this.form = this.fb.group({
            remark: [null],
            jobPostion: ['', [Validators.required]],
            departmentId: [null, [Validators.required]],
            deadline: ['', [Validators.required]],
        });
    }

    /*
    * 职位的获取
    * */
    public managerList: any = [];
    public url = environment.SERVER_URL + '/recruit';
    public urls = environment.SERVER_URL + environment.ENTERPRISE_URL;
    public FRAMEWORK_URL = environment.FRAMEWORK_URL + 'service';
    // public enterpriseId = this.tokenService.get().loginEid;
    @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

    constructor(private http: HttpClient,
        private fb: FormBuilder, private msg: NzMessageService, private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private route: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private reuseTabService: ITokenService) {
        this.route.params
            .subscribe((params: Params) => {
                return this.resumeGuid = params['guid'];
            });
    }

    /**
     * 设置主管弹出框
     *
     * @param {*} employeeGuid
     * @memberof DutySystemComponent
     */
    setEmployeeshowModal() {
        this.setEmployeeState = true;
    }
    // 取消选择面试官
    setEmployeesCancel() {
        this.setEmployeeState = false;
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
    // 选择员左边的点击事件
    mouseAction(name: string, event: NzFormatEmitEvent): void {
        this.peopleData = [];
        this.peopleData = this.deptEmployeeMap[event.node.key];
    }

    // 设置面试官
    public setEmployeeState = false;
    loginEid = this.tokenService.get().guid;
    loginUid = this.tokenService.get().userGuid;
    @ViewChild('inputElement') inputElement: ElementRef;
    // 查询详情 用户名 电话
    getDetail() {
        this.http.get(this.url + '/service/resume/' + this.resumeGuid)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.detailData = res.data.resume;
                    // console.log(this.detailData);

                }
                if (res.code !== 0) {
                    // this.detailData = [];
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    /*
    * 获取部门
    * */
    public getManager() {
        this.http.get(environment.SERVER_URL + '/enterprise/service/enterprise/dept/employeePart?enterpriseGuid=' + this.loginEid)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.managerList = res.data;
                }
                if (res.code !== 0) {
                    this.managerList = [];
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }
    // 获取树形图的内容
    getData() {
        this.ListData = this.ListData.filter(d => d.key === 0);
        this.http.get(this.urls + 'service/enterprise/dept/employee', { params: { enterpriseGuid: this.reuseTabService.get().guid } })
            .subscribe((res: any) => {
                this.loading = false;
                if (res.code === 0) {
                    this.employeeList = [new NzTreeNode(res.data)];
                    this.ListData = [...this.ListData, res.data];
                    this.ListData.forEach(item => {
                        // // console.log(this.expandDataCache[ item.departmentCode ] = '1');
                        this.expandDataCache[item.departmentCode] = this.convertTreeToList(item);
                    });
                    this.convertToEmployee(res.data);
                } else {
                    this.msg.error(res.message);
                }
            });
    }
    private visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
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
    /*
   * 获取公司职位
   * */
    public getEducation() {
        this.http.get(this.url + '/hrm-dictionary/type', {
            params: {
                enterpriseGuid: this.loginEid,
                dictType: 'DIC_POST',
                pageNum: '1',
                pageSize: '20'
            }
        })
            .subscribe((res: any) => {
                if (res.code === 1) {

                    this.positionList = res.data;
                } else {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    // 取消
    cancel() {
        // this.router.navigate(['/recruit']);
        window.history.go(-1);
    }

    //
    sliceTagName(tag: string): string {
        const isLongTag = tag.length > 20;
        return isLongTag ? `${tag.slice(0, 20)}...` : tag;
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
                // this.selectPeopleId = res.guid;
            }
        });

    }
    /**
     *设置主管确认按钮
     *
     * @memberof DutySystemComponent
     */
    setEmployeesOk() {
        this.selectPeopleNameCopy = this.selectPeopleName;
        this.interviewerFlah = 2;
        this.setEmployeeState = false;
        this.selectPeopleIdCopy = this.selectPeopleId;
    }
    // 禁用日期
    today = new Date();
    disabledDate = (current: Date): boolean => {
        // Can not select days before today and today
        return differenceInCalendarDays(current, this.today) < 0;
    }

    // 确定提交按钮

    _submitForm() {
        this.isLoadingOne = true;
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
            // return;
        }
        this.loading = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const obj = this.form.value;
        this.managerList.forEach(value => {
            if (obj.departmentId === value.guid) {
                obj['departmentName'] = value.departmentName;
            }

        });
        obj['userId'] = this.tokenService.get().guid;
        obj['interviewerName'] = this.selectPeopleNameCopy;
        obj['interviewerId'] = this.selectPeopleData;
        obj['resumeId'] = this.detailData.guid;
        obj['enterpriseId'] = this.tokenService.get().guid;
        // 日期的处理
        if (this.form.get('deadline').value) {
            const deadline = new Date(this.form.get('deadline').value);
            obj['deadline'] = '' + deadline.getFullYear() +
                (deadline.getMonth() + 1 < 10 ? '0' + (deadline.getMonth() + 1) : (deadline.getMonth() + 1)) +
                (deadline.getDate() < 10 ? '0' + deadline.getDate() : deadline.getDate()) + '000000';
        }
        this.http.post(this.url + '/service/recommend/recommend', obj)
            // .map(res => res.json())
            .subscribe((res: any) => {

                if (res.code === 0) {
                    this.msg.success('推荐成功', { nzDuration: 3000 });
                    this.loading = false;
                    this.isLoadingOne = false;
                    this.router.navigate(['/recruit/resume/alreadyresume']);
                } else {
                    this.msg.error(res.message, { nzDuration: 3000 });
                    this.loading = false;
                    this.isLoadingOne = false;
                }

            }, response => {
                // this.error = `账户或密码错误`;
                // console.log('POST call in error', response);
                return;
            });
    }


}
