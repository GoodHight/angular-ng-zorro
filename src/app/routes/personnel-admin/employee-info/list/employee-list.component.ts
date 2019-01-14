import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
    selector: 'app-employee-list',
    styleUrls: ['./employee-list.component.less'],
    templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
    public dataList: any[] = [];
    public q: any = {
        pi: 1,
        ps: 20,
        total: 0,
        description: '',
        employeeState: '0',
        sorter: '',
        status: null,
        statusList: []
    };
    employeeStateList = [{
        dictName: '全部',
        guid: '0'
    }, {
        dictName: '在职',
        guid: '1'
    }, {
        dictName: '离职',
        guid: '2'
    }];
    categoryList = [{
        dictName: '已开具',
        guid: '1'
    }, {
        dictName: '未开具',
        guid: '0'
    }, {
        dictName: '不需要',
        guid: '-1'
    }];
    public serachType = 0;
    public data: any[] = [];
    public key = '';
    public statistics = {
        birthday: '',
        date: '',
        entry: '',
        onJob: '',
        positive: '',
        quit: ''
    }; // 统计信息
    // 编号
    public code = 1;
    public newests: any = [];
    loading = false;
    selectedRows: any[] = [];
    curRows: any[] = [];
    totalCallNo = 0;
    allChecked = false;
    indeterminate = false;
    sortMap: any = {};
    modalVisible = false;
    description = '';
    private enterpriseGuid = this.token.get().guid;
    url = environment.SERVER_URL + environment.ENTERPRISE_URL;
    private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
    public state = 0;
    userID = '';
    status = '';
    isVisible = false;
    isVisibles = false;
    deleteguid = '';
    public form: FormGroup;
    dateFormat: 'yyyyMMdd';
    fileList = [[]];
    turnoverList: any = [];
    previewImage = '';
    uploaderGradUrl = '';
    previewVisible = false;
    fileId = '';
    name = '';
    phone = '';
    employeeGuid = '';
    deptName = '';
    jobNumber = '';
    position = '';
    entryTime = '';
    tgguid = '';
    peopledata = {};
    employeeStation = {};
    pageNum: any = 1;
    pageSize: any = 100;

    constructor(private fb: FormBuilder, private http: HttpClient, public msg: NzMessageService, private router: Router, @Inject(DA_SERVICE_TOKEN) private token: ITokenService) {
    }

    @Output() click = new EventEmitter();

    ngOnInit() {
        this.getData(null);
        this.loadTemplate();
        this.getTypeTurnover();
        if (this.token.get().type === 1) {
            this.userID = this.token.get().guid;
        } else {
            this.userID = this.token.get().userId;
        }
        this.uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.token.get().guid + '&escrowType=DIMISSION_FILE' + '&loginEid=' + this.token.get().guid;
        this.form = this.fb.group({
            handoverName: ['', [Validators.required]], //
            dimissionaTime: ['', [Validators.required]], //
            reason: ['', [Validators.required]], //
            needDimission: [''], //
            dimissionType: ['', [Validators.required]], //
        });
    }
    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    /*
* 获取下拉框数据
* */
    getTypeTurnover() {
        this.http.get(this.dictionaryUrl + 'service/dictionary/type', {
            params: {
                dictType: 'DIMISSION_TYPE',
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.turnoverList = res.data;
            }
        });
    }

    // 上传的监控
    handleChange(info: { file: UploadFile }, type: any): void {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.msg.success('上传成功');
            // const length = this.fileList.length;
            const length = this.fileList[0].length;
            this.fileId = info.file.response.data || '';
            const obj1 = {
                uid: info.file.uid,
                name: info.file.name,
                status: 'done',
                url: './assets/img/template/other.png',
            };
            this.fileList[0][length - 1] = obj1;
        } else if (info.file.status === 'removed') {
            this.fileId = '';
            // this.delFileIds.push(info.file.response.data);
        }
    }
    // 办理离职 - -
    leaveBtn(guid, name, phone, jobNumber, deptName, position, entryTime): void {
        this.fileList[0] = [];
        this.fileId = '';
        this.form.setValue({
            handoverName: '',
            dimissionaTime: '',
            reason: '',
            needDimission: '',
            dimissionType: ''
        });
        this.isVisibles = true;
        this.tgguid = guid;
        this.name = name;
        this.phone = phone;
        this.deptName = deptName;
        this.jobNumber = jobNumber;
        this.position = position;
        this.entryTime = entryTime;
        this.http.get(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/employee/' + guid).subscribe((res: any) => {
            if (res.code === 0) {
                this.peopledata = res.data;
                this.employeeStation = res.data.employeeStation.departmentId;
            } else {
                this.msg.error(res.message);
            }
        });

    }

    leaveOk(): void {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const objs = {};
        const obj = JSON.parse(JSON.stringify(this.form.value));
        obj['departmentId'] = this.employeeStation;
        obj['departmentName'] = this.deptName;
        obj['employeeGuid'] = this.tgguid;
        obj['enterpriseGuid'] = this.token.get().guid;
        obj['dimissionaTime'] = this.dateTransformToString(obj['dimissionaTime']);
        obj['entryTime'] = this.entryTime;
        obj['fileId'] = this.fileId;
        obj['jobNumber'] = this.jobNumber;
        obj['phone'] = this.phone;
        obj['position'] = this.position;
        obj['name'] = this.name;
        obj['userGuid'] = this.userID;
        // console.log(obj);
        if (obj.dimissionaTime === null || obj.dimissionaTime === '') {
            return;
        }
        if (obj.reason === null || obj.reason === '') {
            return;
        }
        if (obj.dimissionType === null || obj.dimissionType === '') {
            return;
        }
        if (obj.handoverName === null || obj.handoverName === '') {
            return;
        }
        this.http.post(this.url + 'service/enterprise/dimission', obj, { headers: headers })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    // this.dataList = res.data;
                    this.msg.success('办理成功');
                    this.router.navigate(['/personnel-admin/leave-management/leave-list']);
                } else {
                    this.msg.error(res.message);
                }
                this.loading = false;
            }, response => {
                this.msg.error('系统异常');
                return;
            });
        this.isVisibles = false;
        this.form.reset();
    }

    leaveCancel(): void {
        this.isVisibles = false;
        this.form.reset();
    }
    // 办理离职 + + 


    /*
    * 搜索框
    * */
    showSerach() {
        this.serachType = 1;
    }

    /*
   * 回车搜索
   * */
    public enterSearch(e) {
        const keyCode = window.event ? e.keyCode : e.which;
        if (keyCode === 13) {
            this.q.pageNum = 1;
            this.getData(null);
        }
    }
    /*
        * 条件搜索
        * */
    public serachAction() {
        this.q.pageNum = 1;
        this.getData(null);
    }

    // 默认列表
    getData(callbackfun) {
        // console.log(this.q.employeeState);

        this.loading = true;
        const loginEid = this.token.get().guid;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const _params = new HttpParams()
            .set('pageNum ', this.q.pi)
            .set('key', this.key)
            .set('employeeState', this.q.employeeState)
            .set('enterpriseGuid', this.enterpriseGuid)
            .set('pageSize  ', this.q.ps);
        this.http.get(this.url + 'service/employee/enterprise/key', {
            params: {
                pageNum: this.q.pi,
                key: this.key,
                status: this.q.employeeState,
                enterpriseGuid: loginEid,
                pageSize: this.q.ps
            }
        })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.dataList = res.data;
                    this.loading = false;
                    this.serachType = 0;
                    this.q.total = res.total;
                    if (callbackfun) {
                        callbackfun();
                    }
                } else {
                    this.msg.error('没有数据');
                    this.loading = false;
                }
            }, response => {
                // console.log('服务器错误');
                return;
            });
    }
    employeeStateChange(e) {
        this.q.employeeState = e;
        this.getData(null);
    }
    loadTemplate() {
        // 统计信息
        this.http.get(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/employee/workbench/' + this.token.get().guid).subscribe((res: any) => {
            if (res.code === 0) {
                this.statistics = res.data;
            } else {
                this.statistics = {
                    birthday: '',
                    date: '',
                    entry: '',
                    onJob: '',
                    positive: '',
                    quit: ''
                };
                this.msg.error(res.message);
            }
        });
    }

    add() {
        this.modalVisible = true;
        this.description = '';
    }

    save() {
        this.loading = true;
        this.http.post('/rule', { description: this.description }).subscribe(() => {
            this.getData(null);
            setTimeout(() => this.modalVisible = false, 500);
        });
    }

    details(guid: any) {
        this.router.navigate(['/personnel-admin/employee-info/indexs', guid]);
    }

    regularWorker(guid: any, realName: any, workPhone: any, departmentName: any) {
        const body = new HttpParams()
            .set('guid', guid)
            .set('realName', realName)
            .set('departmentName', departmentName)
            .set('workPhone', workPhone);
        this.http.patch(this.url + '/employee/' + guid, body)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataList = res.data;
                    this.msg.success('修改员工状态成功');
                    this.loading = false;
                }
                if (res.code === 0) {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            }, response => {
                this.msg.error('服务器错误');
                return;
            });
    }

    dimission(guid: any, realName: any, workPhone: any, departmentName: any) {
        const body = new HttpParams()
            .set('guid', guid)
            .set('realName', realName)
            .set('departmentName', departmentName)
            .set('workPhone', workPhone);
        this.http.patch(this.url + '/employee/' + guid, body)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataList = res.data;
                    this.msg.success(res.data);
                    this.loading = false;
                }
                if (res.code === 0) {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    patch(guid: any, type: any, status: any) {
        if (status === 'flase') {
            this.status = '2';
        } else if (status === 'true') {
            this.status = '3';
        }
        let state: any;
        if (type === '0') {
            state = this.http.delete(this.url + 'service/employee/', {
                params: {
                    guids: guid,
                }
            });
        }
        if (type === '1') {
            state = this.http.patch(this.url + 'service/employee/disable/' + guid + '?userId=' + this.userID + '&enterpriseId=' + this.token.get().guid + '&status=' + this.status, {});
        }
        state.subscribe((res: any) => {
            if (res.code === 0) {
                if (type === '0') {
                    this.msg.success('删除成功');
                } else {
                    this.msg.success('修改员工状态成功');
                }
                // this.getData(null);
                this.repeatRequest();
                this.loading = false;
            } else {
                this.msg.error(res.message);
                this.loading = false;
            }
        });

    }
    delete(guid) {
        this.deleteguid = guid;
        this.isVisible = true;

    }
    handleOk(): void {
        this.http.delete(this.url + 'service/employee/', {
            params: {
                guids: this.deleteguid,
                userId: this.userID,
                enterpriseId: this.token.get().guid,
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                this.msg.success('删除成功');
                this.repeatRequest();
                // this.getData(null);
                this.loading = false;
            } else {
                this.msg.error(res.message);
                this.loading = false;
            }
        });
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }
    approval() {
        this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
    }

    clear() {
        this.selectedRows = [];
        this.totalCallNo = 0;
        this.data.forEach(i => i.checked = false);
        this.refreshStatus();
    }

    checkAll(value: boolean) {
        this.curRows.forEach(i => {
            if (!i.disabled) i.checked = value;
        });
        this.refreshStatus();
    }

    refreshStatus() {
        const allChecked = this.curRows.every(value => value.disabled || value.checked);
        const allUnChecked = this.curRows.every(value => value.disabled || !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.selectedRows = this.data.filter(value => value.checked);
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
    }

    sort(field: string, value: any) {
        this.sortMap = {};
        this.sortMap[field] = value;
        this.q.sorter = value ? `${field}_${value}` : '';
        this.getData(null);
    }

    dataChange(res: any) {
        this.curRows = res;
        // this.refreshStatus();
    }
    searchData(reset: boolean = false): void {
        if (reset) {
            this.q.pi = 1;
        }
    }
    /*
    * 分页以及编号的问题
    * */
    pageChange(pi: number): void {
        if (pi === 0) {
            return;
        }
        this.loading = true;
        if (pi === 1) {
            this.code = 1;
        } else {
            this.code = ((pi - 1) * 20) + 1;
        }
        this.q.pi = pi;
        this.getData(null);
    }

    reset(ls: any[]) {
        for (const item of ls) item.value = false;
    }
    /**
    * 将时间转换成yyyyMMddHHmmss类型的字符串
    * @param inDate 
    */
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

    repeatRequest(): Promise<any> {
        return new Promise((resolve) => {
            this.getData(resolve);
        }).then((res) => {
            if (this.dataList.length < 1) {
                this.q.pi = this.q.pi - 1;
                if (this.q.pi <= 0) {
                    this.q.pi = 1;
                }
                this.getData(null);
            }
        });
    }
    // 导出列表
    exportList() {
        const fileUrl = this.url + 'service/employee/exportReport?enterpriseGuid=' + this.enterpriseGuid + '&key=' + this.key;
        window.open(fileUrl);
        //  location.href = fileUrl;
    }
}
