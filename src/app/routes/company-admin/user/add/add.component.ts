import {Component, Inject, OnInit} from '@angular/core';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {environment} from '@env/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {

    public form: FormGroup;
    public submitting = false;
    tabs: any[] = [{
        key: 'user/add',
        tab: '新增子账户',
    }
    ];
    public q: any = {
        pi: 1,
        ps: 200,
        description: '',
        employeeState: '',
        sorter: '',
        status: null,
        statusList: []
    };
    public guid = '';
    public dataList = '';
    public formData = {
        employeeGuid: ''
    };
    public url = environment.HRM_URL + 'service';
    public loginEid = this.tokenService.get().loginEid;

    constructor(private http: HttpClient, private fb: FormBuilder, public msg: NzMessageService, private router: Router, private activatedRoute: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
        this.activatedRoute.params
            .subscribe((params: Params) => {
                return this.guid = params['guid'];
            });
    }

    /*
    * 提交
    * */
    public submit() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        if (this.guid !== '0') {
            this.http.patch(this.url + '/hrm-role/' + this.guid, this.formData, {headers: headers}).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('修改成功');
                    this.router.navigate(['/companyadmin/role']);
                }
            });
        } else {
            this.http.post(this.url + '/hrm-virtual-user', null, {
                headers: headers,
                params: this.formData
            }).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('新增成功');
                    this.router.navigate(['/companyadmin/user']);
                } else {
                    this.msg.error(res.message);
                }
            });
        }
    }

    /*
    * 编辑获取数据
    * */
    private getData() {
        if (this.guid !== '0') {
            this.http.get(this.url + '/hrm-role/' + this.guid)
                .subscribe((res: any) => {
                    if (res.code === 1) {
                        this.formData = res.data;
                    } else {
                        this.msg.error(res.message);
                    }
                });
        }
    }

    /*
  * 获取员工数据
  * */
    private getEmployeeData() {
        const _params = new HttpParams()
            .set('pageNum ', this.q.pi)
            .set('key', '')
            .set('employeeState', this.q.employeeState)
            .set('enterpriseGuid', this.loginEid)
            .set('pageSize', this.q.ps);
        this.http.get(this.url + '/employee/search', {params: _params})
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataList = res.data;
                } else {
                    this.msg.error(res.message);
                }
            });
    }

    ngOnInit() {
        this.getData();
        this.getEmployeeData();
        this.form = this.fb.group({
            employeeGuid: [this.formData.employeeGuid, [Validators.required]]
        });
    }

}
