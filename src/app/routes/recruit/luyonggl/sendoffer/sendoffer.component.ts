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
    selector: 'app-sendoffer',
    styleUrls: ['./sendoffer.component.less'],
    templateUrl: './sendoffer.component.html',
})
export class SendofferComponent implements OnInit {
    @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

    constructor(private http: HttpClient,
        private fb: FormBuilder, private msg: NzMessageService, private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private route: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private reuseTabService: ITokenService) {
        this.route.params
            .subscribe((params: Params) => {
                return this.guid = params['guid'];
            });
    }

    form: FormGroup;
    public guid: any;
    public detailGuid;
    // 查看offer
    public isVisibleoffer = false;
    inteviewNoticeTitle: any;
    inteviewNoticeContent: any;
    errflag = false;
    errContent: any;
    // 名字 电话 详情数据
    detailData = {
        name: '',
        phone: '',
        email: '',
        resumeId: '',
        approvalId: '',
        payWay: '',
        workNature: '',
    };
    departmentOptions = [];
    // type标志
    makeSure = 1;
    setEmployeesType: any;
    selectPeopleName = '';
    selectPeopleNameCopy = '';
    selectPeopleId = '';
    selectPeopleIdCopy = '';
    // 选择时间
    time: Date | null = null;
    defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
    // 多选框判断
    checked = false;
    /*
  * 填写的数据列表
  * */
    dataList = {
        interviewPostion: '',
        interviewDate: '',
        interviewTime: '',
        interviewerName: '',
        responsiblePhone: '',
        interviewAddress: '',
        remark: '',
        probationStage: '',
        interviewEntry: '',
        interviewEntrybm: '',
        entryDepartmentName: '',
        interviewWages: '',
        interviewWagessy: '',
        userId: this.tokenService.get().guid,
        //  interviewType: 1,
        messageType: 1,
        entryDepartmentId: '',
        contactId: '',
    };
    // 获取工作性质需要的数据
    public NatureOfWorkModelData = [];
    // 获取记薪方式需要的数据
    public PayStyleModelData = [];
    // 获取邮件模板需要的数据
    public templateDataEamil = [];
    public contactsId = [];
    emailType: any;
    NatureOfWorkModel: any;
    PayStyleModel: any;
    // 面试短信的传过去的内容
    templateContent: any;
    // 获取短信模板需要的数据
    public templateDataMsg = [];
    msgType: any;
    public setEmployeeState: any;
    deptEmployeeMap = {};
    // 放模板的数组
    /*
    * tag 相关
    * */
    ListData = [];
    inputVisible = false;
    inputValue = '';
    public resumeId: any;
    loading = true;
    // 企业职位数据
    public positionList: any[];
    // 获取所有的员工信息
    employeeData: any;
    setEmployeeId: any;
    // 面试官名称
    interviewerName: any;
    interviewerFlah = 1;
    interviewerFlah1 = 1;

    // 短信通知多选框
    setEmployeevisible: any;
    // 选择的类型
    saveType = '';
    selectName = '';
    selectId = '';
    // 获取部门名称
    departmentName: any;

    peopleData = [];

    // 树形选择框的数据
    selectPeopleData: any;
    employeeList: any;
    expandDataCache = {};

    ngOnInit(): void {
        this.getdropDownlist();
        this.getPaperType();
        this.getEmployee();
        this.form = this.fb.group({
            interviewTime: ['', [Validators.required]],
            responsiblePhone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            interviewAddress: ['', [Validators.required]],
            remark: [''],
            interviewNotifyEmailTemplateId: ['', [Validators.required]],
            NatureOfWork: ['', [Validators.required]],
            probationStage: ['', [Validators.required]],
            interviewEntry: ['', [Validators.required]],
            interviewEntrybm: ['', [Validators.required]],
            interviewerName: [''],
            PayStyle: ['', [Validators.required]],
            interviewWages: ['', [Validators.required]],
            interviewWagessy: ['', [Validators.required]],
            selectPeopleName: ['', [Validators.required]]
        });
        this.getData();
        // 获取短信模板信息
        this.getTemplateEmail();
        this.getTemplateMsg();

    }

