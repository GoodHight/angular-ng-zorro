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
    selector: 'app-notice',
    styleUrls: ['./notice.component.less'],
    templateUrl: './notice.component.html',
})
export class NoticeComponent implements OnInit {
    @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

    constructor(private http: HttpClient,
        private fb: FormBuilder, private msg: NzMessageService, private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private route: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private reuseTabService: ITokenService) {
        this.route.params
            .subscribe((params: Params) => {
                       this.entry = params['entry'];
                return this.resumeGuid = params['guid'];
            });
    }

    form: FormGroup;
    public guid = this.tokenService.get().loginEid;
    public detailGuid;
    // 名字 电话 详情数据
    detailData = {
        name: '',
        phone: '',
        email: '',
        guid: '',
        resumeId: ''
    };
    deptEmployeeMap = {};
    // type标志
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
     // 查看面试通知
     public isVisibleNotice = false;
     inteviewNoticeTitle: any;
     inteviewNoticeContent: any;
    /*
  * 填写的数据列表
  * */
    public dataList = {
        interviewPostion: '',
        departmentId: '',
        interviewDate: '',
        interviewTime: '',
        interviewerName: '',
        responsiblePhone: '',
        interviewAddress: '',
        remark: '',
        userId: this.tokenService.get().guid,
        //  interviewType: 1,
        messageType: 1,

    };
    // 获取邮件模板需要的数据
    public templateDataEamil = [];
    emailType: any;
    // 面试短信的传过去的内容
    templateContent: any;
    // 获取短信模板需要的数据
    public templateDataMsg = [];
    msgType: any;
    // 放模板的数组
    /*
    * tag 相关
    * */
    ListData = [];
    inputVisible = false;
    inputValue = '';
    public resumeGuid: any;
    public entry: any;
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
        this.form = this.fb.group({
            interviewPostion: ['', [Validators.required]],
            departmentId: ['', [Validators.required]],
            interviewDate: ['', [Validators.required]],
            interviewTime: ['', [Validators.required]],
            responsiblePhone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            interviewAddress: ['', [Validators.required]],
            remark: [''],
            interviewNotifyEmailTemplateId: [''],

        });
        this.getEducation();
        this.getDetail();
        // 获取部门主管
        this.getManager();
        // 获取树形图信息
        this.getData();
         // 获取邮件模板信息
         this.getTemplateEmail();
         // 获取短信模板信息
         this.getTemplateMsg();
    }

    /*
    * 职位的获取
    * */
    public managerList: any = [];
    public url = environment.SERVER_URL + '/recruit';
    public urls = environment.SERVER_URL + environment.ENTERPRISE_URL;
    public FRAMEWORK_URL = environment.FRAMEWORK_URL + 'service';
    public enterpriseId = this.tokenService.get().loginEid;

    /**
     * 设置主管弹出框
     *
     * @param {*} employeeGuid
     * @memberof DutySystemComponent
     */
    setEmployeeshowModal(type) {
        if (type === '1') {
            this.saveType = type;
            this.setEmployeeStateReponse = true;
            this.selectPeopleData =  this.selectId; //  默认面试负责人选中
            // 中间变量 选中name id
            this.selectPeopleName = this.selectName;
            this.selectPeopleId = this.selectId;
        } else {
            this.saveType = type;
            this.setEmployeeState = true;
            this.selectPeopleData =  this.selectPeopleIdCopy; //  默认面试官选中
             // 中间变量 选中name id
            this.selectPeopleName = this.selectPeopleNameCopy;
            this.selectPeopleId = this.selectPeopleIdCopy;
        }
        this.setEmployeesType = type;
    }
    // 取消选择面试官
    setEmployeesCancel() {
        this.setEmployeeState = false;
    }
    // 取消选择面试负责人
    setEmployeesReponseCancel() {
        this.setEmployeeStateReponse = false;
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
    // 设置面试负责人
    public setEmployeeStateReponse = false;
    loginEid = this.tokenService.get().guid;
    loginUid = this.tokenService.get().userGuid;
    @ViewChild('inputElement') inputElement: ElementRef;
    // 查询详情 用户名 电话
    getDetail() {
        if (this.entry === 'modify') {
            this.http.get(this.url + '/service/interview/' + this.resumeGuid)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    // console.log(res.data);
                    this.detailData.name = res.data.name;
                    this.detailData.phone = res.data.phone;
                    this.detailData.email = res.data.email;
                    this.detailData.guid = res.data.guid;
                    this.detailData.resumeId = res.data.resumeId;

                    this.dataList.interviewPostion = res.data.interviewPostion;
                    this.dataList.departmentId = res.data.departmentId;
                    this.dataList.interviewDate = res.data.interviewDate;
                    this.dataList.interviewTime = res.data.interviewTime;
                    this.dataList.interviewerName = res.data.interviewerName;
                    this.dataList.responsiblePhone = res.data.responsiblePhone;
                    this.dataList.interviewAddress = res.data.interviewAddress;
                    this.dataList.remark = res.data.remark;
                     this.selectPeopleNameCopy = res.data.interviewerName;  // 面试官
                     this.selectPeopleIdCopy =  res.data.interviewerId;
                     this.selectName = res.data.responsibleName; // 负责人
                     this.selectId = res.data.responsibleId;
                     this.form.setValue({
                        interviewPostion: res.data.interviewPostion,
                        departmentId: res.data.departmentId,
                        interviewDate: this.convertToDate(res.data.interviewDate),
                        interviewTime: this.convertToTime(res.data.interviewTime),
                        responsiblePhone: res.data.responsiblePhone,
                        interviewAddress : res.data.interviewAddress,
                        remark : res.data.remark,
                        interviewNotifyEmailTemplateId: '',
                      });
                } else {
                    // this.detailData = [];
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
        } else {
            this.http.get(this.url + '/service/resume/' + this.resumeGuid)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.detailData = res.data.resume;
                } else {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
        }
        
    }

    convertToDate(time: string): any {
        if (time) {
            const n = parseInt(time.substring(0, 4), 10);
            const y = parseInt(time.substring(4, 6), 10) - 1;
            const r = parseInt(time.substring(6, 8), 10);
            const d = new Date(n, y, r);
            d.setFullYear(n);
            d.setMonth(y);
            d.setDate(r);
            return d;
        } else {
            return null;
        }
    }
    convertToTime(time: string): any {
        if (time) {
          const h = parseInt(time.substring(0, 2), 10);
          const m = parseInt(time.substring(2, 4), 10);
          const d = new Date(h);
          d.setHours(h);
          d.setMinutes(m);
          return d;
        } else {
          return null;
        }
      }

    /*
    * 获取部门主管
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
        window.history.go(-1);
        // if (this.entry !== 'modify') {
        //     this.router.navigate(['/recruit']);
        // } else {
        //     this.router.navigate(['/recruit/interview']);
        // }
    }
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
                this.selectPeopleId = res.guid;
            }
        });
    }

    /**
     *设置主管确认按钮
     *
     * @memberof DutySystemComponent
     */
    setEmployeesOk() {
        if (this.saveType === '0') {
            this.selectPeopleNameCopy = this.selectPeopleName;
            this.selectPeopleIdCopy = this.selectPeopleId;
            // console.log(this.selectPeopleNameCopy);
            // console.log(this.selectPeopleIdCopy);
            this.setEmployeeState = false;
        } else {
            this.selectName = this.selectPeopleName;
            this.selectId = this.selectPeopleId;
            // console.log(this.selectName);
            // console.log(this.selectId);
            this.setEmployeeStateReponse = false;
        }

    }

    // 禁用日期
    today = new Date();
    disabledDate = (current: Date): boolean => {
        // Can not select days before today and today
        return differenceInCalendarDays(current, this.today) < 0;
    }
    // 查询面试通知邮--邮件--模板列表
    getTemplateEmail() {
        this.http.get(this.url + '/service/recruitSettingTemplate/getPageList/', {
            params: {
                userId: this.tokenService.get().guid,
                enterpriseId: this.tokenService.get().guid,
                category: '2',
                type: '2'
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.templateDataEamil = res.data;
                // console.log( this.templateDataEamil);
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
    // 查询面试通知邮--短信--模板列表
    getTemplateMsg() {
        this.http.get(this.url + '/service/recruitSettingTemplate/getPageList/', {
            params: {
                userId: this.tokenService.get().guid,
                enterpriseId: this.tokenService.get().guid,
                category: '2',
                type: '1'
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.templateDataMsg = res.data;
                // console.log(this.templateDataMsg);
                this.templateDataMsg.forEach(item => {
                    if (item.isSystem === 1) {
                        this.msgType = item.guid;
                    }
                });

            }
            if (res.code !== 0) {
                // this.detailData = [];
                this.msg.error(res.message);
                this.loading = false;
            }
        });
    }

    // 确定提交按钮

    _submitForm() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
            // return;
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const obj = this.form.value;
        // 判断邮件模板
        this.templateDataEamil.forEach(item => {
            // console.log(item);
            
            if (item.guid === obj.interviewNotifyEmailTemplateId) {
                // 邮件模板名称
                obj['interviewNotifyEmailTemplateId'] = item.guid;
                obj['interviewNotifyEmailTemplateName'] = item.templateName;
            }
        });
        // 判断是否发送短信
        if (this.checked === false) {
            obj['isSms'] = 0;
        } else {
            obj['isSms'] = 1;
            this.templateDataMsg.forEach(item => {
                if (item.guid === this.msgType) {
                    obj['interviewNotifySmsTemplateId'] = item.guid;
                    obj['interviewNotifySmsTemplateName'] = item.templateName;
                }
            });
        }
        this.loading = true;
        this.managerList.forEach(value => {
            if (obj.departmentId === value.guid) {
                obj['departmentName'] = value.departmentName;
            }
        });
        obj['enterpriseId'] = this.tokenService.get().guid;
        obj['userId'] = this.tokenService.get().guid;
        // 面试官
        obj['interviewerName'] = this.selectPeopleNameCopy;
        obj['interviewerId'] = this.selectPeopleIdCopy;
        // 负责人
        obj['responsibleName'] = this.selectName;
        obj['responsibleId'] = this.selectId;
       
        // 日期的处理
        if (this.form.get('interviewDate').value) {
            const interviewDate = new Date(this.form.get('interviewDate').value);
            obj['interviewDate'] = '' + interviewDate.getFullYear() +
                (interviewDate.getMonth() + 1 < 10 ? '0' + (interviewDate.getMonth() + 1) : (interviewDate.getMonth() + 1)) +
                (interviewDate.getDate() < 10 ? '0' + interviewDate.getDate() : interviewDate.getDate());
        }
        if (this.form.get('interviewTime').value) {
            const interviewTime = new Date(this.form.get('interviewTime').value);
            obj['interviewTime'] = '' +
                (interviewTime.getHours() < 10 ? '0' + (interviewTime.getHours()) : (interviewTime.getHours())) +
                (interviewTime.getMinutes() < 10 ? '0' + interviewTime.getMinutes() : interviewTime.getMinutes()) +
                (interviewTime.getSeconds() < 10 ? '0' + interviewTime.getSeconds() : interviewTime.getSeconds());
        }
        // console.log(obj);
        this.loading = false;

        if (this.entry !== 'modify') {
             obj['resumeId'] = this.resumeGuid;
            this.http.post(this.url + '/service/interview', obj)
            // .map(res => res.json())
            .subscribe((res: any) => {

                if (res.code === 0) {
                    this.msg.success('面试通知发送成功', { nzDuration: 3000 });
                    this.loading = false;
                    this.router.navigate(['/recruit/interview']);
                } else {
                    // this.msg.success('失败', { nzDuration: 3000 });
                    this.msg.error(res.message, { nzDuration: 3000 });
                    this.loading = false;
                }

            }, response => {
                // this.error = `账户或密码错误`;
                // console.log('POST call in error', response);
                return;
            });
        } else {
            obj['resumeId'] = this.detailData.resumeId;
            this.http.patch(this.url + '/service/interview/' +  this.resumeGuid, obj)
            // .map(res => res.json())
            .subscribe((res: any) => {

                if (res.code === 0) {
                    this.msg.success('面试通知发送成功', { nzDuration: 3000 });
                    this.loading = false;
                    this.router.navigate(['/recruit/interview']);
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
    }
     // 查看offer返回
     handleCanceloffer() {
        this.isVisibleNotice = false; 
    }
    // 查看面试通知
    showInterview() {
        const obj = this.form.value;
        // 面试官
        obj['interviewerName'] = this.selectPeopleNameCopy;
        obj['interviewerId'] = this.selectPeopleIdCopy;
        // 负责人
        obj['responsibleName'] = this.selectName;
        obj['responsibleId'] = this.selectId;
        if (this.entry !== 'modify') {
            obj['resumeId'] = this.detailData.guid;
        } else {
            obj['resumeId'] = this.detailData.resumeId;
        }

        // obj['resumeId'] = this.detailData.guid;
        // 日期的处理
        if (this.form.get('interviewDate').value) {
            const interviewDate = new Date(this.form.get('interviewDate').value);
            obj['interviewDate'] = '' + interviewDate.getFullYear() +
                (interviewDate.getMonth() + 1 < 10 ? '0' + (interviewDate.getMonth() + 1) : (interviewDate.getMonth() + 1)) +
                (interviewDate.getDate() < 10 ? '0' + interviewDate.getDate() : interviewDate.getDate());
        }
        if (this.form.get('interviewTime').value) {
            const interviewTime = new Date(this.form.get('interviewTime').value);
            obj['interviewTime'] = '' +
                (interviewTime.getHours() < 10 ? '0' + (interviewTime.getHours()) : (interviewTime.getHours())) +
                (interviewTime.getMinutes() < 10 ? '0' + interviewTime.getMinutes() : interviewTime.getMinutes()) +
                (interviewTime.getSeconds() < 10 ? '0' + interviewTime.getSeconds() : interviewTime.getSeconds());
        }
        // localStorage.setItem('info', JSON.stringify(obj));
        // this.router.navigate(['/recruit/resume/interview', this.detailData.guid]);  
        // window.open( '/#/recruit/resume/interview/' + this.detailData.guid); 
      
        let  param = {
            userId: '',
            enterpriseId: '',
            resumeId: '',
            interviewPostion: '',
            interviewDate: '',
            interviewTime: '',
            interviewAddress: '',
            interviewNotifyEmailTemplateId: '',
            responsibleName: '',
            responsiblePhone: '',
        };
        param = Object.assign(param, obj);
        if (this.reuseTabService.get().type === 1) {
            param.userId = this.reuseTabService.get().guid;
        } else {
            param.userId = this.reuseTabService.get().userId;
        }
        param.enterpriseId = this.reuseTabService.get().guid;

        this.http.get(this.url + '/service/interview/view', {
            params: param
        }).subscribe((res: any) => {
            if (res.code === 0) {
                // console.log(res.data);
                this.isVisibleNotice = true;
                this.inteviewNoticeTitle = res.data.title;
                this.inteviewNoticeContent = res.data.content;
            } else {
                this.msg.error(res.message, { nzDuration: 3000 });
                this.inteviewNoticeTitle = '';
                this.inteviewNoticeContent = '';
            }
            
        }); 
    }
}


