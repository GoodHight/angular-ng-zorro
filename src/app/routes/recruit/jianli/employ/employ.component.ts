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
    selector: 'app-employ',
    styleUrls: ['./employ.component.less'],
    templateUrl: './employ.component.html',
})

export class EmployComponent implements OnInit {

    form: FormGroup;
    public guid = this.tokenService.get().loginEid;

    public resumeGuid: any;
    loading = true;
    // 审批人弹窗 
    public setEmployeeId = '';
    selectPeopleName = '';
    public setEmployeeState = false;
    employeeList: any;
    selectPeopleData: any;
    peopleData = [];
    public ListData = [];
    // gsname = '';
    expandDataCache = {};
    // 获取审批人的id  approvalId 审批人的name approvalName
    selectPeopleId: any;
    deptEmployeeMap = {};
    // 确定按钮
    makeSure = 1;
    // 路径
    public url = environment.SERVER_URL + '/recruit';
    public urls = environment.SERVER_URL + environment.ENTERPRISE_URL;
    private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
    // 获取传过来的姓名 电话
    detailData = {
        name: '',
        phone: '',
        email: '',
        guid: ''
    };
    mName: any = [];
    // 抄送人 copyUserLists 
    copyUserLists: any = [];
    sendPerson = [];
    // 下拉数据
    // probationStage 试用期
    public positionList = [
        /*   {
              dictName: '一个月',
              guid: 1
          },
          {
              dictName: '两个月',
              guid: 2
          },      
          {
              dictName: '三个月',
              guid: 3
          },
          {
              dictName: '四个月',
              guid: 4
          },
          {
              dictName: '五个月',
              guid: 5
          },
          {
              dictName: '六个月',
              guid: 6
          } */
    ];
    // 工作性质 workNature
    workNatureData = [
        /*   {
              dictName: '全职',
              guid: 1
          },
          {
              dictName: '兼职',
              guid: 2
          },
          {
              dictName: '实习',
              guid: 3
          } */
    ];
    // payWay 付薪方式
    payWayData = [
        /*  {
             dictName: '按月',
             guid: 1
         },
         {
             dictName: '按年',
             guid: 2
         } */
    ];
    /*
    * 职位的获取
    * */
    public managerList: any;
    @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;
    loginEid = this.tokenService.get().guid;
    loginUid = this.tokenService.get().userGuid;
    userId: any;
    enterpriseId: any;
    /*
   * 新增 修改的数据
   * */
    public dataList = {
        // 入职时间
        entryDateTime: '',
        // 试用期
        probationStage: '',
        // 入职职位
        entryPostion: '',
        // 入职部门
        // entryDepart: '',
        entryDepartmentId: '',
        entryDepartmentName: '',
        // 工作性质 
        workNature: '',
        // 计薪方式
        payWay: '',
        // 加薪备注
        payRemark: '',
        // 转正工资
        payRegularWorker: '',
        // 试用工资
        payOnTrial: '',

        resumeId: '',
        enterpriseId: '',
        userId: '',
        // 审批人
        approvalName: '',
        approvalId: '',
        // 抄送人
        copyUserLists: []

    };
    // 入职部门

    @ViewChild('inputElement') inputElement: ElementRef;

    constructor(private http: HttpClient,
        private fb: FormBuilder, private msg: NzMessageService, private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private route: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private reuseTabService: ITokenService) {
        this.route.params
            .subscribe((params: Params) => {
                this.resumeGuid = params['guid'];
                // console.log(this.resumeGuid);
                // console.log( params['guid']);
                return this.guid = params['guid'];
            });
    }

    // 
    public isVisible = false;