    /*
    * 职位的获取
    * */
    public managerList: any = [];
    private deptUrl = environment.SERVER_URL + environment.ENTERPRISE_URL;
    public urlcommon = environment.SERVER_URL + '/commons';
    public url = environment.SERVER_URL + '/recruit';
    public urls = environment.SERVER_URL + environment.ENTERPRISE_URL;
    public FRAMEWORK_URL = environment.FRAMEWORK_URL + 'service';
    public enterpriseId = this.tokenService.get().loginEid;
    private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;

    // 获取提交之前的所有内容对象
    public allInfo: any;

    // 取消
    cancel() {
        this.router.navigate(['/recruit/hire-manage']);
    }
    // 查看offer返回
    handleCanceloffer() {
        this.isVisibleoffer = false; 
    }
 
    getData() {
        this.http.get(this.url + '/service/employApproval/' + this.guid)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    // console.log(res.data);
                    this.detailData = res.data;
                    this.dataList.probationStage = res.data.probationStage;
                    this.dataList.interviewTime = this.convertToDate(res.data.entryDateTime);
                    this.dataList.interviewEntry = res.data.entryPostion;
                    this.dataList.interviewEntrybm = res.data.entryDepartmentId;
                    this.dataList.entryDepartmentName = res.data.entryDepartmentName;
                    this.dataList.interviewAddress = res.data.entryAddress;
                    this.dataList.interviewerName = res.data.contactName;
                    this.dataList.responsiblePhone = res.data.contactPhone;
                    this.dataList.interviewWages = res.data.payRegularWorker;
                    this.dataList.interviewWagessy = res.data.payOnTrial;
                    this.dataList.remark = res.data.payRemark;
                    this.resumeId =  res.data.resumeId;
                    this.form.setValue({
                        interviewTime: this.convertToDate(res.data.entryDateTime),
                        probationStage: res.data.probationStage,
                        interviewEntry: res.data.entryPostion,
                        interviewEntrybm: res.data.entryDepartmentId,
                        interviewAddress : res.data.entryAddress,
                        interviewerName : res.data.contactName,
                        responsiblePhone: res.data.contactPhone,
                        interviewWages : res.data.payRegularWorker,
                        interviewWagessy: res.data.payOnTrial,
                        remark : res.data.payRemark,
                        interviewNotifyEmailTemplateId: '',
                        NatureOfWork: res.data.workNature,
                        PayStyle: res.data.payWay,
                        selectPeopleName: ''
                      });
                } else {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }
    convertToDate(time: string): any {
        if (time) {
            const n = parseInt(time.substring(0, 4), 10);
            const y = parseInt(time.substring(4, 6), 10) - 1;
            const r = parseInt(time.substring(6, 8), 10);
            const h = parseInt(time.substring(8, 10), 10);
            const m = parseInt(time.substring(10, 12), 10);
            const d = new Date(n, y, r, h, m);
            d.setFullYear(n);
            d.setMonth(y);
            d.setDate(r);
            d.setHours(h);
            d.setMinutes(m);
            return d;
        } else {
            return null;
        }
    }
    // 查询字典
    // 获取下拉数据
    public getdropDownlist() {
        this.http.get(this.dictionaryUrl + 'service/dictionary/all')
        .subscribe((res: any) => {
            if (res.code === 0) {
            res.data.forEach((value: any, key: any) => {
                if (value.dictCode === 'DIC_WORK_TYPE') {
                this.NatureOfWorkModelData = value.childrenDictionaries;
                }
                if (value.dictCode === 'DIC_PROBATION_PERIOD') {
                this.positionList = value.childrenDictionaries;
                // console.log(this.positionList);
                }
                if (value.dictCode === 'Pay_Way') { 
                this.PayStyleModelData = value.childrenDictionaries;
                // console.log(this.PayStyleModelData);
                }
            });
            }
        });
    }

