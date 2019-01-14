import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
    public form: FormGroup;
    public submitting = false;
    tabs: any[] = [{
        key: 'menu/index',
        tab: '角色管理',
    }
    ];
    public guid = '';
    public formData = {
        roleCode: '',
        roleMark: '',
        roleName: '',
        roleScope: ''
    };
    public url = environment.HRM_URL + 'service';

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
        const body = new HttpParams()
            .set('roleCode', this.formData.roleCode)
            .set('roleMark', this.formData.roleMark)
            .set('roleName', this.formData.roleName)
            .set('roleScope', this.formData.roleScope);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        if (this.guid !== '0') {
            this.http.patch(this.url + '/hrm-role/' + this.guid, this.formData, {headers: headers}).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('修改成功');
                    this.router.navigate(['/companyadmin/role']);
                }
            });
        } else {
            this.http.post(this.url + '/hrm-role', this.formData, {headers: headers}).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('新增成功');
                    this.router.navigate(['/companyadmin/role']);
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
                        if (res.data.isTemplet === 0) {
                            res.data.isTemplet = '0';
                        } else {
                            res.data.isTemplet = '1';
                        }
                        this.formData = res.data;
                    } else {
                        this.msg.error(res.message);
                    }
                });
        }
    }

    ngOnInit() {
        this.getData();
        this.form = this.fb.group({
            roleName: [this.formData.roleName, [Validators.required]],
            roleScope: [this.formData.roleScope, [Validators.required]]
        });
    }

}