    // 初始化
    ngOnInit(): void {
        // this.getEducation();
        if (this.tokenService.get().type === 1) {
            this.userId = this.tokenService.get().guid;
        } else {
            this.userId = this.tokenService.get().userId;
        }
        this.enterpriseId = this.tokenService.get().guid;
        this.getDetail();
        this.getManager();
        this.getdropDownlist();
        this.getData();

        //   this.getSelectData();
        this.form = this.fb.group({
            entryDateTime: [null, [Validators.required]],
            probationStage: [null, [Validators.required]],
            // 入职职位
            entryPostion: [null, [Validators.required]],
            // 入职部门
            entryDepartmentId: [null, [Validators.required]],
            // 工作性质
            workNature: [null, [Validators.required]],
            // 计薪方式
            payWay: [null, [Validators.required]],
            payRemark: [''],
            // 转正工资
            payRegularWorker: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
            // 试用期工资
            payOnTrial: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],

        });
    }
    // 获取下拉数据
    public getdropDownlist() {
        this.http.get(this.dictionaryUrl + 'service/dictionary/all')
            .subscribe((res: any) => {
                if (res.code === 0) {
                    res.data.forEach((value: any, key: any) => {
                        if (value.dictCode === 'DIC_WORK_TYPE') {
                            this.workNatureData = value.childrenDictionaries;
                        }
                        if (value.dictCode === 'DIC_PROBATION_PERIOD') {
                            this.positionList = value.childrenDictionaries;
                            // console.log(this.positionList);
                        }
                        if (value.dictCode === 'Pay_Way') {
                            this.payWayData = value.childrenDictionaries;
                            // console.log(this.payWayData);
                        }
                    });
                }
            });
    }

    // 查询详情
    getDetail() {
        this.http.get(this.url + '/service/resume/' + this.guid)
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

    dateTransformToString(inDate: Date | string | any, format?: string): string {
        let year = null,
            month = null,
            day = null,
            hour = null,
            minute = null,
            sec = null,
            date = null;

        if (inDate instanceof Date) {
            date = inDate;
        } else if (inDate === '' || inDate === null || inDate === undefined) {
            return '';
        } else {
            try {
                date = new Date(inDate);
            } catch (error) {
                return '';
            }
        }
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hour = date.getHours();
        minute = date.getMinutes();
        sec = date.getSeconds();
        let returnStr = null;
        if (format === 'yyyyMM') {
            returnStr = '' + year + (month < 10 ? '0' + month : month);
        } else {
            returnStr = '' + year + (month < 10 ? '0' + month : month) +
                (day < 10 ? '0' + day : day) +
                (hour < 10 ? '0' + hour : hour) +
                (minute < 10 ? '0' + minute : minute) +
                (sec < 10 ? '0' + sec : sec);
        }
        return returnStr;
    }

    _submitForm() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
            // return;
        }
        const obj = this.form.value;
        if (this.form.get('entryDateTime').value) {
            obj['entryDateTime'] = this.dateTransformToString(this.form.get('entryDateTime').value);
        }
        obj['copyUserLists'] = this.copyUserLists;
        // 入职部门的id
        this.managerList.forEach(value => {
            if (obj.entryDepartmentId === value.guid) {
                obj['entryDepartmentName'] = value.departmentName;
            }

        });
        // console.log(obj);
        this.dataList = Object.assign(this.dataList, obj);
        this.loading = true;
        this.dataList.resumeId = this.resumeGuid;
        this.dataList.enterpriseId = this.enterpriseId;
        this.dataList.userId = this.userId;
        // this.dataList.approvalId = this.setEmployeeId;
        this.dataList.approvalId = this.selectPeopleData;
        this.dataList.approvalName = this.selectPeopleName;
        // console.log(this.dataList);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        this.http.post(this.url + '/service/employApproval', this.dataList, { headers: headers })
            // .map(res => res.json())
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('操作成功', { nzDuration: 3000 });
                    this.loading = false;
                    this.router.navigate(['/recruit/hire-manage']);
                } else {
                    this.msg.error(res.message, { nzDuration: 3000 });
                    this.loading = false;
                }

            }, response => {
                // this.error = `账户或密码错误`;
                // console.log('POST call in error', response);
                return;
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
                    // console.log(this.managerList);

                }
                if (res.code !== 0) {
                    this.managerList = [];
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

    /**
     * 设置主管弹出框
     *
     * @param {*} employeeGuid
     * @memberof DutySystemComponent
     */
    /*   setEmployeeshowModal(employeeGuid, selectPeopleName) {
          this.setEmployeeId = employeeGuid;
          this.selectPeopleName = selectPeopleName;
          this.setEmployeeState = true;
      } */
    setEmployeeshowModal() {
        this.setEmployeeState = true;
    }
    setEmployeesCancel() {
        this.setEmployeeState = false;
    }


    /**
     *设置主管确认按钮
     *
     * @memberof DutySystemComponent
     */
    setEmployeesOk() {
        // this.http.patch(environment.ENTERPRISE_URL + 'service/enterprise/dept/setManager/' + this.setEmployeeId, null,
        //     { params: { employeeGuid: this.selectPeopleData, employeeName: this.selectPeopleName } })
        //     .subscribe((res: any) => {
        //         if (res.code === 0) {
        //             this.setEmployeeState = false;
        //             this.getData();
        //         } else {
        //             this.msg.error(res.message);
        //         }
        //     });
        this.makeSure = 2;
        // console.log(this.makeSure);

        this.setEmployeeState = false;
    }
    /**
 *保存主管姓名以及id
 *
 * @memberof DutySystemComponent
 */
    getChecked(): void {
        // console.log(this.peopleData);
        this.peopleData.forEach(res => {
            if (this.selectPeopleData === res.guid) {
                this.selectPeopleName = res.name;
                // this.selectPeopleId = res.guid;
            }
        });
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
    mouseAction(name: string, event: NzFormatEmitEvent): void {
        this.peopleData = [];
        this.peopleData = this.deptEmployeeMap[event.node.key];
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

    getData() {
        this.ListData = this.ListData.filter(d => d.key === 0);
        this.http.get(this.urls + 'service/enterprise/dept/employee', { params: { enterpriseGuid: this.reuseTabService.get().guid } })
            .subscribe((res: any) => {
                this.loading = false;
                if (res.code === 0) {
                    // console.log(res.data);
                    // this.gsname = res.data.title;
                    this.employeeList = [new NzTreeNode(res.data)];
                    this.ListData = [...this.ListData, res.data];
                    // console.log(this.employeeList);
                    // console.log(this.ListData);
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



    // 多个抄送人

    showModal(): void {
        this.isVisible = true;
    }

    changeSelectPoeple(event): void {
        // console.log(event);
        this.sendPerson = event;
        // console.log(this.sendPerson);
        this.copyUserLists = [];
        this.sendPerson.forEach(item => {
            const o = {};
            o[item.guid] = item.name;
            this.mName.push(item.name);
            this.copyUserLists.push(o);
        });

    }

    handleOk(): void {
        // console.log('Button ok clicked!');
        this.isVisible = false;
    }

    handleCancel(): void {
        // console.log('Button cancel clicked!');
        this.isVisible = false;
    }


}