    // 查询offer--邮件--模板列表
    getTemplateEmail() {
        this.http.get(this.url + '/service/recruitSettingTemplate/getList', {
            params: {
                userId: this.tokenService.get().guid,
                enterpriseId: this.tokenService.get().guid,
                category: '1',
                type: '2'
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.templateDataEamil = res.data;
                this.templateDataEamil.forEach(item => {
                    if (item.isSystem === 1) {
                        this.emailType = item.guid;
                    }
                });
            } else {
                // this.detailData = [];
                this.msg.error(res.message);
                this.loading = false;
            }
        });
    }
    getEmployee() { 
        this.http.get(this.urls + 'service/enterprise/dept/employee', { params: { enterpriseGuid: this.reuseTabService.get().guid } })
            .subscribe((res: any) => {
                this.loading = false;
                if (res.code === 0) {
                    // console.log(res.data);
                    // this.gsname = res.data.title;
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
    // 查询offer-短信--模板列表
    getTemplateMsg() {
        /* offer短信 */
        this.http.get(this.url + '/service/recruitSettingTemplate/getList', {
            params: {
                userId: this.tokenService.get().guid,
                enterpriseId: this.tokenService.get().guid,
                category: '1',
                type: '1'
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                // console.log(res.data);
                this.templateDataMsg = res.data;
                this.templateDataMsg.forEach(item => {
                    if (item.isSystem === 1) {
                        this.msgType = item.guid;
                    }
                });
            } else {
                this.msg.error(res.message);
                this.loading = false;
            }
        });
    }
    /* 
    获取部门
*/
    getPaperType() {
        this.http.get(this.deptUrl + 'service/enterprise/dept/employeePart', {
            params: {
                enterpriseGuid: this.tokenService.get().guid
            }
        })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.departmentOptions = res.data;
                    this.departmentOptions.forEach(item => {
                        this.dataList.entryDepartmentId = item.guid;
                    });
                } else {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    /* 联系人操作 */
    setEmployeeshowModal() {
        this.setEmployeeState = true;
    }
    setEmployeesCancel() {
        this.setEmployeeState = false;
    }
    setEmployeesOk() {
        this.makeSure = 2;
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
    mouseAction(name: string, event: NzFormatEmitEvent): void {
        this.peopleData = [];
        this.peopleData = this.deptEmployeeMap[event.node.key];
    }
    getChecked(): void {
        // console.log(this.peopleData);
        this.peopleData.forEach(res => {
            if (this.selectPeopleData === res.guid) {
                this.selectPeopleName = res.name;
                // this.selectPeopleId = res.guid;
            }
        });
    }

    getAllInfo() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
            // return;
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const obj = this.form.value;
        // console.log(obj);
        const obj1 = {};
        // 判断邮件模板
        this.templateDataEamil.forEach(item => {
            if (item.guid === obj.interviewNotifyEmailTemplateId) {
                // 邮件模板名称
                obj1['offerNotifyEmailTemplateId'] = item.guid;
                obj1['offerNotifyEmailTemplateName'] = item.templateName;
            }
        });
        // 判断是否发送短信
        if (this.checked === false) {
            obj1['isSms'] = 0;
        } else {
            obj1['isSms'] = 1;
            this.templateDataMsg.forEach(item => {
                if (item.guid === this.msgType) {
                    obj1['offerNotifySmsTemplateId'] = item.guid;
                    obj1['offerNotifySmsTemplateName'] = item.templateName;
                }
            });
           
        }
        // 获取部门名称
        const that = this;
        this.departmentOptions.forEach(function(item, index, arr) {
            if (item.guid === obj.probationStage) {
                that.dataList.entryDepartmentName = item.dictName;
            }
        });

        this.loading = true;
        obj1['enterpriseId'] = this.tokenService.get().guid; // 企业Id
        obj1['userId'] = this.tokenService.get().guid;
        obj1['contactId'] = this.selectPeopleData; // 联系人ID
        obj1['contactName'] = this.selectPeopleName; // 入职联系人名字
        obj1['contactPhone'] = obj.responsiblePhone; // 入职联系人电话
        obj1['entryAddress'] = obj.interviewAddress; // 入职地址
        obj1['entryDepartmentId'] = this.dataList.entryDepartmentId; // 入职部门id;
        obj1['entryDepartmentName'] = this.dataList.entryDepartmentName; // 入职部门名称
        obj1['entryPostion'] = obj.interviewEntry; // 入职职位 
        obj1['interviewEmployApprovalId'] = this.detailData.approvalId; // 面试录用审批id
        obj1['interviewId'] = ''; // 面试id
        obj1['payOnTrial'] = obj.interviewWagessy; // 试用工资（单位：元）
        obj1['payRegularWorker'] = obj.interviewWages; // 转正工资（单位：元）
        obj1['payRemark'] = obj.remark; // 薪酬备注
        obj1['payWay'] = this.detailData.payWay; // 计薪方式（1=按月，2=按年）
        obj1['probationStage'] = obj.probationStage; // 试用期
        obj1['resumeId'] = this.resumeId; // 简历ID
        obj1['workNature'] = this.detailData.workNature; // 工作性质（1=全职，2=兼职，3=实习）
        // 入职日期的处理
        if (this.form.get('interviewTime').value) {
            const interviewTime = new Date(this.form.get('interviewTime').value);
            obj1['entryDateTime'] = '' + interviewTime.getFullYear() +
                (interviewTime.getMonth() + 1 < 10 ? '0' + (interviewTime.getMonth() + 1) : (interviewTime.getMonth() + 1)) +
                (interviewTime.getDate() < 10 ? '0' + interviewTime.getDate() : interviewTime.getDate()) +
                (interviewTime.getHours() < 10 ? '0' + (interviewTime.getHours()) : (interviewTime.getHours())) +
                (interviewTime.getMinutes() < 10 ? '0' + interviewTime.getMinutes() : interviewTime.getMinutes()) +
                (interviewTime.getSeconds() < 10 ? '0' + interviewTime.getSeconds() : interviewTime.getSeconds());
        }
        return obj1;
    }
    // 发送Offer提交按钮

    _submitForm() {
        const obj1 = this.getAllInfo();
        this.http.post(this.url + '/service/interviewOffer', obj1)
            // .map(res => res.json())
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('发送成功', { nzDuration: 3000 });
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
    // 查看入职通知
    showInterview() {
        const obj1 = this.getAllInfo();
        // console.log(obj1);
        // localStorage.setItem('info', JSON.stringify(obj1));
        // this.router.navigate(['/recruit/hire-manage/lookoffer', this.detailData.resumeId]);
        // window.open( '/#/recruit/hire-manage/lookoffer' + this.detailData.resumeId); 
       
        let  param = {
            userId: '',
            enterpriseId: '',
            resumeId: '',
          //   interviewId: ',
            interviewEmployApprovalId: '',
            entryDateTime: '',
            probationStage: '',
            entryPostion: '',
            entryAddress: '',
            entryDepartmentId: '',
            entryDepartmentName: '',
            workNature: '',
            payWay: '',
            payOnTrial: '',
            payRegularWorker: '',
            payRemark: '',
            contactId: '',
            contactName: '',
            contactPhone: '',
            offerNotifyEmailTemplateId: ''
        };
        param = Object.assign(param, obj1);
        if (this.reuseTabService.get().type === 1) {
            param.userId = this.reuseTabService.get().guid;
        } else {
            param.userId = this.reuseTabService.get().userId;
        }
        param.enterpriseId = this.reuseTabService.get().guid;
        param.resumeId = this.resumeId;
        this.http.get(this.url + '/service/interviewOffer/view', {
            params: param
        }).subscribe((res: any) => {
            if (res.code === 0) {
                // console.log(res.data);
                this.isVisibleoffer = true;
                this.inteviewNoticeTitle = res.data.title;
                this.inteviewNoticeContent = res.data.content;
            }
            if (res.code !== 0) {
                // this.detailData = [];
                this.msg.error(res.message);
            }
        });

    }
}


