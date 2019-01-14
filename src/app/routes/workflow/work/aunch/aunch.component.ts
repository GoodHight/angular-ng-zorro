import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FileTemplateComponent} from '@shared/file-template/file-template.component';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {environment} from '@env/environment';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-workflow-aun',
    templateUrl: './aunch.component.html',
    styleUrls: ['./aunch.component.less']
})
export class AunchComponent implements OnInit {

    form: FormGroup;
    isCollapsed = false;
    dateFormat = 'yyyyMMdd';
    selectDataType = [{
        guid: '1',
        dictName: '年假'
    }, {
        guid: '2',
        dictName: '事假'
    }, {
        guid: '3',
        dictName: '病假'
    }, {
        guid: '4',
        dictName: '调休'
    }, {
        guid: '5',
        dictName: '产假'
    }, {
        guid: '6',
        dictName: '陪产假'
    }, {
        guid: '7',
        dictName: '婚假'
    }, {
        guid: '8',
        dictName: '例假'
    }, {
        guid: '9',
        dictName: '丧假'
    }];
    items = [];
    isVisible = false;
    public guid = this.tokenService.get().loginEid;
    public resumeGuid: any;
    loading = true;
    /*
    * 新增 修改的数据
    * */
    public dataList = {
        initiatorID: this.tokenService.get().userGuid,
        enterpriseID: this.tokenService.get().loginEid,
        processID: '27504',
        businessKey: this.guid,
        userIDs: '',
        desc: '',
        type: '',
        starTime: '',
        endTime: '',
        duration: '',
        remark: ''
    };
    /*
    * 搜索条件
    * */
    public term = {
        enterpriseGuid: this.tokenService.get().loginEid,
        key: '',
        departmentGuid: '',
        employeeState: '1',
        pageNum: '1',
        pageSize: '20'

    };
    /*
    * 部门数据
    * */
    dataLists = [];
    /*
    * 人员数据
    * */
    UserData = [];
    public url = environment.ACTIVITI_URL + 'service';
    public FRAMEWORK_URL = environment.FRAMEWORK_URL + 'service';
    public HRM_URL = environment.HRM_URL + 'service';
    public enterpriseId = this.tokenService.get().loginEid;
    @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

    constructor(private http: HttpClient,
                private fb: FormBuilder, private msg: NzMessageService, private router: Router,
                @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private route: ActivatedRoute) {

    }

    loginEid = this.tokenService.get().loginEid;
    loginUid = this.tokenService.get().userGuid;

    _submitForm() {
        this.loading = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        this.http.post(this.url + '/workflow/start', this.dataList, {headers: headers})
        // .map(res => res.json())
            .subscribe((res: any) => {

                if (res.code === 1) {
                    this.msg.success('发起流程成功', {nzDuration: 3000});
                    this.loading = false;
                    this.router.navigate(['/recruit']);
                } else {
                    this.msg.success(res.message, {nzDuration: 3000});
                    this.loading = false;
                }

            }, response => {
                // this.error = `账户或密码错误`;
                // console.log('POST call in error', response);
                return;
            });
    }

    // 取消
    cancel() {
        this.router.navigate(['/personnel-admin/employee-info/index']);
    }

    /*
    * 弹框的显示与隐藏
    * */
    toggleMask() {
        if (this.isVisible) {
            this.isVisible = false;
        } else {
            this.isVisible = true;
        }
    }

    /*
    * 确认审核人
    * */
    handleOk() {

    }

    /*
    * 获取人员
    * */
    getAccount() {
        this.http.get('http://192.168.0.135:8083/hrm-dev/department/employee', {
            params: {
                enterpriseGuid: this.enterpriseId
            }
        })
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataLists = res.data.children;
                    // this.UserData = res.data.children[0].employees;
                    this.UserData = [];
                }
            });
    }

    ngOnInit(): void {
        this.getAccount();
        this.route.params
            .subscribe((params: Params) => {
                return this.resumeGuid = params['guid'];
            });
        this.form = this.fb.group({
            type: [null, [Validators.required]],
            starTime: [this.dataList.starTime, [Validators.required]],
            endTime: [this.dataList.endTime, [Validators.required]],
            duration: [this.dataList.duration, [Validators.required]],
            remark: [this.dataList.remark, [Validators.required]],

        });
    }

}
