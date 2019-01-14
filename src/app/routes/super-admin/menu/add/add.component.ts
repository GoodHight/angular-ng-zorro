import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '@env/environment';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {

    public form: FormGroup;
    public dataList: any [];
    public submitting = false;
    tabs: any[] = [{
        key: 'menu/index',
        tab: '功能信息',
    }
    ];
    public guid = '';
    public type = '';
    public formData = {
        menuAction: '/',
        menuActionId: '/',
        menuCss: 'css',
        menuName: '',
        menuOrder: '1',
        menuParentGuid: '',
        menuBackStyle: '',
        menuIconStyle: '',
        menuLineStyle: '',
        dataScopeIndex: 0
    };
    public url = environment.HRM_URL + 'service';

    constructor(private http: HttpClient, private fb: FormBuilder, public msg: NzMessageService, private router: Router, private activatedRoute: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
        this.activatedRoute.params
            .subscribe((params: Params) => {
                this.guid = params['guid'];
                return this.type = params['type'];
            });
    }

    public thisUrl = this.url + '/hrm-menu/';

    /*
    * 提交
    * */
    public submit() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.valid) {
            const headers = new HttpHeaders().set('Content-Type', 'application/json');
            this.formData.menuActionId = this.formData.menuAction;
            let navUrl = '/admin/menu/index';
            if (this.type === '1') {
                this.thisUrl = this.url + '/app-menu/';
                navUrl = '/admin/menu/iphone-index';
            }
            if (this.guid !== '0') {
                if (!this.formData.menuParentGuid) {
                    this.formData.menuParentGuid = '';
                }
                this.http.patch(this.thisUrl + this.guid, this.formData, {headers: headers}).subscribe((res: any) => {
                    if (res.code === 1) {
                        this.msg.success('修改成功');
                        this.router.navigate([navUrl]).then();
                    }
                });
            } else {
                this.http.post(this.thisUrl, this.formData)
                    .subscribe((res: any) => {
                        if (res.code === 1) {
                            this.msg.success('新增成功');
                            this.router.navigate([navUrl]).then();
                        } else {
                            this.msg.error(res.message);
                        }
                    });
            }
        }
    }

    /*
    * 编辑获取数据
    * */
    private getData() {
        // console.log(1);
        if (this.type === '1') {
            this.thisUrl = this.url + '/app-menu/';
        }
        // console.log(this.guid);
        if (this.guid !== '0') {
            this.http.get(this.thisUrl + this.guid)
                .subscribe((res: any) => {
                    if (res.code === 1) {
                        this.formData = res.data;
                        // console.log(this.formData);
                        if (!this.formData.menuAction) {
                            this.formData.menuAction = res.data.menuActionId;
                        }
                    } else {
                        this.msg.error(res.message);
                    }
                });
        }
    }

    /*
    * 获取一级菜单
    * */
    public getDataList() {
        if (this.type === '1') {
            this.thisUrl = this.url + '/app-menu/';
        }
        this.http.get(this.thisUrl)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataList = res.data;
                }
            });
    }

    ngOnInit() {
        this.getData();
        this.getDataList();
        this.form = this.fb.group({
            menuAction: [this.formData.menuAction, [Validators.required]],
            menuParentGuid: [this.formData.menuParentGuid],
            menuCss: [this.formData.menuCss, [Validators.required]],
            menuName: [this.formData.menuName, [Validators.required]],
            menuBackStyle: [this.formData.menuBackStyle, [Validators.required]],
            menuIconStyle: [this.formData.menuIconStyle, [Validators.required]],
            menuLineStyle: [this.formData.menuLineStyle, [Validators.required]],
            dataScopeIndex: [0]
        });
    }
}
